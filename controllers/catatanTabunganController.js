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
        // Inserting the new saving into the database
        const [result] = await database.query(
            `INSERT INTO personal_savings (user_id, saving_name, description, target, place_saving, dateline, notification, wishlist) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, saving_name, description, target, place_saving, dateline, notification, wishlist]
        );

        // Check if the insert was successful
        if (result.affectedRows > 0) {
            return res.json({ message: "New saving created!" });
        } else {
            return res.status(500).json({ error: "Failed to create new saving" });
        }
    } catch (error) {
        console.error("Error while inserting new saving:", error);
        return res.status(500).json({
            error: "Internal Server Error while inserting new saving",
        });
    }
}

async function updatePersonalSavings(req, res) {
    const user_id = req.user.user_id;
    const { personalsaving_id } = req.params;
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
            WHERE user_id = ? AND personalsaving_id = ?`,
            [saving_name, description, target, place_saving, dateline, notification, wishlist, user_id, personalsaving_id]
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
    const { personalsaving_id } = req.params;

    try {
        const [result] = await database.query(
            `DELETE FROM personal_savings WHERE user_id = ? AND personalsaving_id = ?`,
            [user_id, personalsaving_id]
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
    console.log(`Fetching savings for user_id: ${user_id}`);

    try {
        const [rows] = await database.query(
            `SELECT ps.personalsaving_id, ps.saving_name, ps.target, ps.place_saving, ps.dateline, ps.notification, ps.wishlist,
                    COALESCE(SUM(pcs.add_current_saving), 0) as current_amount
            FROM personal_savings ps
            LEFT JOIN personal_current_saving pcs ON ps.personalsaving_id = pcs.personalsaving_id
            WHERE ps.user_id = ?
            GROUP BY ps.personalsaving_id`,
            [user_id]
        );
        console.log('Query result:', rows);

        if (rows.length > 0) {
            return res.json({ savings: rows });
        }

        return res.status(404).json({ error: "No savings found" });
    } catch (error) {
        console.error("Error stack:", error.stack);
        return res.status(500).json({
            error: "Internal Server Error while fetching savings",
        });
    }
}


const getPersonalSavingsDetail = async (req, res) => {
    const user_id = req.user.user_id;
    const { personalsaving_id } = req.params;
    console.log(`Fetching personal savings details for user_id: ${user_id}, personalsaving_id: ${personalsaving_id}`);

    try {
        const [rows] = await database.query(
            `SELECT saving_name, description, target, place_saving, dateline, notification, wishlist 
            FROM personal_savings 
            WHERE user_id = ? AND personalsaving_id = ?`,
            [user_id, personalsaving_id]
        );

        console.log('Query result:', rows);

        if (rows.length > 0) {
            return res.json(rows[0]); // Assuming only one result is expected
        }

        return res.status(404).json({ error: "Personal saving not found" });
    } catch (error) {
        console.error("Error fetching personal savings:", error);
        return res.status(500).json({
            error: "Internal Server Error while fetching personal savings",
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

async function getGroupSavingsDetail(req, res) {
    const user_id = req.user.user_id;
    const { groupsavings_id } = req.params;

    try {
        const query = `
            SELECT 
                gs.groupsavings_id, gs.saving_name, gs.description, gs.target, gs.place AS place_saving, gs.dateline, gs.notification, gs.wishlist,
                GROUP_CONCAT(u.username) as friends
            FROM group_savings gs
            LEFT JOIN saving_friends sf ON gs.groupsavings_id = sf.groupsavings_id
            LEFT JOIN users u ON sf.user_id = u.user_id
            WHERE gs.user_id = ? AND gs.groupsavings_id = ?
            GROUP BY gs.groupsavings_id
        `;

        console.log("Executing query:", query); // Log the query being executed

        const [rows] = await database.query(query, [user_id, groupsavings_id]);

        if (rows.length > 0) {
            // Transform rows to parse friends as an array
            const savingsData = rows.map(row => ({
                ...row,
                friends: row.friends ? row.friends.split(',') : [] // Convert friends string to array
            }));

            return res.json({ savings: savingsData });
        }

        return res.status(404).json({ error: "No savings found" });
    } catch (error) {
        console.error("Error while fetching savings:", error);
        return res.status(500).json({
            error: "Internal Server Error while fetching savings",
        });
    }
}



async function getGroupSavings(req, res) {
    const user_id = req.user.user_id;

    try {
        const query = `
            SELECT 
                gs.groupsavings_id, gs.saving_name, gs.description, gs.target, gs.place, gs.dateline, gs.notification, gs.wishlist,
                GROUP_CONCAT(u.username) as friends,
                gcs.add_current_saving, gcs.date
            FROM group_savings gs
            LEFT JOIN saving_friends sf ON gs.groupsavings_id = sf.groupsavings_id
            LEFT JOIN users u ON sf.user_id = u.user_id
            LEFT JOIN group_current_saving gcs ON gs.groupsavings_id = gcs.groupsavings_id
            WHERE gs.user_id = ?
            GROUP BY gs.groupsavings_id
        `;

        console.log("Executing query:", query); // Log the query being executed

        const [rows] = await database.query(query, [user_id]);

        if (rows.length > 0) {
            // Transform rows to parse friends as an array
            const savingsData = rows.map(row => ({
                ...row,
                friends: row.friends ? row.friends.split(',') : [] // Convert friends string to array
            }));

            return res.json({ savings: savingsData });
        }

        return res.status(404).json({ error: "No savings found" });
    } catch (error) {
        console.error("Error while fetching savings:", error);
        return res.status(500).json({
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
            `INSERT INTO personal_current_saving (add_current_saving, date, personalsaving_id) VALUES (?, ?, ?)`,
            [add_current_saving, date, personalsaving_id]
        );

        if (result.affectedRows > 0) {
            return res.status(201).json({ message: "New current saving added!" });
        }

        res.status(500).json({ error: "Failed to add new current saving" });
    } catch (error) {
        console.error("Error while inserting new current saving:", error);
        res.status(500).json({
            error: "Internal Server Error while inserting new current saving",
        });
    }
}

async function getPersonalCurrentSavings(req, res) {
    const user_id = req.user.user_id;
    const { personalsaving_id } = req.params;

    try {
        const [rows] = await database.query(
            `SELECT pcs.personalcurrentsaving_id, pcs.add_current_saving, pcs.date, pcs.personalsaving_id, ps.saving_name
            FROM personal_current_saving pcs
            LEFT JOIN personal_savings ps ON pcs.personalsaving_id = ps.personalsaving_id
            WHERE ps.user_id = ? AND ps.personalsaving_id = ?`, // Added condition for personalsaving_id
            [user_id, personalsaving_id]
        );

        return res.status(200).json({ current_savings: rows });

    } catch (error) {
        console.error("Error while fetching current savings:", error);
        res.status(500).json({
            error: "Internal Server Error while fetching current savings",
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

module.exports = {
    createPersonalSavings,
    updatePersonalSavings,
    deletePersonalSavings,
    getPersonalSavings,
    getPersonalSavingsDetail,

    createGroupSavings,
    updateGroupSavings,
    deleteGroupSavings,
    getGroupSavings,
    getGroupSavingsDetail,

    createPersonalCurrentSaving,
    updatePersonalCurrentSaving,
    deletePersonalCurrentSaving,
    getPersonalCurrentSavings,
};
