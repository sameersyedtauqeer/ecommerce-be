const notificationModel = require("../models/notificationModel")

const notificationController = {

    getAllNotification: async (req, res) => {
        notificationModel.find({}).sort({ _id: -1 }).exec()
            .then((data) => {
                res.json({
                    message: "All Notification Fetched",
                    status: true,
                    data
                })
            })
            .catch((error) => {
                res.json({
                    message: "Invalid Error",
                    status: false,
                    error
                })
            })
    }
}

module.exports = { notificationController }