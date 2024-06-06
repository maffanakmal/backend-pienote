const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const database = require("../models/database");
const { SECRET } = require("../config/appConfig");


async function register(req, res) {
    const { full_name, username, email, phone_number, password, confirm_pass } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    if (password !== confirm_pass) {
        return res.status(400).json({ error: "Password and Confirm Password do not match!" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if the email is already in the database
        const [existingUser] = await database.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Use another email!" });
        }

        // Save new user
        const [newUser] = await database.query(
            `INSERT INTO users (full_name, username, email, phone_number, password) VALUES (?, ?, ?, ?, ?)`,
            [full_name, username, email, phone_number, hashedPassword]
        );

        if (newUser.affectedRows > 0) {
            return res.json({ message: "User created!" });
        } else {
            return res.status(400).json({ error: "Failed to register!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
}

async function login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    const { authIdentifier, password } = req.body;

    try {
        // Query to find user by either email or username
        const [users] = await database.query(
            `SELECT * FROM users WHERE email = ? OR username = ?`,
            [authIdentifier, authIdentifier]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: "Email or Username Incorrect!" });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ error: "Password Incorrect!" });
        }

        // Get user data
        const userId = user.user_id;
        const userName = user.full_name;
        const userEmail = user.email;

        // Create JWT tokens
        const accessToken = jwt.sign({ userId, userName, userEmail }, SECRET, {
            expiresIn: "1d",
            algorithm: "HS256",
        });

        // Set access token in cookie
        res.cookie("accessToken", accessToken, { 
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            secure: process.env.NODE_ENV === "production", // Set to true in production
        });

        // Send response with access token
        res.json({
            accessToken,
        });
    } catch (error) {
        console.error("Login error:", error); // Log the error
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

async function logout(req, res) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({
                error: "No refresh token provided"
            });
        }
        // Clear the refresh token cookie
        res.clearCookie("accessToken");

        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error); // Log the error
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


module.exports = {
    register,
    login,
    logout
};