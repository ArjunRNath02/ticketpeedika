const express = require('express');
const router = express.Router();
const Seat = require('./../models/Seat');
const { listenerCount } = require('npm');

// Your other route handling code...

// Example route for booking seats
router.post('/book-seats', (req, res) => {
    let { date, month, year, mall, titleName, time, seatsArray } = req.body;

    try {
        // Create a new Seat document and save it to the database
        const newSeat = new Seat({
            date,
            month,
            year,
            mall,
            titleName,
            time,
            seats: seatsArray, // Assuming seatsArray contains the selected seat numbers
        });

        newSeat.save();

        res.json({
            status: 'SUCCESS',
            message: 'Seats booked successfully!',
            data: newSeat,
        });
    } catch (error) {
        console.error('Error booking seats:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred while booking seats.',
        });
    }
});

module.exports = router;
