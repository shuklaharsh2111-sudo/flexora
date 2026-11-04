const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        required: true,
    },

    branchName: {
        type: String,
        required: true,
    },

    managerName: {
        type: String,
        default: "",
    },

    contact: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    city: String,
    pincode: String,

    openingTime: {
        type: String,
        default: "06:00",
    },

    closingTime: {
        type: String,
        default: "22:00",
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });

module.exports = mongoose.model("Branch", branchSchema);