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
            `INSERT INTO personal_savings (user_id, saving_name, description, target, place_saving, dateline, notification, wishlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, saving_name, description, target, place_saving, dateline, notification, wishlist]
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

async function createGroupSavings(req, res) {
    const user_id = req.user.user_id;
    const { saving_name, description, target, place_saving, dateline, friends, notification, wishlist } = req.body;

    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Bad request",
            errors: errors.array(),
        });
    }

    try {
        // Insert into group_savings table
        const [result] = await database.query(
            `INSERT INTO group_savings (user_id, saving_name, description, target, place, dateline, notification, wishlist) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, saving_name, description, target, place_saving, dateline, notification, wishlist]
        );

        if (result.affectedRows > 0) {
            const groupsavings_id = result.insertId;

            // Add friends to the saving_friends table
            if (friends && friends.length > 0) {
                // Assuming friends are usernames, fetch their user IDs
                const friendIds = await Promise.all(friends.map(async (username) => {
                    const [friendResult] = await database.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
                    if (friendResult.length > 0) {
                        return friendResult[0].user_id;
                    } else {
                        throw new Error(`User ${username} not found`);
                    }
                }));

                const friendInserts = friendIds.map(friend_id => [friend_id, groupsavings_id]);
                const [friendsResult] = await database.query(
                    `INSERT INTO saving_friends (user_id, groupsavings_id) VALUES ?`,
                    [friendInserts]
                );

                if (friendsResult.affectedRows !== friends.length) {
                    return res.status(500).json({ error: "Failed to add all friends to saving" });
                }
            }

            return res.json({ message: "New saving and friends added!" });
        }

        res.status(500).json({ error: "Failed to create new saving" });
    } catch (error) {
        console.error("Error while inserting new saving:", error.message);
        res.status(500).json({
            error: "Internal Server Error while inserting new saving",
        });
    }
};

async function updatePersonalSavings(req, res) {
    const user_id = req.user.user_id;
    const { saving_id } = req.params;
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
            `UPDATE personal_savings 
            SET saving_name = ?, description = ?, target = ?, place_saving = ?, dateline = ?, notification = ?, wishlist = ?
            WHERE user_id = ? AND saving_id = ?`,
            [saving_name, description, target, place_saving, dateline, notification, wishlist, user_id, saving_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "Saving updated successfully!" });
        }

        res.status(404).json({ error: "Saving not found" });
    } catch (error) {
        console.error("Error while updating saving:", error);
        res.status(500).json({
            error: "Internal Server Error while updating saving",
        });
    }
}

async function deletePersonalSavings(req, res) {
    const user_id = req.user.user_id;
    const { saving_id } = req.params;

    try {
        const [result] = await database.query(
            `DELETE FROM personal_savings WHERE user_id = ? AND saving_id = ?`,
            [user_id, saving_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "Saving deleted successfully!" });
        }

        res.status(404).json({ error: "Saving not found" });
    } catch (error) {
        console.error("Error while deleting saving:", error);
        res.status(500).json({
            error: "Internal Server Error while deleting saving",
        });
    }
}

async function getPersonalSavings(req, res) {
    const user_id = req.user.user_id;

    try {
        const [rows] = await database.query(
            `SELECT saving_id, saving_name, description, target, place_saving, dateline, notification, wishlist 
            FROM personal_savings 
            WHERE user_id = ?`,
            [user_id]
        );

        if (rows.length > 0) {
            return res.json({ savings: rows });
        }

        res.status(404).json({ error: "No savings found" });
    } catch (error) {
        console.error("Error while fetching savings:", error);
        res.status(500).json({
            error: "Internal Server Error while fetching savings",
        });
    }
}

async function updateGroupSavings(req, res) {
    const user_id = req.user.user_id;
    const { saving_id } = req.params;
    const { saving_name, description, target, place_saving, dateline, notification, wishlist, friends } = req.body;

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
            `UPDATE group_savings 
            SET saving_name = ?, description = ?, target = ?, place = ?, dateline = ?, notification = ?, wishlist = ?
            WHERE user_id = ? AND groupsavings_id = ?`,
            [saving_name, description, target, place_saving, dateline, notification, wishlist, user_id, saving_id]
        );

        if (result.affectedRows > 0) {
            // Update friends
            if (friends && friends.length > 0) {
                // Delete existing friends
                await database.query(
                    `DELETE FROM saving_friends WHERE groupsavings_id = ?`,
                    [saving_id]
                );

                // Assuming friends are usernames, fetch their user IDs
                const friendIds = await Promise.all(friends.map(async (username) => {
                    const [friendResult] = await database.query(`SELECT user_id FROM users WHERE username = ?`, [username]);
                    if (friendResult.length > 0) {
                        return friendResult[0].user_id;
                    } else {
                        throw new Error(`User ${username} not found`);
                    }
                }));

                const friendInserts = friendIds.map(friend_id => [friend_id, saving_id]);
                await database.query(
                    `INSERT INTO saving_friends (user_id, groupsavings_id) VALUES ?`,
                    [friendInserts]
                );
            }

            return res.json({ message: "Saving updated successfully!" });
        }

        res.status(404).json({ error: "Saving not found" });
    } catch (error) {
        console.error("Error while updating saving:", error.message);
        res.status(500).json({
            error: "Internal Server Error while updating saving",
        });
    }
}

