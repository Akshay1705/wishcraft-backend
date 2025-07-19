const express = require("express");
const router = express.Router();
const Wish = require("../models/Wish");
const authMiddleware = require("../middleware/authMiddleware"); // Authentication middleware

/* 
===================================================
📌 GET all wishes for logged-in user (optional filters)
===================================================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user.userId };

    if (category) filter.category = category;
    if (status) filter.isCompleted = status === "completed";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Wish.countDocuments(filter);

    const wishes = await Wish.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      wishes,
    });
  } catch (err) {
    console.error("GET /wishes error:", err);
    return res.status(500).json({ error: "Failed to fetch wishes" });
  }
});


/* 
===================================================
📌 POST a new wish
===================================================
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, category, targetDate } = req.body;

    const wish = await Wish.create({
      title,
      category,
      targetDate,
      user: req.user.userId,
    });

    return res.status(201).json({ message: "Wish added", wish });
  } catch (err) {
    console.error("POST /wishes error:", err);
    return res.status(500).json({ error: "Failed to add wish" });
  }
});

/* 
===================================================
📌 PUT (update a wish by ID)
===================================================
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = {};

    const { title, category, targetDate, isCompleted } = req.body;

    if (title !== undefined) updateFields.title = title;
    if (category !== undefined) updateFields.category = category;
    if (targetDate !== undefined) updateFields.targetDate = targetDate;
    if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

    const updatedWish = await Wish.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedWish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    return res.status(200).json({ message: "Wish updated", wish: updatedWish });
  } catch (err) {
    console.error("PUT /wishes/:id error:", err);
    return res.status(500).json({ error: "Failed to update wish" });
  }
});

/* 
===================================================
📌 DELETE a wish
===================================================
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const wish = await Wish.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!wish) {
      return res.status(404).json({ error: "Wish not found" });
    }

    return res.status(200).json({ message: "Wish deleted successfully" });
  } catch (err) {
    console.error("DELETE /wishes/:id error:", err);
    return res.status(500).json({ error: "Failed to delete wish" });
  }
});

module.exports = router;
