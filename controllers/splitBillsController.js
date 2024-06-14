const database = require("../models/database");
const { validationResult } = require("express-validator");
const upload = require("../middleware/multer");

const createBill = async (req, res) => {
    const { bill_name, friends } = req.body;
    const user_id = req.user.user_id;

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request create billl",
            errors: errors.array(),
        });
    }

    const connection = await database.getConnection();

    try {
        await connection.beginTransaction();

        let bill_id; // Define bill_id variable

        // Insert the new bill into the 'bills' table
        const [result] = await connection.query(
            `INSERT INTO bills (bill_name, user_id) VALUES (?, ?)`,
            [bill_name, user_id]
        );

        if (result.affectedRows > 0) {
            bill_id = result.insertId; // Assign insertId to bill_id

            // Check if all friend usernames exist in the users table
            if (friends && friends.length > 0) {
                // Fetch user IDs for the given usernames
                const [existingFriends] = await connection.query(
                    'SELECT user_id, username FROM users WHERE username IN (?)',
                    [friends]
                );

                const existingFriendIDs = existingFriends.map(friend => friend.user_id);
                const existingFriendUsernames = existingFriends.map(friend => friend.username);

                // Check if all usernames were found
                const notFoundUsernames = friends.filter(friend => !existingFriendUsernames.includes(friend));
                if (notFoundUsernames.length > 0) {
                    await connection.rollback();
                    return res.status(400).json({ error: `User(s) not found: ${notFoundUsernames.join(', ')}` });
                }

                // Map usernames to user IDs for insertion into 'friends' table
                const friendValues = friends.map(username => {
                    const friend = existingFriends.find(f => f.username === username);
                    return [bill_id, friend.user_id];
                });

                // Insert friends into the 'friends' table
                if (friendValues.length > 0) {
                    await connection.query(
                        `INSERT INTO friends (bill_id, user_id) VALUES ?`,
                        [friendValues]
                    );
                }
            }

            await connection.commit();
            return res.json({ message: "New bill created!", bill_id });
        } else {
            await connection.rollback();
            return res.status(500).json({ error: "Failed to create new bill" });
        }

    } catch (error) {
        await connection.rollback();
        console.error("Error while creating new bill:", error.message, error.stack);
        return res.status(500).json({
            error: "Internal Server Error while creating new bill",
            details: error.message,
        });
    } finally {
        connection.release();
    }
};


const addItemToBill = async (req, res) => {
    const { bill_id } = req.params; // Extract bill_id from URL params
    const { item_name, amount, price, sub_total, image_path, user_id } = req.body;

    // Log the received data for debugging
    console.log("Received bill_id from params:", bill_id);
    console.log("Received data from body:", req.body);

    // Validation check
    if (!bill_id || !item_name || !amount || !price || !sub_total || !image_path || !user_id) {
        console.log("Missing required fields");
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Database insertion logic
    try {
        const [result] = await database.query(
            `INSERT INTO items (bill_id, item_name, amount, price, sub_total, image_path, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [bill_id, item_name, amount, price, sub_total, image_path, user_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "Item added to bill successfully!" });
        }

        return res.status(500).json({ error: "Failed to add item to bill" });
    } catch (error) {
        console.error("Error while adding item to bill:", error);
        return res.status(500).json({ error: "Internal Server Error while adding item to bill" });
    }
};


// Get bill details by ID
const getBillById = async (req, res) => {
    const { bill_id } = req.params;
    const user_id = req.user.user_id;

    try {
        const [billResults] = await database.query(
            `SELECT * FROM bills WHERE bill_id = ? AND user_id = ?`,
            [bill_id, user_id]
        );

        if (billResults.length === 0) {
            return res.status(404).json({ error: "Bill not found" });
        }

        const [itemResults] = await database.query(
            `SELECT * FROM items WHERE bill_id = ?`,
            [bill_id]
        );

        const [friendResults] = await database.query(
            `SELECT u.user_id, u.full_name, u.email FROM friends f
                JOIN users u ON f.user_id = u.user_id
                WHERE f.bill_id = ?`,
            [bill_id]
        );

        res.json({
            bill: billResults[0],
            items: itemResults,
            friends: friendResults,
        });
    } catch (error) {
        console.error("Error getting bill details by ID:", error);
        res.status(500).json({
            error: "Internal Server Error while getting bill details",
        });
    }
};

const uploadImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Error uploading image:", err);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imagePath = req.file.path.replace('public/', '');
        const { bill_id } = req.params;
        const user_id = req.user.user_id; // Assuming user_id is available in req.user

        try {
            const [result] = await database.query(
                `UPDATE bills SET receipt_image = ? WHERE bill_id = ? AND user_id = ?`,
                [imagePath, bill_id, user_id]
            );

            if (result.affectedRows > 0) {
                return res.json({ message: "Image uploaded successfully", imagePath });
            } else {
                return res.status(500).json({ error: "Failed to update bill with image" });
            }
        } catch (error) {
            console.error("Error updating bill with image:", error);
            return res.status(500).json({
                error: "Internal Server Error while updating bill with image",
            });
        }
    });
};

module.exports = {
    createBill,
    addItemToBill,
    getBillById,
    uploadImage,
};
