const mongoose = require("mongoose")

const deliverySchema = new mongoose.Schema({
    delivery: String
})

const deliveryModel = mongoose.model("delivery", deliverySchema);
module.exports = deliveryModel