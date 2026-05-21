const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, [
  body('roomId').notEmpty(),
  body('date').isISO8601(),
  body('paymentMethod').isIn(['card', 'invoice', 'cash'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: req.body.roomId,
      date: req.body.date,
      paymentMethod: req.body.paymentMethod
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'fullName username');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/:id/review', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Заявка не найдена' });
    
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Отзыв можно оставить только после завершения мероприятия' });
    }

    booking.review = { text: req.body.text, rating: req.body.rating, createdAt: new Date() };
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;