const { checkSchema } = require('express-validator');

const loginValidation = checkSchema({
    authIdentifier: {
        notEmpty: {
            errorMessage: 'authIdentifier must not be empty',
        },
        custom: {
            options: (value) => {
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                const isUsername = value.length >= 5 && value.length <= 255;
                if (!isEmail && !isUsername) {
                    throw new Error('Must be a valid email or username (5-255 characters)');
                }
                return true;
            },
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Password must not be empty',
        },
        isLength: {
            options: { min: 5, max: 128 },
            errorMessage: 'Password must be between 5-128 characters',
        },
    },
});

module.exports = loginValidation;
