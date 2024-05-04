require('dotenv').config();
const mongoose = require('mongoose');
const Seat = require('../models/Seat');

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB Connected');
        const newSeat = new Seat({
            date: '2024-05-05',
            month: 'May',
            year: '2024',
            mall: 'Sample Mall',
            titleName: 'Sample Movie',
            time: '12:00 PM',
            seats: ['A1', 'A2'],
        });
        
        newSeat.save()
            .then(() => console.log('Seat saved successfully'))
            .catch(err => console.error('Error saving Seat:', err));
    }).catch((err) => console.log(err));