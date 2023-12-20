const mongoose = require("mongoose")

const subCatSchema = new mongoose.Schema({
    main_category: String,
    sub_category: String,
    cat_id: String
})

const subCatModel = mongoose.model("subCategory", subCatSchema);
module.exports = subCatModel