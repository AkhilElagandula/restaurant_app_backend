import jwt from 'jsonwebtoken';
import { sendResponse } from './response';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Token from '../models/tokens';

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
    const isTokenValid = await checkToken(token, req.user);
    if (!isTokenValid) sendResponse(res, 403, 'Invalid Token!!');

    next();
  } catch (err) {
    sendResponse(res, 403, 'Invalid Token!!', err);
  }
};

// Check if the Token exist in the 
export const checkToken = async (tokenString: string, user: any) => {
  try {
    // Mongo Query to select the token
    const token = await Token.findOne({ user: user.id, token: tokenString });
    if (token) {
      const isTokenValid = token.expiresAt > new Date();
      return isTokenValid ? true : false;
    }
    else {
      return false;
    }
  } catch (err) {
    console.error('Database error:', err);
    return false;
  }
};
