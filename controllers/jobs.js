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
  //console.log(_id)
  console.log(_id)

  console.log('this is the data we got ',req.body)
  
  const JobExists = await Jobs.findById(_id)
  if (JobExists) {
    console.log('it exists ')
    JobExists.jobTitle = req.body.jobTitle || JobExists.jobTitle
    JobExists.jobDescription = req.body.jobDescription || JobExists.jobDescription
    JobExists.Employers_contact = req.body.Employers_contact || JobExists.Employers_contact
    JobExists.DeadlineDate = req.body.DeadlineDate || JobExists.DeadlineDate
    JobExists.Category = req.body.Category || JobExists.Category
    JobExists.EMPLOYER_EMAIL = req.body.EMPLOYER_EMAIL || JobExists.EMPLOYER_EMAIL
    JobExists.Employers_Name = req.body.Employers_Name || JobExists.Employers_Name
    const updatedJob = await JobExists.save()
    //console.log(updatedJob)
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
const ExcelToMongoDB = asyncHandler(async (req, res) => {
  console.log("bub")
console.log(req.body)
  // looping through the json data to save in jobs collection
  for (var i = 0; i < req.body.length; i++) {
    var data= req.body[i];
    //console.log(data);
    console.log(data)
  
    let start_date = data.Start_Date
    var numDate= new Date(start_date).toISOString().slice(0, 10);
    console.log(numDate)
    let APPLICATIONS_DEADLINE_DATE = data.APPLICATIONS_DEADLINE_DATE
    var deadlineDate= new Date(APPLICATIONS_DEADLINE_DATE).toISOString().slice(0, 10);
    console.log(deadlineDate) 
    const Employers_Name = data.Employers_Name
    const EMPLOYER_EMAIL = data.EMPLOYERS_EMAIL
    const Employers_contact = data.Employers_Contact
    const jobTitle = data.Job_Post_Title
    const jobDescription = data.Job_Description
    const Category = data.Job_category
    console.log(jobTitle)

    if (!jobTitle, !jobDescription, !Employers_contact, !deadlineDate, !Category, !EMPLOYER_EMAIL, !Employers_Name) {
      res.status(400)
      throw new Error('Please add a text field')
    }
    else{
    const job = await Jobs.create({
      jobTitle,
      jobDescription,
      Employers_contact,
      DeadlineDate:deadlineDate,
      Category,
      EMPLOYER_EMAIL,
      Employers_Name,
      Start_Date:numDate
    })
    res.status(200).json(job)
  }
  
  }



// get data from a file 
  /*
  const {user,jobTitle,jobDescription,Employers_contact,DeadlineDate,Category,EMPLOYER_EMAIL,Employers_Name} = req.body;
  if (!jobTitle, !jobDescription, !Employers_contact, !DeadlineDate, !Category, !EMPLOYER_EMAIL, !Employers_Name) {
    res.status(400)
    throw new Error('Please add a text field')
  }
  else if (jobTitle, jobDescription, Employers_contact, DeadlineDate, Category, EMPLOYER_EMAIL, Employers_Name) {
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
  }
  else{
    res.status(400)
    throw new Error('Please add a text field')
  }
}
*/})
export {setJob, getJobs,getOneJob,updateJob,deleteJob,ExcelToMongoDB};


