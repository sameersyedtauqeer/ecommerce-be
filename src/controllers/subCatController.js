const subCatModel = require("../models/subCatModel")

const subCatController = {
    createSubCategory: (req, res) => {
        try {
            const { main_category, sub_category, cat_id } = req.body;


            if (!main_category) {
                res.json({
                    message: "Category is Required",
                    status: "error"
                })
                return;
            }

            if (!sub_category) {
                res.json({
                    message: "Sub Category is Required",
                    status: "error"
                })
                return;
            }

            if (!cat_id) {
                res.json({
                    message: "Category Id is Required",
                    status: "error"
                })
                return;
            }

            const ObjToSend = {
                main_category,
                sub_category,
                cat_id
            }

            subCatModel.findOne({ sub_category }).exec()
                .then((data) => {
                    if (data) {
                        res.json({
                            message: 'Sub Category already exist',
                            status: "error",
                        })
                    }
                    else {
                        subCatModel.create(ObjToSend)
                            .then((response) => {
                                res.json({
                                    message: 'Sub Category Created',
                                    status: "success",
                                    response
                                })
                            })
                            .catch((err) => {
                                res.json({
                                    message: 'Invalid Error',
                                    status: "error",
                                    err
                                })
                            })
                    }
                })
                .catch((err) => {
                    res.json({
                        message: "Internal Server Error",
                        status: "error"
                    })
                })

        } catch (error) {
            return res.json({ message: error.message });

        }




    },

    getAllSubCategory: (req, res) => {
        subCatModel.find({})
            .then((data) => {
                res.json({
                    message: "Fetched Successfully",
                    status: "success",
                    data
                })
            })
            .catch((err) => {
                res.json({
                    message: "internal serber error",
                    status: "error",
                    err
                })
            })

    },

    updateSubCategory: (req, res) => {

        try {
            const { id } = req.params
            const { main_category, sub_category, cat_id } = req.body;

            if (!main_category) {
                res.json({
                    message: "Main Category is Required",
                    status: "error"
                })
                return;
            }

            if (!sub_category) {
                res.json({
                    message: "Sub Category is Required",
                    status: "error"
                })
                return;
            }

            if (!cat_id) {
                res.json({
                    message: "Main Category Id is Required",
                    status: "error"
                })
                return;
            }


            const ObjToSend = {
                main_category,
                sub_category,
                cat_id
            }


            subCatModel.findByIdAndUpdate(id, ObjToSend)
                .exec()
                .then((data) => {
                    subCatModel.findById(id)
                        .then((subCategogy) => {
                            console.log(subCategogy);
                            return res.json({
                                message: "Sub Category Updated ",
                                status: true,
                                data: subCategogy
                            })
                        });
                })
                .catch((err) => {
                    return res.send({
                        message: "internal server error",
                        err
                    })
                })

        } catch (error) {
            console.log(error)

        }
    },

    deleteSubCategory: (req, res) => {
        const { id } = req.params
        // console.log("cat id", id)
        subCatModel.findByIdAndDelete(id)
            .then((data) => {
                res.json({
                    message: 'Deleted Successfully',
                    status: "success",
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
    }
}


module.exports = subCatController;
