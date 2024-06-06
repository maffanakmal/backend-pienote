const { register, login, logout } = require("../controllers/authController");
const registerValidation = require("../validations/registerValidation");
const loginValidation = require("../validations/loginValidation");
const authMiddleware = require("../middleware/authMiddleware");

const { checkSchema } = require("express-validator");
const express = require("express");
const router = require("express").Router();

router.get("/", authMiddleware, (req, res) => {
    return res.json({Status: "OK", fullName: req.full_name, email: req.email})

})
router.post("/register", checkSchema(registerValidation), register);
router.post("/login", loginValidation, login);
router.delete("/logout", logout);

module.exports = router;