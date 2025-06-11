// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "An account with this email already exists. try with another email." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error('Signup error:', err);
    
    // Handle MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "An account with this email already exists. Please use a different email or try logging in." 
      });
    }
    
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Include role in JWT payload
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } // Extended expiry
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Login failed" });
  }
};