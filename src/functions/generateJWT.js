const jwt = require('jsonwebtoken');

const generateJWT = (item) => {
    return jwt.sign({ item }, process.env.JWT_TOKEN_SECRET)
};

module.exports = generateJWT;