const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        required: true,
        unique: true,
    },

    plan: {
        type: String,
        enum: ["free_trial", "basic", "premium", "enterprise"],
        default: "free_trial",
    },

    status: {
        type: String,
        enum: ["trialing", "active", "expired", "cancelled"],
        default: "trialing",
    },

    trialStart: {
        type: Date,
        default: Date.now,
    },

    trialEnd: {
        type: Date,
        required: true,
    },

    currentPeriodEnd: Date,
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);