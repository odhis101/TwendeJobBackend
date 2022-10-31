import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js" 
import Jobs from '../models/JobsModel.js';
const getJobs = asyncHandler(async (req, res) => {
    const Job = await Jobs.find({ user: req.user.id })
  
    res.status(200).json(Job)
  })
  const setJob = asyncHandler(async (req, res) => {
    if (!req.body.text) {
      res.status(400)
      throw new Error('Please add a text field')
    }
  
    const job = await Jobs.create({
      text: req.body.text,
      user: req.user.id,
    })
  
    res.status(200).json(job)
})