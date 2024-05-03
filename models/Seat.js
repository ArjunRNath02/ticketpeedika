const mongoose = require('mongoose');

// Define the Seat schema
const seatSchema = new mongoose.Schema({
  date: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  mall: { type: String, required: true },
  titleName: { type: String, required: true },
  time: { type: String, required: true },
  seats: { type: [String], required: true },
});

// Create the Seat model
const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;