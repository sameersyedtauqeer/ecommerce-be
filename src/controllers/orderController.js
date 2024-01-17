const notifiModel = require("../models/notificationModel")
const ordersModel = require("../models/ordersModel")
const productModel = require("../models/productModel")
const Pusher = require("pusher");


const pusher = new Pusher({
    appId: "1682952",
    key: "5f55ea6a3a8ec02183d2",
    secret: "db2a087cbe35009bb097",
    cluster: "ap2",
    useTLS: true
});



const orderController = {
    createOrder: (req, res) => {

        const body = req.body
        const { name, email, address, method } = req.body

        function generateOrderNumber() {
            const time = new Date().getTime();
            const randomDigits = 'PC-' + time; // Generate a 4-digit random number
            const orderNumber = `${randomDigits}`;
            return orderNumber;
        }

        const orderNumber = generateOrderNumber();

        // console.log("order number ======== ", orderNumber)
        // console.log("body.name =========== ", body)

        let dataID = body.products.map((val) => val.id)

        productModel.find({ _id: { $in: dataID } })
            .then((response) => {
                let product = response.reverse().map((vals, i) => {
                    // console.log(vals._id, '==', body.products[i].id)
                    // console.log('q', body.products[i].quantity)
                    return {
                        // ...vals,
                        // vals.quantity,
                        title: vals.title,
                        price: vals.price,
                        totalPrice: parseInt(vals.price) * parseInt(body.products[i].quantity),
                        quantity: body.products[i].quantity,
                    }
                })
                let sum = product.reduce(function (accumulator, curValue) {
                    return accumulator + curValue.totalPrice
                }, 0)
                //   console.log('sum', sum)

                const dtObj = {
                    product: product,
                    subTotal: sum,
                    name,
                    email,
                    address,
                    paymentMethod: method,
                    subTotal: sum,
                    orderNo: orderNumber,
                    user_id: req.user?.userID
                }


                // return console.log("orderBy", req.user?.userID)

                ordersModel.create(dtObj)
                    .then((result) => {
                        notifiModel.create({
                            title: name,
                            address: address,
                            order_no: orderNumber,
                            order_id: result?._id
                        })
                        pusher.trigger("my-channel", "my-event", {
                            message: "new notification",
                            title: name,
                            address: address,
                            order_no: orderNumber,
                            order_id: result?._id
                        });
                        return res.status(200).json({ message: "Thanks for your purchase", result, status: true })
                    })
                    .catch((err) => {
                        res.json({
                            message: "error",
                            status: false,
                            err
                        })
                    })

                // res.json({
                //     message: "Single Products Fetched Successfully",
                //     status: true,
                //     // response: {
                //     //     products: product,
                //     //     subTotal: sum,
                //     //     charges: 12,
                //     //     totalAmount: sum + 12
                //     // }
                //     dtObj
                // })
            })
            .catch((error) => {
                res.json({
                    message: "ineternal server error",
                    status: false,
                    error
                })
            })


    },

    updateOrder: (req, res) => {
        const { id } = req.params
        const body = req.body
        // console.log("order id ====== ", id)
        console.log("order body ====== ", body)

        ordersModel.findByIdAndUpdate(id, body).exec()
            .then((result) => {
                ordersModel.findById(id)
                    .then((data) => {
                        return res.json({
                            message: "Order Updated Successfully",
                            status: true,
                            data
                        })
                    })
            })
            .catch((error) => {
                return res.json({
                    message: "Invalid error",
                    status: false,
                    error
                })
            })
    },

    getAllOrders: async (req, res) => {

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const startPage = (page - 1) * limit
        const endPage = (page) * limit

        const totalOrders = await ordersModel.countDocuments()

        // const totalPages = Math.ceil(ordersModel.length)
        const totalPages = Math.ceil(totalOrders / limit)

        // return ("rotal pages" , totalPages)

        const pagination = {}

        if (endPage < totalOrders) {
            pagination.next = {
                next: page + 1,
                limit: limit
            }
        }

        if (startPage > 0) {
            pagination.previous = {
                previous: page - 1,
                limit: limit
            }
        }

        ordersModel.find({})
            .sort({ _id: -1 })
            .skip(startPage)
            .limit(limit)
            .then((data) => {
                res.json({
                    message: "All Orders Fetched",
                    status: true,
                    data,
                    pagination,
                    totalPages
                })
            })
            .catch((error) => {
                res.json({
                    message: "Invalid Error",
                    status: false,
                    error
                })
            })
    },

    getSingleOrders: async (req, res) => {
        const { id, notificationId } = req.params;

        notifiModel.findByIdAndUpdate(notificationId, { is_read: true }).exec()
        ordersModel.findById(id)
            .then((data) => {
                res.json({
                    message: "Single Order Fetched ",
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

    getKanban: async (req, res) => {
        ordersModel.find({})
            .then((data) => {
                let allOrders = {
                    Pending: {
                        name: "Pending",
                        items: [],
                    },
                    Confirmed: {
                        name: "Confirmed",
                        items: []
                    },
                    Processing: {
                        name: "Processing",
                        items: []
                    },
                    outForDelivery: {
                        name: "Out For Delivery",
                        items: []
                    },
                    delivered: {
                        name: "Delivered",
                        items: []
                    }
                };
                data.map((val, i) => {
                    if (val?.orderStatus != "Out For Delivery") {
                        allOrders[val?.orderStatus].items.push({ id: val?._id, content: val?.orderNo })
                    } else {
                        allOrders['outForDelivery'].items.push({ id: val?._id, content: val?.orderNo })
                    }
                })
                res.json({
                    message: "All Orders Fetched",
                    status: true,
                    allOrders
                })
            })
            .catch((error) => {
                res.json({
                    message: "Invalid Error",
                    status: false,
                    error
                })
            })
    },


    getMyOrders: async (req, res) => {


        ordersModel.find({ user_id: req.user.userID })
            .sort({ _id: -1 })
            .then((data) => {
                res.json({
                    message: "Single Order Fetched ",
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


}

module.exports = { orderController }
