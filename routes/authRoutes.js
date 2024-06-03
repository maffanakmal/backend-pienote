const { register, login, logout } = require("../controllers/authController");
const registerValidation = require("../validations/registerValidation");
const loginValidation = require("../validations/loginValidation");
const refreshToken = require("../middleware/refreshToken");

const { checkSchema } = require("express-validator");
const express = require("express");
const router = require("express").Router();

router.post("/register", checkSchema(registerValidation), register);
router.post("/login", loginValidation, login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

module.exports = router;