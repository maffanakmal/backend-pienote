const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const database = require('../models/database')
const { SECRET } = require('../config/appConfig')

async function register (req, res) {
    const {name, email, password} = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ 
            message: "Bad request",
            errors: errors.Array(),
        })
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Check if user already in database
        const [user] = await database.query("SELECT email FROM users WHERE email = ?", [email])
        if (user.length > 0) {
            return res.json({
                error: "Use another email",
            })
        }

        // Save new user
        const [newUser] = await database.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])
        if (newUser.affectedRows > 0) {
            return res.json({
                message: "New user has been created",
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error: "Failed to register",
        })
    }
}


async function login (req, res) {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ 
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        // Check if user already in database
        const [users] = await database.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(403).json({
                message: "Invalid email or password",
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Create JWT token
        const token = jwt.sign({
            userId: user.id,
        }, SECRET, { expiresIn: '1h', algorithm: 'HS256' }); // Corrected algorithm

        res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 }); // ms
        res.json({
            token,
        });
    } catch (error) {
        console.error("Login Error", error.message, error.stack); // Improved logging
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    register,
    login,
}