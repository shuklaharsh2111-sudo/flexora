const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        required: true,
    },

    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        default: null,
    },

    status: {
        type: String,
        enum: ["active", "pending", "expired", "cancelled"],
        default: "pending",
    },

    joinedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

membershipSchema.index({ userId: 1, gymId: 1 }, { unique: true });

module.exports = mongoose.model("Membership", membershipSchema);