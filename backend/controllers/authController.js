const User = require("../models/User");
const Gym = require("../models/Gym");
const Branch = require("../models/Branch");
const Membership = require("../models/Membership");
const Subscription = require("../models/Subscription");

const generateTokens = require("../utils/generateTokens");

// Register
exports.register = async(req, res) => {
    let createdUser;
    let createdGym;

    try {
        const {
            name,
            email,
            contact,
            password,
            role,
            gymId,
            branchId,
        } = req.body;

        if (!name || !email || !contact || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        if (!["member", "gym_owner"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration role.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters.",
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanContact = contact.trim();

        const existingUser = await User.findOne({
            $or: [
                { email: cleanEmail },
                { contact: cleanContact },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email or contact number already registered.",
            });
        }

        createdUser = await User.create({
            name,
            email: cleanEmail,
            contact: cleanContact,
            password,
            role,
        });

        // MEMBER REGISTRATION
        if (role === "member") {
            if (gymId) {
                const gym = await Gym.findOne({
                    _id: gymId,
                    status: "approved",
                });

                if (!gym) {
                    throw new Error("Selected gym is not available.");
                }

                let selectedBranch = null;

                if (branchId) {
                    selectedBranch = await Branch.findOne({
                        _id: branchId,
                        gymId: gym._id,
                        status: "active",
                    });

                    if (!selectedBranch) {
                        throw new Error("Invalid gym branch selected.");
                    }
                }

                await Membership.create({
                    userId: createdUser._id,
                    gymId: gym._id,
                    branchId: selectedBranch?.id || null,
                    status: "pending",
                });
            }
        }

        // GYM OWNER REGISTRATION
        if (role === "gym_owner") {
            const {
                gymName,
                gymLogo,
                gymEmail,
                gymContact,
                whatsapp,
                website,
                description,
                category,
                establishmentYear,
                gstNumber,
                address,
                facilities,
                branches,
            } = req.body;

            if (!gymName || !gymEmail || !gymContact || !address?.fullAddress ||
                !address ?.city || !address ?.state) {
                throw new Error("Please complete all required gym details.");
            }

            createdGym = await Gym.create({
                ownerId: createdUser._id,
                gymName,
                logo: gymLogo || "",
                email: gymEmail.toLowerCase().trim(),
                contact: gymContact,
                whatsapp: whatsapp || "",
                website: website || "",
                description: description || "",
                category: category || "Fitness",
                establishmentYear: establishmentYear || null,
                gstNumber: gstNumber || "",
                address,
                facilities: facilities || [],
                status: "pending",
            });

            const branchList = branches ?.length ?
                branches : [{
                    branchName: "Main Branch",
                    contact: gymContact,
                    address: address.fullAddress,
                    city: address.city,
                    pincode: address.pincode,
                }];

            const validBranches = branchList.map((branch) => ({
                gymId: createdGym._id,
                branchName: branch.branchName,
                managerName: branch.managerName || "",
                contact: branch.contact,
                address: branch.address,
                city: branch.city || address.city,
                pincode: branch.pincode || address.pincode,
                openingTime: branch.openingTime || "06:00",
                closingTime: branch.closingTime || "22:00",
            }));

            if (validBranches.some(
                    (branch) => !branch.branchName || !branch.contact || !branch.address
                )) {
                throw new Error("Please complete all required branch details.");
            }

            await Branch.insertMany(validBranches);

            const trialStart = new Date();
            const trialEnd = new Date(trialStart);
            trialEnd.setDate(trialEnd.getDate() + 14);

            await Subscription.create({
                gymId: createdGym._id,
                plan: "free_trial",
                status: "trialing",
                trialStart,
                trialEnd,
            });
        }

        generateTokens(createdUser, res);

        return res.status(201).json({
            success: true,
            message: role === "gym_owner" ?
                "Registration successful! Your gym is pending admin approval." : "Account created successfully!",
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role,
            },
            gym: createdGym ? {
                id: createdGym._id,
                gymName: createdGym.gymName,
                status: createdGym.status,
            } : null,
        });

    } catch (error) {
        // Roll back partially created registration records
        if (createdGym) {
            await Promise.all([
                Branch.deleteMany({ gymId: createdGym._id }),
                Subscription.deleteOne({ gymId: createdGym._id }),
                Gym.deleteOne({ _id: createdGym._id }),
            ]);
        }

        if (createdUser) {
            await Membership.deleteMany({ userId: createdUser._id });
            await User.deleteOne({ _id: createdUser._id });
        }

        console.error("Registration Error:", error);

        return res.status(400).json({
            success: false,
            message: error.code === 11000 ?
                "Email or contact number already exists." : error.message || "Registration failed.",
        });
    }
};

// LOGIN
exports.login = async(req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/contact and password are required.",
            });
        }

        const cleanIdentifier = identifier.trim();

        const user = await User.findOne({
            $or: [
                { email: cleanIdentifier.toLowerCase() },
                { contact: cleanIdentifier },
            ],
        }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email/contact or password.",
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive or blocked.",
            });
        }

        generateTokens(user, res);

        let gym = null;

        if (user.role === "gym_owner") {
            gym = await Gym.findOne({ ownerId: user._id })
                .select("gymName status");
        }

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            gym,
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
        });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    res.clearCookie("flexora_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return res.json({
        success: true,
        message: "Logged out successfully.",
    });
};

// CURRENT LOGGED-IN USER
exports.getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user || user.status !== "active") {
            return res.status(401).json({
                success: false,
                message: "Account not available.",
            });
        }

        const gym = user.role === "gym_owner" ?
            await Gym.findOne({ ownerId: user._id }) :
            null;

        res.json({
            success: true,
            user,
            gym,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch user.",
        });
    }
};

// PUBLIC GYM LIST FOR MEMBERS
exports.getGyms = async(req, res) => {
    try {
        const gyms = await Gym.find({ status: "approved" })
            .select("gymName logo address category");

        const result = await Promise.all(
            gyms.map(async(gym) => {
                const branches = await Branch.find({
                    gymId: gym._id,
                    status: "active",
                }).select("branchName city");

                return {
                    ...gym.toObject(),
                    branches,
                };
            })
        );

        res.json({
            success: true,
            gyms: result,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch gyms.",
        });
    }
};