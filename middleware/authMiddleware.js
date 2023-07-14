import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModels.js';
import dotenv from 'dotenv';

dotenv.config();

const protect = async (req, res, next) => {
    try {
      let token;
  
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("this is decoded",decoded);

        req.user = await User.findById(decoded.id);
      }
  
      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };
  
  export default protect;