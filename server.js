//mongodb
require('./config/db');
const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./api/User');
const SeatRouter = require('./api/Seat');

//For accepting post from data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter);
app.use('/seat', SeatRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})