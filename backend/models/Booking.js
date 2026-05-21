const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  date: { type: Date, required: true },
  paymentMethod: {
    type: String,
    enum: ['card', 'invoice', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'approved', 'completed'],
    default: 'new'
  },
  review: {
    text: String,
    rating: { type: Number, min: 1, max: 5 },
    createdAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);