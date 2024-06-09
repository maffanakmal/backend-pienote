const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/appConfig");
const database = require("../models/database");

const authMiddleware = async (req, res, next) => {
    // Extract token from request headers
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    try {
        // Verify token
        const decodedToken = jwt.verify(token, SECRET, { algorithms: ["HS256"] });

        // Check if user ID exists in the database
        const [users] = await database.query(`SELECT * FROM users WHERE user_id = ?`, [decodedToken.userId]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const user = users[0];

        req.user = user; // Assuming you might need the user object later

        // Proceed to the next route or middleware
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;
