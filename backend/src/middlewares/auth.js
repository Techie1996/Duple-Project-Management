import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Authentication required'
    });
  }
  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired token'
    });
  }
}
