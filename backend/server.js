// server.js

require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors"); // <-- 1. CORS KO IMPORT KAREIN
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require('./routes/userRoutes');
// Middleware
app.use(cors({
  origin: [
    "https://blogocean.publicvm.com",  // ✅ Allow HTTPS frontend
    "http://blogocean.publicvm.com"    // (optional, if you ever test locally)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
 // <-- 2. SABSE PEHLE CORS MIDDLEWARE USE KAREIN
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Blog API routes
app.use("/api/blogs", blogRoutes);

// Use the user routes

app.use('/api/users',userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Blog API running...");
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));