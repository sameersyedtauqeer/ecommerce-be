const mongoose = require("mongoose")

const notificationScheme = new mongoose.Schema({
    type: {
        default: "admin",
        type: String
    },
    title: String,
    address: String,
    order_no: String,
    order_id: String,
    is_read: {
        default: false,
        type: Boolean
    }
})

const notifiModel = mongoose.model("notification", notificationScheme);
module.exports = notifiModel