const { validationResult } = require("express-validator");
const database = require("../models/database");

async function createPersonalSavings(req, res) {
    const user_id = req.user.user_id;
    const { saving_name, description, target, place_saving, dateline, notification, wishlist } = req.body;

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        const [result] = await database.query(
            `INSERT INTO personal_savings (user_id, saving_name, description, target, place_saving, dateline, notification, wishlist ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, saving_name, description, target, place_saving, dateline, notification, wishlist ]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "New saving created!" });
        }

        res.status(500).json({ error: "Failed to create new saving" });
    } catch (error) {
        console.error("Error while inserting new saving:", error);
        res.status(500).json({
            error: "Internal Server Error while inserting new saving",
        });
    }
};

module.exports = {
    createPersonalSavings,
}