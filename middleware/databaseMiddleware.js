// const createDatabaseConnection = require('../models/database')

// const databaseMiddleware = (req, res, next) => {
//     req.db = createDatabaseConnection()
//     res.on("Finish", () => {
//         if (req.db) {
//             req.db.end((err) => {
//                 if (err) {
//                     console.log("Error closing database connection: " + err)
//                 } else {
//                     console.log("Database connection closed")
//                 }
//             })
//         }
//     })
//     next()
// }

// module.exports = databaseMiddleware