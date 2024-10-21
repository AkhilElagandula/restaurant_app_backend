import jwt from 'jsonwebtoken';
import { sendResponse } from './response';

const accessTokenSecret = process.env.JWT_SECRET || '';

// Generate Access Token
export const generateAccessToken = async (user: any) => {
  const payload = {
    ...user,
    iat: Math.floor(Date.now() / 1000), // Issued at time
    nonce: Math.random().toString(36).substr(2), // A random string to ensure uniqueness
  };
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Middleware to Authenticate Token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) sendResponse(res, 401, 'Please provide Token in request header!');

  try {
    const user = jwt.verify(token, accessTokenSecret);
    req.user = user;
    const isTokenValid = await checkToken(req, token, req.user);
    if (!isTokenValid) sendResponse(res, 403, 'Invalid Token!!');

    next();
  } catch (err) {
    sendResponse(res, 403, 'Invalid Token!!', err);
  }
};

// Check if the Token exist in the 
export const checkToken = async (req, token, user) => {
  try {
    // Mongo Query to select the token
  } catch (err) {
    console.error('Database error:', err);
    return false;
  }
};
