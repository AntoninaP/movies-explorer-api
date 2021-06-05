require('dotenv').config();
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: process.env.WINDOWS_RATE_LIMIT,
  max: process.env.MAX_RATE_LIMIT,
});

exports.limiter = limiter;
