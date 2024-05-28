const loginValidation = {
    email: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                max: 255,
            },
            errorMessage: "Email not more than 255 Characters",
        },
        isEmail: {
            errorMessage: "Must be valid email",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                min: 6,
                max: 128,
            },
            errorMessage: "At least must be 6-128 Characters",
        },
    },
}

module.exports = loginValidation