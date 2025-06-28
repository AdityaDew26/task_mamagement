import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const getDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'editor':
      return '/editor/dashboard';
    case 'viewer':
      return '/viewer/dashboard';
    default:
      return '/';
  }
};

export const Signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const allowedRoles = ['admin', 'viewer', 'editor', 'manager'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Signup successful',
      token,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      dashboardPath: getDashboardPath(newUser.role),
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || null,
      dashboardPath: getDashboardPath(user.role),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const { name, role, avatarUrl, email } = req.user;
    res.status(200).json({ name, role, avatarUrl, email });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role'); // Select only necessary fields
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Failed to fetch users:', error.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};