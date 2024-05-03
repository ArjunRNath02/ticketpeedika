const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    mail: String,
    pass: String,
    pnum: String,
})

const User = mongoose.model('User', UserSchema);

module.exports = User;