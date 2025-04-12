const express = require("express");
const auth = require("../controllers/authController");
const router = express.Router();
//register
router.post("/register", auth.registerUser);
//verify
router.post("/verify", auth.verifyOTPAndRegister);
//login
router.post("/login", auth.loginUser);

module.exports = router;
