const brandModel = require("../models/brandModel");


const BrandController = {
    createBrand: (req, res) => {
        const { name } = req.body

        console.log("req.body ====", req.body)

        if (!name) {
            res.json({
                message: "Brand name is required"
            })
            return
        }

        brandModel.findOne({ name })
            .exec()
            .then((data) => {
                if (data) {
                    res.json({
                        message: "Brand already exist",
                        status: false
                    })
                } else {
                    brandModel.create({ brandName: name })
                        .then((data) => {
                            res.send({
                                message: "Brand successfully added",
                                status: true,
                                data
                            })
                        })
                        .catch((err) => {
                            res.send({
                                message: "Operation Failed",
                            })
                        })
                }
            })
            .catch((err) => {
                res.send({
                    message: "internal server error",
                    err
                })
            })
    },

    getAllBrands: (req, res) => {
        brandModel.find()
            .then((data) => {
                res.json({
                    message: "All Brands Fetched",
                    status: true,
                    data
                })
            })
            .catch((err) => {
                res.json({
                    message: "Fetching failed",
                    status: false,
                })
            })
    },

    deleteBrand: (req, res) => {
        const { id } = req.params;
        console.log("id ==== ", id)

        brandModel.findByIdAndDelete(id)
            .then((data) => {
                res.send({
                    message: "deleted Successfully",
                    status: true,
                    data
                })
            })
            .catch((err) => {
                res.send({
                    message: "Failed to delete",
                    status: false
                })
            })
    },

    updateBrand: (req, res) => {
        const { name, id } = req.body
        console.log("req.body ====", req.body)

        if (!name) {
            return res.json({
                message: "Brand name is required"
            })
        }
        brandModel.findByIdAndUpdate(id, { brandName: name })
            .exec()
            .then((data) => {
                brandModel.findById(id).then((brand) => {
                    console.log(brand);
                    return res.json({
                        message: "Brand Updated ",
                        status: true,
                        data: brand
                    })
                });
            })
            .catch((err) => {
                return res.send({
                    message: "internal server error",
                    err
                })
            })
    },
}

module.exports = BrandController;