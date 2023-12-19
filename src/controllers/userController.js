const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs");
const e = require("express");
const jwt = require('jsonwebtoken');


const crypto = require("crypto")
const sendMail = require("../utils/email")







const userController = {
    createUser: async (req, res) => {

        try {
            const { userName, email, phone, address, password } = req.body

            if (!userName.trim()) {
                return res.status(401).json({ status: 401, message: 'User Name is missing' });
            }
            if (!email.trim()) {
                return res.status(401).json({ status: 401, message: 'Email is missing' });
            }
            if (!phone.trim()) {
                return res.status(401).json({ status: 401, message: 'Phone is missing' });
            }
            if (!address.trim()) {
                return res.status(401).json({ status: 401, message: 'Address is missing' });
            }
            if (!password.trim()) {
                return res.status(401).json({ status: 401, message: 'Password is missing' });
            }


            // if (!userName || !email || !phone || !address || !password) {
            //     res.json({ message: 'required field are missing' })
            //     return;
            // }

            // const hashpassword = bcrypt.hash(password, 10)
            const hashpassword = bcrypt.hashSync(password, 10)

            // console.log(hashpassword)

            const objToSend = {
                userName: userName,
                email: email,
                phone: phone,
                address: address,
                password: hashpassword,
                userType: 'user'
            }
            userModel.findOne({ email: email }).exec()
                .then((userWithEmail) => {
                    userModel.findOne({ userName: userName }).exec()
                        .then((userWithUserName) => {
                            if (userWithEmail) {
                                res.json({
                                    message: "User with this Email already exists",
                                    status: false,
                                    userWithEmail
                                });
                            } else if (userWithUserName) {
                                res.json({
                                    message: "User with this User Name already exists",
                                    status: false,
                                    userWithUserName
                                });
                            } else {
                                userModel.create(objToSend)
                                    .then((data) => {
                                        res.json({
                                            message: "Sign Up successfully",
                                            status: true,
                                            data
                                        });
                                    });
                            }
                        })
                })
                .catch((err) => {
                    res.json({
                        message: "Internal server error",
                        status: false,
                        err
                    });
                });
        } catch (e) {
            return res.json({ message: e.message });
        }



    },

    deleteUser: async (req, res) => {
        const { id } = req.params;

        userModel.findByIdAndDelete(id)
            .then((user) => {
                res.json({
                    message: "User Deleted",
                    status: true,
                    user
                })
            })
            .catch((err) => {
                res.json({
                    message: "Internal Server Error",
                    status: false,
                    err
                })
            })
    },

    login: async (req, res) => {
        const { email, password } = req.body
        console.log('req.body===========', req.body)
        if (!email || !password) {
            return res.json({ message: "Required Field Missing", status: false })
        }

        userModel.findOne({ email: `${email}` })
            .then((user) => {
                if (!user) {
                    res.status(404).json({
                        message: "User does not exist with that email",
                        status: false,
                        // user: user,
                        // email,

                    })
                }
                else {
                    const comparepass = bcrypt.compareSync(password, user.password)

                    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET)

                    if (comparepass) {
                        res.status(200).json({
                            message: "login Successfull",
                            status: true,
                            user: {
                                userID: user._id,
                                user_name: user.userName,
                                user_type: user.userType,
                                user_email: user.email,
                                user_address: user.address,
                            },
                            token

                        })
                    } else {
                        res.status(422).json({
                            message: "Email or Password does not match",
                            status: false,
                        })
                    }

                }
            })
            .catch((err) => {
                res.status(422).json({
                    message: "Invalid Error",
                    err
                })
            })
    },
    testing: async (req, res) => {
        res.json({
            message: req.user,
            status: true
        })
    },

    // forgetPassword: async (req, res) => {


    //     // 1- Get the user on the basis of given email,
    //     // 2- Generate a rando Reset Token
    //     // 3- Send the token back to the user Email

    //     userModel.findOne({ email: req.body.email })
    //         .then((data) => {
    //             if (data) {
    //                 res.status(200).json({
    //                     status: true,
    //                     message: "User Exist",
    //                     data
    //                 })
    //             }
    //             else {
    //                 res.status(404).json({
    //                     status: false,
    //                     message: "User does not  Exist",
    //                     data
    //                 })
    //             }

    //         })
    //         .catch((err) => {
    //             res.status(500).json({
    //                 status: false,
    //                 message: "Invalid Error",
    //                 err
    //             })
    //         })

    //     const resetToken = crypto.randomBytes(23).toString("hex")

    //     passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    //     passwordResetTokenExpire = Date.now() + 10 * 60 * 1000

    //     console.log("resetToken", resetToken)
    //     console.log("passwordResetToken", passwordResetToken)


    //     return resetToken;
    //     const resetToken2 = createResetPasswordToken();

    //     await userModel.save()



    // },

    // forgetPassword: async (req, res) => {
    //     try {
    //         // 1- Get the user on the basis of given email
    //         const user = await userModel.findOne({ email: req.body.email });

    //         if (!user) {
    //             return res.status(404).json({
    //                 status: false,
    //                 message: "User does not exist",
    //             });
    //         }

    //         // 2- Generate a random Reset Token
    //         const resetToken = crypto.randomBytes(23).toString('hex');
    //         const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    //         const passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

    //         console.log("resetToken", resetToken);
    //         console.log("passwordResetToken", passwordResetToken);

    //         // 3- Save the token and expiration in the user document
    //         user.resetPasswordToken = passwordResetToken;
    //         user.resetPasswordExpires = passwordResetTokenExpire;
    //         await user.save();

    //         // You can send the resetToken to the user's email here or use it in your reset password mechanism

    //         const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${passwordResetToken}`;
    //         const message = `We have received pasword reset request, Please use the below link to reset your password
    //     \n\n ${resetUrl} \n\n This reset password link will be valid only for 10 mins `

    //         try {

    //             await sendMail({
    //                 email: user.email,
    //                 subect: 'password reset request received',
    //                 message: message
    //             })

    //             res.status(200).json({
    //                 status: "success",
    //                 message: "Password Reset token send to user"
    //             })
    //         } catch (error) {
    //             user.passwordResetToken = undefined,
    //                 user.passwordResetTokenExpire = undefined,
    //                 user.save()
    //         }

    //         return res.status(200).json({
    //             status: true,
    //             message: "Reset token generated and saved successfully",
    //             resetToken: resetToken,
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         return res.status(500).json({
    //             status: false,
    //             message: "Internal server error",
    //         });
    //     }
    // },

    forgetPassword: async (req, res) => {
        try {
            // 1- Get the user on the basis of given email
            const user = await userModel.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User does not exist",
                });
            }

            // 2- Generate a random Reset Token
            const resetToken = crypto.randomBytes(23).toString('hex');
            const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest('hex');
            const passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

            // 3- Save the token and expiration in the user document
            user.resetPasswordToken = passwordResetToken;
            user.resetPasswordExpires = passwordResetTokenExpire;
            await user.save();

            // You can send the resetToken to the user's email here or use it in your reset password mechanism

            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${passwordResetToken}`;
            const message = `We have received password reset request. Please use the below link to reset your password:\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

            try {
                await sendMail({
                    email: user.email,
                    subject: 'Password reset request received',
                    message: message
                });

                res.status(200).json({
                    status: "success",
                    message: "Password Reset token sent to user"
                });
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();

                console.log("error", error)
                res.status(500).json({
                    status: false,
                    message: "Failed to send reset token email"

                });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: false,
                message: "Internal server error",
            });
        }
    },

    resetPassword: async (req, res, next) => {
        console.log("first")
    }


}


module.exports = { userController }