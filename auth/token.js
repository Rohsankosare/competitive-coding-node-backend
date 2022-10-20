require("dotenv").config();

const jwt = require("jsonwebtoken");

const generateJSONToken =  (user) => {
  const accesstoken =  jwt.sign(user, process.env.SECRATE_TOKEN);
  return accesstoken;
};

module.exports = generateJSONToken;
