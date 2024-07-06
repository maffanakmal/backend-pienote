require("dotenv").config();

// APP
const BASE_URL = process.env.BASE_URL ?? "localhost";
const PORT = process.env.PORT ?? 8001;

// DATABASE
const DB_HOST = process.env.DATABASE_HOST ?? "localhost";
const DB_PORT = process.env.DATABASE_PORT ?? 3306;
const DB_USER = process.env.DATABASE_USER ?? "root";
const DB_PASSWORD = process.env.DATABASE_PASSWORD ?? "";
const DB_NAME = process.env.DATABASE_NAME ?? "pienote";

// AUTHENTICATION
const SECRET =
    process.env.JWT_SECRET ??
    "4f3c9d2b33e4a8f67628d1a4c0e4e4ef3425a8d1e8d1c4e3e4a8f6762b9d3e3c";

module.exports = {
    BASE_URL,
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    SECRET,
};