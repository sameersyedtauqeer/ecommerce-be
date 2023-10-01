const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "qwertyuiopasdfghjkl"







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

                    const token = jwt.sign({ userID: user._id }, JWT_SECRET)

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
    }


}


module.exports = { userController }