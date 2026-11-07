const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
// Local development CORS
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true,
        })
    );
}
// API test route
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Flexora API!",
    });
});
// IMPORTANT: Mount authentication routes
app.use("/api/auth", authRoutes);
// Return JSON for unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});
// React production build
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));
// React routing fallback
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }
    res.sendFile(path.join(frontendPath, "index.html"));
});
// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Flexora running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};
startServer();
