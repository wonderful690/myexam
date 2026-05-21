const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["auditorium", "coworking", "cinema"],
    required: true,
  },
  capacity: Number,
  description: String,
  image: String,
  pricePerHour: Number,
});

module.exports = mongoose.model("Room", roomSchema);
