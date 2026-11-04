const mongoose = require("mongoose");
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Atlas Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Error:", error.message);
        throw error;
    }
};
module.exports = connectDB;