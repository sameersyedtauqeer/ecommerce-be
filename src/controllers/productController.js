const productModel = require("../models/productModel");
const multer = require('multer');
const path = require("path");


const express = require("express");
const app = express();


// app.use('../uploads', express.static(path.join(__dirname, 'uploads')));




const storage = multer.diskStorage({
    // destination: function (req, res, cb) {
    //     cb(null, './uploads/');
    // },

    destination: function (req, res, cb) {
        const destinationPath = path.join(__dirname, '../../uploads');
        console.log('Destination Path:', destinationPath);
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + "-" + file.originalname);
    }
});

const checkFileType = function (file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};

const uploads = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});


const productController = {

    createProduct: async (req, res) => {


        try {
            const { title, description, price, category, color, size, brand } = req.body;
            const coverImage = req.files.coverImage[0].filename;
            // console.log(req.files['sampleImages[]']);
            // console.log('images', req.files)
            const sampleImages = req.files['sampleImages[]'].map((file) => file.filename);
            // if (!title || !description || !price || !category || !color || !size || brand) {
            //     res.json({
            //         message: 'Required Fields are missing'
            //     })
            //     return;
            // }
            if (!title) {
                return res.json({ message: 'Title is missing' });
            }
            if (!description) {
                return res.json({ message: 'Description is missing' });
            }
            if (!price) {
                return res.json({ message: 'Price is missing' });
            }
            if (!category) {
                return res.json({ message: 'Category is missing' });
            }
            if (!color) {
                return res.json({ message: 'Color is missing' });
            }
            if (!size) {
                return res.json({ message: 'Size is missing' });
            }
            if (!brand) {
                return res.json({ message: 'Brand is missing' });
            }

            // let request = req.body;
            // request.coverImage = coverImage
            // request.sampleImages = sampleImages
            const request = {
                title,
                description,
                price,
                category,
                color,
                size,
                brand,
                coverImage,
                sampleImages,
            };

            productModel.create(request)
                .then((data) => {
                    return res.json({
                        message: "Products Created Successfully",
                        status: true,
                        data
                    });
                })
                .catch((error) => {
                    return res.json({
                        message: 'Internal server error',
                        error,
                        status: false
                    });
                });
        }
        catch (e) {
            return res.json({ message: e.message });
        }
    },
    // get createProduct() {
    //     return this._createProduct;
    // },
    // set createProduct(value) {
    //     this._createProduct = value;
    // },

    getSingleProducts: async (req, res) => {
        const { id } = req.params;
        // console.log("first ===== ", id)

        productModel.findById(id)
            .then((data) => {
                res.json({
                    message: "Single Products Fetched Successfully",
                    status: true,
                    data
                })
            })
            .catch((error) => {
                res.json({
                    message: "ineternal server error",
                    status: false,
                    error
                })
            })
    },

    getAllProducts: async (req, res) => {
        productModel.find({})
            .then((data) => {
                res.json({
                    message: "Products Fetched Successfully",
                    status: true,
                    data
                })
            })
            .catch((error) => {
                res.json({
                    message: "ineternal server error",
                    status: false,
                    error
                })
            })
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params

        productModel.findByIdAndDelete(id)
            .then((data) => {
                res.json({
                    message: 'deleted successfully ',
                    statsu: true,
                    data
                })
            })
            .catch((error) => {
                res.json({
                    message: 'internal server error',
                    status: false,
                    error
                })
            })
    },

    updateProducts: async (req, res) => {
        const { id } = req.params

        const { title, description, price, category, color, size, brand } = req.body;
        const coverImage = req.files.coverImage[0].filename;
        // console.log(req.files['sampleImages[]']);
        // console.log('images', req.files)
        const sampleImages = req.files['sampleImages[]'].map((file) => file.filename);
        // if (!title || !description || !price || !category || !color || !size || brand) {
        //     res.json({
        //         message: 'Required Fields are missing'
        //     })
        //     return;
        // }
        if (!title) {
            return res.json({ message: 'Title is missing' });
        }
        if (!description) {
            return res.json({ message: 'Description is missing' });
        }
        if (!price) {
            return res.json({ message: 'Price is missing' });
        }
        if (!category) {
            return res.json({ message: 'Category is missing' });
        }
        if (!color) {
            return res.json({ message: 'Color is missing' });
        }
        if (!size) {
            return res.json({ message: 'Size is missing' });
        }
        if (!brand) {
            return res.json({ message: 'Brand is missing' });
        }

        // let request = req.body;
        // request.coverImage = coverImage
        // request.sampleImages = sampleImages
        const request = {
            title,
            description,
            price,
            category,
            color,
            size,
            brand,
            coverImage,
            sampleImages,
        };
        console.log("first ============ ", request)


        productModel.findByIdAndUpdate(id, request)
            .exec()
            .then((data) => {
                productModel.findById(id).then((brand) => {
                    console.log(brand);
                    return res.json({
                        message: "Product Updated ",
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

        // productModel.findByIdAndUpdate(id, { request }).exec()
        //     .then((data) => {
        //         res.json({
        //             message: "Product Updated ",
        //             status: true,
        //             data
        //         })
        //     })
        //     .catch((err) => {
        //         res.json({
        //             message: "internal server error",
        //             status: false,
        //             err

        //         })
        //     })
    }
}

module.exports = { productController, uploads }