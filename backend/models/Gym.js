const mongoose = require("mongoose");

const gymSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    gymName: {
        type: String,
        required: true,
        trim: true,
    },

    logo: {
        type: String,
        default: "",
    },

    coverImage: {
        type: String,
        default: "",
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
    },

    contact: {
        type: String,
        required: true,
    },

    whatsapp: {
        type: String,
        default: "",
    },

    website: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },

    category: {
        type: String,
        default: "Fitness",
    },

    establishmentYear: {
        type: Number,
        default: null,
    },

    gstNumber: {
        type: String,
        default: "",
    },

    address: {
        country: { type: String, default: "India" },
        state: String,
        city: String,
        area: String,
        fullAddress: String,
        pincode: String,
    },

    facilities: {
        type: [String],
        default: [],
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "suspended"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Gym", gymSchema);