async function deleteGroupSavings(req, res) {
    const user_id = req.user.user_id;
    const { saving_id } = req.params;

    try {
        const [result] = await database.query(
            `DELETE FROM group_savings WHERE user_id = ? AND groupsavings_id = ?`,
            [user_id, saving_id]
        );

        if (result.affectedRows > 0) {
            // Delete associated friends
            await database.query(
                `DELETE FROM saving_friends WHERE groupsavings_id = ?`,
                [saving_id]
            );
            return res.json({ message: "Saving deleted successfully!" });
        }

        res.status(404).json({ error: "Saving not found" });
    } catch (error) {
        console.error("Error while deleting saving:", error);
        res.status(500).json({
            error: "Internal Server Error while deleting saving",
        });
    }
}

async function getGroupSavings(req, res) {
    const user_id = req.user.user_id;

    try {
        const [rows] = await database.query(
            `SELECT gs.groupsavings_id, gs.saving_name, gs.description, gs.target, gs.place, gs.dateline, gs.notification, gs.wishlist, 
                    GROUP_CONCAT(u.username) as friends
            FROM group_savings gs
            LEFT JOIN saving_friends sf ON gs.groupsavings_id = sf.groupsavings_id
            LEFT JOIN users u ON sf.user_id = u.user_id
            WHERE gs.user_id = ?
            GROUP BY gs.groupsavings_id, gs.saving_name, gs.description, gs.target, gs.place, gs.dateline, gs.notification, gs.wishlist`,
            [user_id]
        );

        if (rows.length > 0) {
            return res.json({ savings: rows });
        }

        res.status(404).json({ error: "No savings found" });
    } catch (error) {
        console.error("Error while fetching savings:", error);
        res.status(500).json({
            error: "Internal Server Error while fetching savings",
        });
    }
}

async function createPersonalCurrentSaving(req, res) {
    const { personalsaving_id } = req.params;
    const { add_current_saving, date } = req.body;

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
            `INSERT INTO personal_current_savings (add_current_saving, date, personalsaving_id) VALUES (?, ?, ?)`,
            [add_current_saving, date, personalsaving_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "New current saving added!" });
        }

        res.status(500).json({ error: "Failed to add new current saving" });
    } catch (error) {
        console.error("Error while inserting new current saving:", error);
        res.status(500).json({
            error: "Internal Server Error while inserting new current saving",
        });
    }
}

async function updatePersonalCurrentSaving(req, res) {
    const { personalcurrentsaving_id } = req.params;
    const { add_current_saving, date, personalsaving_id } = req.body;

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
            `UPDATE personal_current_savings 
            SET add_current_saving = ?, date = ?, personalsaving_id = ?
            WHERE personalcurrentsaving_id = ?`,
            [add_current_saving, date, personalsaving_id, personalcurrentsaving_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "Current saving updated successfully!" });
        }

        res.status(404).json({ error: "Current saving not found" });
    } catch (error) {
        console.error("Error while updating current saving:", error);
        res.status(500).json({
            error: "Internal Server Error while updating current saving",
        });
    }
}

async function deletePersonalCurrentSaving(req, res) {
    const { personalcurrentsaving_id } = req.params;

    try {
        const [result] = await database.query(
            `DELETE FROM personal_current_savings WHERE personalcurrentsaving_id = ?`,
            [personalcurrentsaving_id]
        );

        if (result.affectedRows > 0) {
            return res.json({ message: "Current saving deleted successfully!" });
        }

        res.status(404).json({ error: "Current saving not found" });
    } catch (error) {
        console.error("Error while deleting current saving:", error);
        res.status(500).json({
            error: "Internal Server Error while deleting current saving",
        });
    }
}

async function getPersonalCurrentSavings(req, res) {
    const user_id = req.user.user_id;

    try {
        const [rows] = await database.query(
            `SELECT pcs.personalcurrentsaving_id, pcs.add_current_saving, pcs.date, pcs.personalsaving_id, gs.saving_name
            FROM personal_current_savings pcs
            LEFT JOIN group_savings gs ON pcs.personalsaving_id = gs.personalsaving_id
            WHERE gs.user_id = ?`,
            [user_id]
        );

        if (rows.length > 0) {
            return res.json({ current_savings: rows });
        }

        res.status(404).json({ error: "No current savings found" });
    } catch (error) {
        console.error("Error while fetching current savings:", error);
        res.status(500).json({
            error: "Internal Server Error while fetching current savings",
        });
    }
}

module.exports = {
    createPersonalSavings,
    createGroupSavings,
    updatePersonalSavings,
    deletePersonalSavings,
    getPersonalSavings,
    updateGroupSavings,
    deleteGroupSavings,
    getGroupSavings,
    createPersonalCurrentSaving,
    updatePersonalCurrentSaving,
    deletePersonalCurrentSaving,
    getPersonalCurrentSavings,
};
