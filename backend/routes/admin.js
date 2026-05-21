const express = require("express");
const Booking = require("../models/Booking");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/bookings", adminProtect, async (req, res) => {
  try {
    const { status, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const sortOption = {};
    if (sort === "date") sortOption.date = 1;
    else if (sort === "newest") sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate("user", "fullName username email phone")
      .populate("room")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
router.patch("/bookings/:id", adminProtect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "approved", "completed"].includes(status)) {
      return res.status(400).json({ message: "Неверный статус" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "fullName username")
      .populate("room");

    if (!booking) return res.status(404).json({ message: "Заявка не найдена" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
