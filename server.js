const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const catatanKeuanganRoutes = require("./routes/catatanKeuanganRoutes");
const splitBillsRoutes = require("./routes/splitBillsRoutes");
const { BASE_URL, PORT } = require("./config/appConfig");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());

// Ambil data dari client yang dikirim dalam bentuk json
app.use(express.json());
// Menangani data dari client atau browser
app.use(express.urlencoded({ extended: true }));

// Menangani log
app.use(logger);

// Controller untuk validasi user
app.use(authRoutes);

// HANYA USER YANG LOGIN BISA CRUD data users
app.use(catatanKeuanganRoutes);

app.use(splitBillsRoutes);

// Menangani error
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on ${BASE_URL}:${PORT}`));