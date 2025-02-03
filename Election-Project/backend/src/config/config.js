// /config/config.js
require('dotenv').config();

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiration = process.env.JWT_EXPIRATION;
