const database = require("../models/database");
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

const registerNewUser = async (req, res) => {
    const {fullName, email, phoneNumber, password} = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password.toString(), salt);
        const [result] = await database.query(
            `INSERT INTO users ('full_name', 'email', 'phone_number', 'password') VALUES (?, ?, ?, ?)`,
            [fullName, email, phoneNumber, hashedPassword]
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

module.exports = {
    registerNewUser,
};