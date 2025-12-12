require("dotenv").config();
const express = require("express");
const cors = require("cors");
const generateOTP = require("./otp/otpGenerator");
const sendOTPEmail = require("./otp/sendEmail");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // for index.html

// In-memory OTP storage
const otpStore = {};

// SEND OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  try {
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Brevo Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ success: false, message: "Email and OTP required" });

  const record = otpStore[email];

  if (!record)
    return res.status(400).json({ success: false, message: "OTP not found" });

  if (Date.now() > record.expiresAt)
    return res.status(400).json({ success: false, message: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP" });

  delete otpStore[email];

  res.json({ success: true, message: "OTP Verified Successfully 🎉" });
});

// SERVER
app.listen(process.env.PORT, () =>
  console.log(`🚀 Email OTP server running at http://localhost:${process.env.PORT}`)
);
