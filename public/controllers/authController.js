const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/User.js');
const Otp = require("../Model/Otp.js")
const generateOtp=require("../utils/generateOtp");
const sendEmail=require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // JWT Token generate
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// const requestEmailOtp = async (req, res) => {
//     const { email } = req.body;
//     try {
//         if (!email) {
//             return res.status(400).json({ message: "Email is required" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: "User already exists" });
//         }
        
//         // Generate OTP & send email
//         const otp = generateOtp();
//         console.log("Generated Email OTP:", otp);
        
//         await Otp.findOneAndUpdate(
//             { email },
//             { otp, createdAt: new Date() },
//             { upsert: true, new: true }
//         );
        
//         await sendEmail(email, otp);
//         return res.status(200).json({ message: "OTP sent to email!" });
        
//     } catch (error) {
//         return res.status(500).json({ message: "Error sending OTP", error });
//     }
// };

const verifyEmailOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        const storedOtp = await Otp.findOne({ email });
        
        if (!storedOtp || storedOtp.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        await Otp.deleteOne({ email }); // OTP used, delete from DB
        
        return res.status(200).json({ message: "Email verified successfully!" });
        
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};
const OTP_EXPIRY = 10 * 60 * 1000;
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found!" });
        const expiry = new Date(Date.now() + OTP_EXPIRY);
        const otp = generateOtp();  // Generate OTP
        await Otp.findOneAndUpdate(
            { email },
            { email, otp, createdAt: new Date(), expiresAt: expiry },
            { upsert: true, new: true }
        );

        await sendEmail(email, `Your password reset OTP is: ${otp}`);
        res.status(200).json({ message: "OTP sent to your email." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 🔹 Step 2: Verify OTP
const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const storedOtp = await Otp.findOne({ email });
        if (!storedOtp) return res.status(400).json({ message: "OTP expired or invalid." });
        if (storedOtp.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired." });
        if (storedOtp.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

        await Otp.deleteOne({ email });  // OTP verified, delete it
        res.status(200).json({ message: "OTP verified. You can reset your password now." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 🔹 Step 3: Reset Password
const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        res.status(200).json({ message: "Password reset successful!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { registerUser, loginUser , verifyEmailOtp,resetPassword,forgotPassword,verifyResetOtp };
