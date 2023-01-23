import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js" 
import Jobs from '../models/JobsModel.js';
const getJobs = asyncHandler(async (req, res) => {
    const JobExists = await Jobs.find({})
  
    res.status(200).json(JobExists)
  })
  const setJob = asyncHandler(async (req, res) => {
    const {user,jobTitle,jobDescription,Employers_contact,DeadlineDate,Category,EMPLOYER_EMAIL,Employers_Name} = req.body;
    if (!jobTitle, !jobDescription, !Employers_contact, !DeadlineDate, !Category, !EMPLOYER_EMAIL, !Employers_Name) {
      res.status(400)
      throw new Error('Please add a text field')
    }
  
    const job = await Jobs.create({
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

const getOneJob = asyncHandler(async (req, res) => {
  const {id: _id} = req.params;
  const JobExists = await Jobs.findById(_id)


  res.status(200).json(JobExists)
})
const updateJob = asyncHandler(async (req, res) => {
  const {id: _id} = req.params;
  console.log(_id)
  console.log(req.body)
  const JobExists = await Jobs.findById(_id)
  if (JobExists) {
    JobExists.jobTitle = req.body.jobTitle || JobExists.jobTitle
    JobExists.jobDescription = req.body.jobDescription || JobExists.jobDescription
    JobExists.Employers_contact = req.body.Employers_contact || JobExists.Employers_contact
    JobExists.DeadlineDate = req.body.DeadlineDate || JobExists.DeadlineDate
    JobExists.Category = req.body.Category || JobExists.Category
    JobExists.EMPLOYER_EMAIL = req.body.EMPLOYER_EMAIL || JobExists.EMPLOYER_EMAIL
    JobExists.Employers_Name = req.body.Employers_Name || JobExists.Employers_Name
    const updatedJob = await JobExists.save()
    console.log(updatedJob)
  } else {
    res.status(404) 
    throw new Error('Job not found')
  }
})
const deleteJob = asyncHandler(async (req, res) => {

  const {id: _id} = req.params;

  console.log(_id)
  console.log(req.body)

  
  const JobExists = await Jobs.findById(_id)
  if (JobExists) {
    await JobExists.remove()
    res.json({message: 'Job removed'})
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})
export {setJob, getJobs,getOneJob,updateJob,deleteJob};


