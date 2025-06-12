import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";


export const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password using Salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    if(newUser) {
        //generate jwt token
        generateToken(newUser._id, res);
        //save data to database
        await newUser.save();

        res.status(201).json({
          message: 'User registered successfully',
          user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
          }
        });
 
    } else {
        res.status(400).json({ message: 'Invalid User data' });
    }

   
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password'); // because password is select: false in schema

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT Token
    const token = generateToken(user._id, res);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const logout = (req, res) => {
    // Logic for user logout
    res.send('User logged out successfully');
}