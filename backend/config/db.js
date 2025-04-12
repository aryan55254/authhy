const mongoose = require("mongoose");
require("dotenv").config();
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectdb;
