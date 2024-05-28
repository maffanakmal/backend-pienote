const mysql = require("mysql2/promise");
const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = require("../config/appConfig");

// Create the connection pool. The pool-specific settings are the defaults
const database = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

database
    .getConnection()
    .then(() => console.log(`Connected to database`))
    .catch((err) => console.error(`Connection to database failed ${err}`));

module.exports = database;