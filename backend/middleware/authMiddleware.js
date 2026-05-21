const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = 'token';

exports.generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
  
  return token;
};

exports.clearCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    
    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
  
    const decoded = jwt.verify(token, JWT_SECRET);
  
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};

exports.adminProtect = async (req, res, next) => {
  await exports.protect(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен. Только для администраторов.' });
    }
    next();
  });
};