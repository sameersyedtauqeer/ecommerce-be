const mongoose = require("mongoose")

const newProductSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: String,
    category: String,
    category_id: String,
    sub_category: String,
    sub_categoryId: String,
    brand: String,
    brand_id: String,
    slug :String,
    // sampleImages: [String],
})

const newProductModel = mongoose.model('new product', newProductSchema);
module.exports = newProductModel