const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({
  path: ".env",
});

const getEnv = (key, defaultValue = undefined) => {
  return process.env[key] || defaultValue;
};

module.exports = {
  getEnv,
};
