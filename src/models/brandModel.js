const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    brandName: String
});

const brandModel = mongoose.model("brand", brandSchema);
module.exports = brandModel;