require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Setup using Environment Variable
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Example: https://wishcraft-frontend.vercel.app
    credentials: true, // Keep this if your frontend uses cookies or auth headers
  })
);

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const wishRoutes = require("./routes/wishes");

app.use("/api/auth", authRoutes);
app.use("/api/wishes", wishRoutes);

// MongoDB Connection
mongoose
  .connect(
    `${process.env.MONGODB_URI}/bucketbliss` || "mongodb://localhost:27017/bucketbliss"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection error:", err));

app.get("/", (req, res) => {
  res.send("Welcome to WishCraft API!");  
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
