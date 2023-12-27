const productModel = require("../models/productModel");
const multer = require('multer');
const path = require("path");


const express = require("express");
const newProductModel = require("../models/newProductModel");
const app = express();


app.use('../../uploads', express.static(path.join(__dirname, 'uploads')));




const storage = multer.diskStorage({
    // destination: function (req, res, cb) {
    //     cb(null, './uploads/');
    // },
    // destination: function (req, res, cb) {
    //     cb(null, path.join(__dirname, 'uploads'));
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
        return cb(null, "success");
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


const newProductController = {

    createNewProduct: async (req, res) => {


        try {
            const { title, description, price, category, category_id, sub_category, sub_categoryId, brand, brand_id } = req.body;

            const image = req.files.image[0].filename;

            const slug = req.body.title.toLowerCase().replace(/ /g, "-")



            // console.log('images', req.files)
            // const sampleImages = req.files['sampleImages[]'].map((file) => file.filename);
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
            if (!category_id) {
                return res.json({ message: 'Category Id is missing' });
            }
            if (!sub_category) {
                return res.json({ message: 'Sub Category is missing' });
            }
            if (!sub_categoryId) {
                return res.json({ message: 'Sub Category Id is missing' });
            }
            if (!brand) {
                return res.json({ message: 'Brand is missing' });
            }
            if (!brand_id) {
                return res.json({ message: 'Brand Id is missing' });
            }

            // let request = req.body;
            // request.coverImage = coverImage
            // request.sampleImages = sampleImages
            const request = {
                title,
                description,
                price,
                category,
                category_id,
                sub_category,
                sub_categoryId,
                brand,
                brand_id,
                image,
                slug
                // sampleImages,
            };

            newProductModel.findOne({ title }).exec()
                .then((data) => {
                    if (data) {

                        res.json({
                            message: "Product with this Name already exist",
                            status: "error",
                        })
                    }
                    else {
                        newProductModel.create(request)
                            .then((data) => {
                                return res.json({
                                    message: "Products Created Successfully",
                                    status: "success",
                                    data
                                });
                            })
                            .catch((error) => {
                                return res.json({
                                    message: 'Internal server error',
                                    error,
                                    status: "error"
                                });
                            });
                    }
                })
                .catch((err) => {
                    res.status(400).json({
                        message: "Internal Server Error",
                        status: "error",
                        err
                    })
                })


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

    updateNewProducts: async (req, res) => {

        try {
            const { id } = req.params

            const { title, description, price, category, category_id, sub_category, sub_categoryId, brand, brand_id } = req.body;

            const image = req.files.image[0].filename;

            const slug = req.body.title.toLowerCase().replace(/ /g, "-")
            // console.log(req.files['sampleImages[]']);
            // console.log('images', req.files)
            // const sampleImages = req.files['sampleImages[]'].map((file) => file.filename);
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
            if (!category_id) {
                return res.json({ message: 'Category Id is missing' });
            }
            if (!sub_category) {
                return res.json({ message: 'Sub Category is missing' });
            }
            if (!sub_categoryId) {
                return res.json({ message: 'Sub Category Id is missing' });
            }
            if (!brand) {
                return res.json({ message: 'Brand is missing' });
            }
            if (!brand_id) {
                return res.json({ message: 'Brand Id is missing' });
            }

            // let request = req.body;
            // request.coverImage = coverImage
            // request.sampleImages = sampleImages
            const request = {
                title,
                description,
                price,
                category,
                category_id,
                sub_category,
                sub_categoryId,
                brand,
                brand_id,
                image,
                slug
                // sampleImages,
            };
            console.log("first ============ ", request)


            newProductModel.findByIdAndUpdate(id, request)
                .exec()
                .then((data) => {
                    newProductModel.findById(id).then((brand) => {
                        console.log(brand);
                        return res.json({
                            message: "Product Updated ",
                            status: "success",
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
        } catch (error) {
            res.json({
                message: "internal server error",
                error
            })
        }



    },

    getSingleNewProducts: async (req, res) => {
        const { slug } = req.params;
        console.log("first ===== ", slug)

        newProductModel.find().or([{ slug }])
            .then((data) => {
                res.json({
                    message: "Single Products Fetched Successfully",
                    status: "success",
                    data: data[0]
                })
            })
            .catch((error) => {
                res.json({
                    message: "ineternal server error",
                    status: "error",
                    error
                })
            })
    },

    getAllNewProducts: async (req, res) => {
        newProductModel.find({})
            .then((data) => {
                res.json({
                    message: "Products Fetched Successfully",
                    status: "success",
                    data
                })
            })
            .catch((error) => {
                res.json({
                    message: "ineternal server error",
                    status: "error",
                    error
                })
            })
    },

    deleteNewProduct: async (req, res) => {
        const { id } = req.params
        return console.log("Deleting product with ID:", id);

        newProductModel.findByIdAndDelete(id)
            .then((data) => {
                res.json({
                    message: 'Deleted successfully ',
                    statsu: "success",
                    data
                })
            })
            .catch((error) => {
                res.json({
                    message: 'internal server error',
                    status: "error",
                    error
                })
            })
    },


}

module.exports = { newProductController, uploads }