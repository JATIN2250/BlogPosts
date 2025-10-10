// server.js

require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors"); // <-- 1. CORS KO IMPORT KAREIN
const blogRoutes = require("./routes/blogRoutes");

// Middleware
app.use(cors()); // <-- 2. SABSE PEHLE CORS MIDDLEWARE USE KAREIN
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Blog API routes
app.use("/api/blogs", blogRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Blog API running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));