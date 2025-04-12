const User = require("../models/User");
const OTP = require("../models/OTP");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
//register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validate the inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }
    //check if user exits
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user with this email already exists",
      });
    }
    const otp = generateOTP();
    await OTP.deleteOne({ email });

    const otpRecord = new OTP({
      email,
      otp,
    });
    await otpRecord.save();

    const mailSubject = "Your OTP for Registration";
    const mailBody = `Hi ${name},
    
Your OTP for registration is: ${otp}
    
This OTP will expire in 5 minutes.`;

    await sendEmail(email, mailSubject, mailBody);

    return res.status(200).json({
      success: true,
      message: "otp sent to your email",
      data: {
        name,
        email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};
//verify user
const verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;
    if (!email || !otp || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, OTP, name, and password",
      });
    }
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new OTP",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    const newUser = new User({
      name,
      email,
      password,
      isEmailVerified: true,
    });

    await newUser.save();

    await OTP.deleteOne({ email });
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please login.",
      redirectTo: "/login",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const ispasswordmatch = await bcrypt.compare(password, user.password);
    if (!ispasswordmatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict ",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong",
      error: error.message,
    });
  }
};

module.exports = { registerUser, verifyOTPAndRegister, loginUser };
