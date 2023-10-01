const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const cors = require('cors');
const router = require("./src/routes/routes");

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


// DB Connections 

const DBURI = "mongodb+srv://syedsameerali26:petacare123@cluster0.nj1cvom.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURI)
    .then((res) => { console.log("Connected to database") })
    .catch((err) => { console.log(err) })


app.get("/", (req, res) => {
    res.send(`App is running in Port ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`App is Running On ${PORT}`)
})