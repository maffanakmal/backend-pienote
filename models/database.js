const mysql = require("mysql2/promise");
const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = require("../config/appConfig");

// Create the connection pool with the configuration
const database = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// Function to test the connection
async function testConnection() {
    try {
        const connection = await database.getConnection();
        console.log('Connected to database...');
    } catch (error) {
        console.error(`Connection to database failed: ${error.message}`);
    }
}

// Test the connection when the module is loaded
testConnection();

module.exports = database;
