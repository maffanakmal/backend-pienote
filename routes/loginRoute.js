const express = require("express");
const app = express();
const router = express.Router();
const { checkSchema } = require("express-validator");
const loginController = require("../controllers/loginController");
const createUserValidation = require("../validations/createUserValidation");

// METHOD POST MENAMBAHKAN DATA USER BARU
router.post(
    "/register",
    checkSchema(createUserValidation),
    loginController.registerNewUser
);

module.exports = router;