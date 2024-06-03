const database = require("../models/database");
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [results] = await database.query(`SELECT * FROM users`);
        if (Array.isArray(results) && results.length < 0) {
            return res.json({
                users: [],
            });
        }
        res.json({
            users: results,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error getting users data",
        });
    }
};

const getUserById = async (req, res) => {
    const { user_id } = req.params;
    if (!user_id) {
        return res.status(400).json({
            error: "Silahkan isi field id user!",
        });
    }
    try {
        const [results] = await database.query(`SELECT * FROM users WHERE user_id = ?`, [
            user_id,
        ]);
        if (Array.isArray(results) && results.length < 0)
            res.json({
                users: [],
            });
        res.json({
            users: results,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Error getting user data by ID",
        });
    }
};

const createNewUser = async (req, res) => {
    const { full_name, email, phone_number, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await database.query(
            `INSERT INTO users (full_name, email, phone_number, password) VALUES (?, ?, ?, ?)`,
            [full_name, email, phone_number, hashedPassword]
        );

        if (result.affectedRows > 0)
            return res.json({ message: "New User Created!" });

        res.status(500).json({ error: "No user created!" });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Error while inserting new user",
        });
    }
};

const updateUserById = async (req, res) => {
    const { user_id } = req.params;
    const { full_name, email, phone_number, password } = req.body;
    if (!user_id) {
        return res.status(400).json({
            error: "Silahkan isi field ID",
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await database.query(
            `UPDATE users SET full_name = ?, email = ?, phone_number = ?, password = ? WHERE user_id = ?`,
            [full_name, email, phone_number, hashedPassword, user_id]
        );
        if (result.affectedRows > 0)
            return res.json({ message: "User data updated!" });

        res.status(500).json({ error: "Update data user failed" });
    } catch (error) {
        console.log("Error while updating user data", error);
        res.status(500).json({ error: "Error while updating user data" });
    }
};

const deleteUserById = async (req, res) => {
    const { user_id } = req.params;
    if (!user_id) {
        return res.status(400).json({
            error: "Silahkan isi field id user!",
        });
    }
    try {
        const [result] = await database.query(`DELETE FROM users WHERE user_id = ?`, [
            user_id,
        ]);

        if (result.affectedRows > 0)
            return res.json({
                message: `User has been DELETED with ID ${user_id}`,
            });

        return res.status(500).json({
            error: `Error deleting data ${user_id}`,
        });
    } catch (error) {
        console.log(`Error while deleting user with ${user_id}`);
        return res.status(500).json({
            error: `Error while deleting user with ${user_id}`,
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    createNewUser
};