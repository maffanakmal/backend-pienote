const logger = (req, res, next) => {
    const url = req.originalUrl

    console.log(`URL: ${url}`);
    next();
}

module.exports = logger;