import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';

function generateTokens(user) {
  const payload = { userId: user._id.toString(), email: user.email };
  const accessToken = jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });
  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
  return { accessToken, refreshToken };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Name, email and password are required'
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email already registered'
      });
    }
    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user);
    res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      },
      message: 'Registered successfully'
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email and password are required'
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password'
      });
    }
    const { accessToken, refreshToken } = generateTokens(user);
    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      },
      message: 'Logged in successfully'
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Refresh token required'
      });
    }
    const decoded = jwt.verify(token, env.jwtRefreshSecret);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid refresh token'
      });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'User not found'
      });
    }
    const { accessToken, refreshToken: newRefresh } = generateTokens(user);
    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefresh },
      message: ''
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired refresh token'
    });
  }
}

export async function logout(req, res) {
  res.json({
    success: true,
    data: null,
    message: 'Logged out successfully'
  });
}
