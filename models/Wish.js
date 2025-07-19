const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    targetDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Connects to User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wish", wishSchema);
