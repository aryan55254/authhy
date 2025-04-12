const jwt = require("jsonwebtoken");
require("dotenv").config();
const generatetoken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = generatetoken;
