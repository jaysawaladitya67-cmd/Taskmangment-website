const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./Model/User');
const jwt = require('jsonwebtoken');
// Load environment variables
dotenv.config();

// DB config (make sure dbConfig.js connects to MongoDB using process.env.MONGO_URI)
require('./db/dbConfig');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./routes/authroutes');
app.use('/api/auth', authRoutes);

// Routes
// app.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already registered" });
//     }
//     // Encrypt password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Create user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully", userId: newUser._id });
//   } catch (err) {
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// });
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Password check
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // JWT Token generate
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user._id, username: user.username, email: user.email }
//     });

//   } catch (err) {
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// });
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
