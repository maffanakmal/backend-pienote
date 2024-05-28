const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

const database = require('./models/database') 
const router = require('./routes/userRoutes');

// Middleware
// Ambil data dari client yang dikirim dalam bentuk json
app.use(express.json());
// Menangani data dari client atau browser
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.use(cookieParser());

app.use(router)

app.listen(8000, () => {
    console.log(`Server has been running on http://localhost:8000`);
});
