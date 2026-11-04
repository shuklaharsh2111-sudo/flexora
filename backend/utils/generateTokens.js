const jwt = require("jsonwebtoken");

const generateTokens = (user, res) => {
    const token = jwt.sign({
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET, { expiresIn: "7d" }
    );

    res.cookie("flexora_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });

    return token;
};

module.exports = generateTokens;