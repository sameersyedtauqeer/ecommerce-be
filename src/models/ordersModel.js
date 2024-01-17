const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const orderSchema = new mongoose.Schema({
    // userId: String,
    name: String,
    email: String,
    address: String,
    paymentMethod: String,
    orderStatus: {
        type: String,
        default: "Pending"
    },
    orderNo: String,
    product: [],
    subTotal: String,
    // deliveryCharge: String,
    // totalAmount: String,
    user_id: String

}, { timestamps: true })

const ordersModel = mongoose.model("order", orderSchema)
module.exports = ordersModel