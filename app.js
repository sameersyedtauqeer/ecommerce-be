const express = require("express");
const app = express();
require('dotenv').config()
const mongoose = require("mongoose");
// const PORT = 5000;
const cors = require('cors');
const router = require("./src/routes/routes");
const PORT = process.env.PORT;

// middleware

// app.options('*', cors()) // include before other routes
app.use(cors({
    origin: '*',
    methods: 'GET, PUT , DELETE , POST',
}));
app.use(express.json());
app.use(router);
// app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));


// error handling middle error

app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message

    })
})


// DB Connections 



mongoose.connect(process.env.DBURI)
    .then((res) => { console.log("Connected to database") })
    .catch((err) => { console.log(err) })


app.get("/", (req, res) => {
    res.send(`App is running in Port ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`App is Running On ${PORT}`)
})