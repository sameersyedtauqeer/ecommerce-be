const mongoose = require("mongoose");
const crypto = require("crypto")

const userShcema = new mongoose.Schema({
    userName: String,
    email: String,
    phone: String,
    address: String,
    password: String,
    userType: String,
    passwordResetToken: String,
    passwordResetTokenExpire: Date,

})


// export const createResetPasswordToken = userShcema.methods.createResetPasswordToken = function () {
//     const resetToken = crypto.randomBytes(23).toString("hex")

//     passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
//     passwordResetTokenExpire = Date.now() + 10 * 60 * 1000

//     console.log("resetToken", resetToken)
//     console.log("passwordResetToken", passwordResetToken)

//     return resetToken;
// }

const userModel = mongoose.model('user', userShcema)
module.exports = userModel