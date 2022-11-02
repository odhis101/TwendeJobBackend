import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js" 
import Jobs from '../models/JobsModel.js';
const getJobs = asyncHandler(async (req, res) => {
    const JobExists = await Jobs.find({ user: req.user.id })
  
    res.status(200).json(getJobs)
  })
  const setJob = asyncHandler(async (req, res) => {
    const { text, user } = req.body;
    if (!text) {
      res.status(400)
      throw new Error('Please add a text field')
    }
  
    const job = await Jobs.create({
      text,
      user,
    })
  
    res.status(200).json(job)
})

/*
const registerUser = asyncHandler(async (req, res) => {
  const { name, phoneNumber, password } = req.body;
  const userExists = await User.findOne({ phoneNumber });
  if (userExists) {
      res.status(400);
      throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
      phoneNumber,
      password: hashedPassword,
  });
  if (user) {
      res.status(201).json({
          _id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          password: user.password,
          token: generateToken(user._id),
      });
  } else {
      res.status(400);
      throw new Error('Invalid user data');
  }
})
*/
export {setJob, getJobs};