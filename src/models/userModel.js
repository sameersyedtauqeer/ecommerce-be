const mongoose = require("mongoose")

const userShcema = new mongoose.Schema({
    userName: String,
    email: String,
    phone: String,
    address: String,
    password: String,
    userType: String
})

const userModel = mongoose.model('user', userShcema)
module.exports = userModel