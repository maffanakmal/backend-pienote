const errorHandler = (err, req, res, next) => {
    console.errpr(err)
    res.status(500).json({
        error: "Something went wrong"
    })
    next();
}

module.exports = errorHandler;