import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js" 
//import Jobs from '../models/JobsModel.js';
import ClassifiedJobs from '../models/classModel.js';
const getClassifiedJobs = asyncHandler(async (req, res) => {
    const JobExists = await ClassifiedJobs.find({})
  
    res.status(200).json(JobExists)
  })
  const setClassifiedJob = asyncHandler(async (req, res) => {
    const {user,jobTitle,jobDescription,Employers_contact,DeadlineDate,Category,EMPLOYER_EMAIL,Employers_Name} = req.body;
    console.log(req.body)
    if (!jobTitle, !jobDescription, !Employers_contact, !DeadlineDate, !Category, !EMPLOYER_EMAIL, !Employers_Name) {
      res.status(400)
      throw new Error('Please add a text field')
    }
  
    const job = await ClassifiedJobs.create({
      user,
      jobTitle,
      jobDescription,
      Employers_contact,
      DeadlineDate,
      Category,
      EMPLOYER_EMAIL,
      Employers_Name

    })
  
    res.status(200).json(job)
})
export {setClassifiedJob,getClassifiedJobs};