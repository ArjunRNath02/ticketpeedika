const express = require('express');
const router = express.Router();
const Seat = require('./../models/Seat');

// Route for booking seats
router.post('/book-seats', async (req, res) => {
    let { date, month, year, mall, titleName, time, seatsArray } = req.body;

    try {
        // Check if the seat with the same details already exists
        const existingSeat = await Seat.findOne({
            date,
            month,
            year,
            mall,
            titleName,
            time,
            seats: seatsArray, // Assuming seatsArray contains the selected seat numbers
        });

        if (existingSeat) {
            // Seat with the same details already booked
            return res.status(400).json({
                status: 'FAILED',
                message: 'Seat with the same details has already been booked.',
            });
        }

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

        await newSeat.save();

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

// Route for getting booked seats
router.get('/get-booked-seats', async (req, res) => {
    try {
        // Query the Seat model to retrieve all booked seats
        const bookedSeats = await Seat.find();

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Booked seats retrieved successfully',
            data: bookedSeats,
        });
    } catch (error) {
        console.error('Error retrieving booked seats:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred while retrieving booked seats',
        });
    }
});

module.exports = router;
