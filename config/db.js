require('dotenv').config();
const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB Connected');
        const dummySeat = new Seat({
            date: '2024-05-05',
            month: 'May',
            year: '2024',
            mall: 'Sample Mall',
            titleName: 'Sample Movie',
            time: '12:00 PM',
            seats: ['A1', 'A2'],
        });

        dummySeat.save()
            .then(() => console.log('Dummy Seat saved successfully'))
            .catch(err => console.error('Error saving dummy Seat:', err));
     }).catch((err) => console.log(err));