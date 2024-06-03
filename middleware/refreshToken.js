const database = require('../models/database');
const jwt = require("jsonwebtoken");
const { SECRET, REFRESH } = require("../config/appConfig");

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                error: "No refresh token"
            });
        }

        const [results] = await database.query(`SELECT * FROM users WHERE refresh_token = ?`, [refreshToken]);
        if (results.length === 0) {
            return res.status(403).json({
                error: "Invalid refresh token"
            });
        }

        const user = results[0];
        jwt.verify(refreshToken, REFRESH, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    error: "Invalid refresh token"
                });
            }
            const { user_id, full_name, email } = user;
            const accessToken = jwt.sign({ userId: user_id, userName: full_name, userEmail: email }, SECRET, {
                expiresIn: '60m',
                algorithm: "HS256"
            });

            res.json({
                accessToken,
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal Server Error!"
        });
    }
}

module.exports = refreshToken;
