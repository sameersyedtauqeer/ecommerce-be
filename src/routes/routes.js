const express = require("express");
const BrandController = require("../controllers/brandController");
const CategoryController = require("../controllers/categoryController");
const { productController, uploads } = require("../controllers/productController");
const { newProductController } = require("../controllers/newProductController");
const { userController } = require("../controllers/userController");
const { checkLogin } = require("../middleware/middleware");
const { orderController } = require("../controllers/orderController");
const { notificationController } = require("../controllers/notificationController");
const subCatController = require("../controllers/subCatController");
const router = express.Router();

// Auth APi

router.post("/api/signup", userController.createUser)
router.delete("/api/signup/:id", userController.deleteUser)
router.post("/api/login", userController.login)
router.post("/api/forgotPassword", userController.forgetPassword)
router.put("/api/resetPassword/:token", userController.resetPassword)


router.get("/api/test", checkLogin, userController.testing)


// Brand API

router.post("/api/brands", checkLogin, BrandController.createBrand);
router.get("/api/brands", BrandController.getAllBrands);
router.delete("/api/brands/:id", BrandController.deleteBrand);
router.put("/api/brands", BrandController.updateBrand);

//  X-----------X-----------X

// Category API

router.post("/api/category", CategoryController.createCategory);
router.get("/api/category", CategoryController.getAllCategory);
router.delete("/api/category/:id", CategoryController.deleteCategory);
router.put("/api/category", CategoryController.updateCategory);

// Sub Category API
router.get("/api/sub-category", subCatController.getAllSubCategory);
router.post("/api/sub-category", subCatController.createSubCategory);
router.put("/api/sub-category/:id", subCatController.updateSubCategory)
router.delete("/api/sub-category/:id", subCatController.deleteSubCategory);


//  Products API

router.post("/api/products", uploads.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'sampleImages[]', maxCount: 5 }]), productController.createProduct)
router.get("/api/products", productController.getAllProducts)
router.delete("/api/products/:id", productController.deleteProduct)
router.get("/api/products/:id", productController.getSingleProducts)
router.put("/api/products/:id", uploads.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'sampleImages[]', maxCount: 5 }]), productController.updateProducts)

// new products Api 

router.get("/api/new-products", newProductController.getAllNewProducts)
router.get("/api/new-products/:slug", newProductController.getSingleNewProducts)
router.post("/api/new-products", uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'sampleImages[]', maxCount: 5 }]), newProductController.createNewProduct)
router.put("/api/new-products/:id", uploads.fields([{ name: 'image', maxCount: 1 }, { name: 'sampleImages[]', maxCount: 5 }]), newProductController.updateNewProducts)
router.delete("/api/new-products/:id", newProductController.deleteNewProduct)

//  Order API

router.post("/api/order", checkLogin, orderController.createOrder)
router.get("/api/order", orderController.getAllOrders)
router.get("/api/my-order", checkLogin, orderController.getMyOrders)
router.get("/api/order/:id?/:notificationId?", orderController.getSingleOrders)
router.put("/api/order/:id", orderController.updateOrder)
router.get("/api/kanban", orderController.getKanban)

// Notification API

router.get("/api/notification", notificationController.getAllNotification)

module.exports = router