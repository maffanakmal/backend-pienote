const database = require("../models/database");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const getUserById = async (req, res) => {
    const userId = req.user.user_id; // Extract user ID from authenticated user
    console.log("Fetching user ID:", userId);

    if (!userId) {
        return res.status(400).json({
            error: "User ID not found!",
        });
    }

    try {
        const [results] = await database.query(`SELECT * FROM users WHERE user_id = ?`, [userId]);
        console.log("Query results:", results);

        if (results.length === 0) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        res.json({
            user: results[0],
        });
    } catch (error) {
        console.error("Error getting user data by ID:", error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    if (!id) {
        return res.status(400).json({
            error: "Silahkan isi field ID",
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const [result] = await database.query(
            `UPDATE users SET name = ?, email = ?${password ? ", password = ?" : ""} WHERE id = ?`,
            password ? [name, email, hashedPassword, id] : [name, email, id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "User data updated!" });
        }

        return res.status(500).json({ error: "Update data user failed" });
    } catch (error) {
        console.log("Error while updating user data", error);
        return res.status(500).json({ error: "Error while updating user data" });
    }
};

module.exports = {
    getUserById,
    updateUserById,
};
