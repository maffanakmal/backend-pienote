const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const loginRoute = require('./routes/loginRoute')


const app = express();

// Middleware
// Ambil data dari client yang dikirim dalam bentuk json
app.use(express.json());
// Menangani data dari client atau browser
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

app.use("/", loginRoute)

app.listen(8000, () => {
    console.log(`Server has been running on http://localhost:8000`);
});
