 const mongoose = require('mongoose');
 const validator = require('validator');
 
 const RegisterSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", RegisterSchema);

module.exports = User;