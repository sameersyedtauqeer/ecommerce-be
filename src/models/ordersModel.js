const mongoose = require("mongoose")

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

})

const ordersModel = mongoose.model("order", orderSchema)
module.exports = ordersModel