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
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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

// Function to get username and user ID using email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body; // or req.params.email if you're using URL parameters

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email (excluding password for security)
    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User found successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Alternative: Helper function for internal use (not an API endpoint)
export const fetchUserDataByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      return null; // Return null if user not found
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email
    };

  } catch (err) {
    console.error('Fetch user data error:', err);
    throw err; // Re-throw error for calling function to handle
  }
};