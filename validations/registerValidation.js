const registerValidation = {
    full_name: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                min: 3,
                max: 255,
            },
            errorMessage: "At least must be 3-255 Characters",
        },
    },
    username: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                min: 5,
                max: 255,
            },
            errorMessage: "At least must be 3-255 Characters",
        },
    },
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
    phone_number: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                max: 20,
            },
            errorMessage: "At least must be 6-128 Characters",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                min: 5,
                max: 128,
            },
            errorMessage: "At least must be 6-128 Characters",
        },
    },
    confirm_pass: {
        notEmpty: {
            errorMessage: "Must be not empty",
        },
        isLength: {
            options: {
                min: 5,
                max: 128,
            },
            errorMessage: "At least must be 6-128 Characters",
        },
    },
}

module.exports = registerValidation