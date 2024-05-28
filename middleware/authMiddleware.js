const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/appConfig')
const database = require('../models/database')

const authMiddleware = async (req, res, next) => {
    // Ambil token dari request headers
    const token = req.headers.authorization.split(" ")[1]

    // Cek apakah token ada
    if (token === null) {
        return res.status(401).json({
            message: "Unauthorized: Token is required"
        })
    }

    // Cek apakah token valid
    try {
        // Verifikasi token
        const decodedToken = jwt.verify(token, SECRET, {algorithms: ["HS256"]})
        
        // Cek apakah id user ada di database
        const [user] = await database.query("SELECT * FROM users WHERE id =?", [decodedToken.userId])
        
        if(!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found",
            })
        }

        req.user
        // Next route atau middleware
        next()
    } catch (error) {
        console.error("Token verification error: ", error)
        return res.status(401).json({
            message: "Unauthorized: Invalid token"
        })
    }
}

module.exports = authMiddleware