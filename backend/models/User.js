const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ["gym_owner", "member", "super_admin"],
        required: true,
        default: "member",
    },
    profilePhoto: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
    },
}, { timestamps: true });
// Password hashing
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});
// Password comparison
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);