const categoryModel = require("../models/categoryModel")


const CategoryController = {
    createCategory: (req, res) => {
        const { category } = req.body
        console.log("category", category)

        if (!category) {
            res.json({
                message: "Category is Required"
            })
            return;
        }

        categoryModel.findOne({ category }).exec()
            .then((data) => {
                if (data) {
                    res.json({
                        message: 'Category already exist',
                        status: false,
                        data
                    })
                }
                else {
                    categoryModel.create({ category: category })
                        .then((result) => {
                            res.json({
                                message: 'Category Added Successfully',
                                status: true,
                                result
                            })
                        })
                        .catch((err) => {
                            res.json({
                                message: "Operation Failed",
                                status: false
                            })
                        })
                }
            })
            .catch((error) => {
                res.json({
                    message: "internal server error",
                    status: false,
                    error
                })
            })
    },

    deleteCategory: (req, res) => {
        const { id } = req.params
        // console.log("cat id", id)
        categoryModel.findByIdAndDelete(id)
            .then((data) => {
                res.json({
                    message: 'Deleted Successfully',
                    status: true,
                    data
                })
            })
            .catch((err) => {
                res.json({
                    message: 'Internal Server Error',
                    status: false,
                    err
                })
            })
    },

    getAllCategory: (req, res) => {
        categoryModel.find({})
            .then((data) => {
                res.json({
                    message: "Fetched Successfully",
                    status: true,
                    data
                })
            })
            .catch((err) => {
                res.json({
                    message: "internal serber error",
                    status: false,
                    err
                })
            })
    },

    updateCategory: (req, res) => {
        const { id, category } = req.body
        console.log(req.body)

        if (!category) {
            return res.json({
                message: "Enter Required field",
                status: false
            })
        }

        categoryModel.findByIdAndUpdate(id, { category: category })
            .exec()
            .then((data) => {
                categoryModel.findById(id).then((result) => {
                    console.log(result)
                    return res.json({
                        message: 'category updated',
                        status: true,
                        data: result
                    })
                })
            })
            .catch((error) => {
                res.json({
                    message: "internal server error",
                    status: false,
                    error
                })
            })
    }
}

module.exports = CategoryController;
