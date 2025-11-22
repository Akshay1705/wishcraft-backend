require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.FRONTEND_URL, // your Vercel URL
  //"http://localhost:5173", // for development
];

// CORS Setup using Environment Variable
app.use(
  cors({
    origin: function (origin, callback) { // Allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
    `${process.env.MONGODB_URI}/bucketbliss` ||
      "mongodb://localhost:27017/bucketbliss"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection error:", err));

// Default API route
app.get("/", (req, res) => {
  res.send("Welcome to WishCraft API!");
});

// ----------------- FIX FOR 404 ON REFRESH -----------------
// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle SPA routing, return index.html for unknown routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// ----------------------------------------------------------

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
