const database = require("../models/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const getPemasukanById = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const [results] = await database.query(`SELECT * FROM income_notes WHERE user_id = ?`, [user_id]);

        res.json({
            pemasukan: results.length > 0 ? results : [],
        });
    } catch (error) {
        console.error("Error getting pemasukan data by user ID:", error);
        res.status(500).json({
            error: "Internal Server Error while getting pemasukan data",
        });
    }
};

const createNewPemasukan = async (req, res) => {
    const { amount, income_category, description, date } = req.body;

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    const user_id = req.user.user_id;

    try {
        // Parse the date and format it to YYYY-MM-DD
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const [result] = await database.query(
            `INSERT INTO income_notes (user_id, amount, income_category, description, date) VALUES (?, ?, ?, ?, ?)`,
            [user_id, amount, income_category, description, formattedDate]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "New income created!" });
        }

        res.status(500).json({ error: "Failed to create new income" });
    } catch (error) {
        console.error("Error while inserting new income:", error);
        res.status(500).json({
            error: "Internal Server Error while inserting new income",
        });
    }
};

const getPengeluaranById = async (req, res) => {
    const user_id = req.user.user_id; // Assuming req.user is set by the auth middleware

    try {
        const [results] = await database.query(`SELECT * FROM expense_notes WHERE user_id = ?`, [user_id]);

        res.json({
            pengeluaran: results.length > 0 ? results : [],
        });
    } catch (error) {
        console.error("Error getting pengeluaran data by user ID:", error);
        res.status(500).json({
            error: "Internal Server Error while getting pengeluaran data",
        });
    }
};

const createNewPengeluaran = async (req, res) => {
    const { amount, expense_category, description, date } = req.body;

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    const user_id = req.user.user_id;

    try {
        // Parse the date and format it to YYYY-MM-DD
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const [result] = await database.query(
            `INSERT INTO expense_notes (user_id, amount, expense_category, description, date) VALUES (?, ?, ?, ?, ?)`,
            [user_id, amount, expense_category, description, formattedDate]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "New expense created!" });
        }

        res.status(500).json({ error: "Failed to create new expense" });
    } catch (error) {
        console.error("Error while inserting new expense:", error);
        res.status(500).json({
            error: "Internal Server Error while inserting new expense",
        });
    }
};

const getLaporanKeuangan = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const [pemasukanResults] = await database.query(`SELECT * FROM income_notes WHERE user_id = ?`, [user_id]);
        const [pengeluaranResults] = await database.query(`SELECT * FROM expense_notes WHERE user_id = ?`, [user_id]);

        res.json({
            pemasukan: pemasukanResults.length > 0 ? pemasukanResults : [],
            pengeluaran: pengeluaranResults.length > 0 ? pengeluaranResults : [],
        });
    } catch (error) {
        console.error("Error getting laporan keuangan data by user ID:", error);
        res.status(500).json({
            error: "Internal Server Error while getting laporan keuangan data",
        });
    }
};

module.exports = {
    getPemasukanById,
    createNewPemasukan,
    getPengeluaranById,
    createNewPengeluaran,
    getLaporanKeuangan,
};
