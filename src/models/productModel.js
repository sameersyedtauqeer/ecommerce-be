const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: String,
    brand: String,
    color: [String],
    size: [String],
    coverImage: String,
    sampleImages: [String],
})

const productModel = mongoose.model('product', productSchema);
module.exports = productModel