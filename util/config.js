/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET
}