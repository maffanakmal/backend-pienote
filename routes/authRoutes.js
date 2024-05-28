const { register, login } = require("../controllers/authController");
const registerValidation = require("../validations/registerValidation");
const loginValidation = require("../validations/loginValidation");

const { checkSchema } = require("express-validator");
const express = require("express");
const router = require("express").Router();

router.post("/register", checkSchema(registerValidation), register);
router.post("/login", checkSchema(loginValidation), login);




module.exports = router;