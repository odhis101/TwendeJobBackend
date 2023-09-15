import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js" 
import Jobs from '../models/JobsModel.js';
import JobsOfTheDay from '../models/JobsofTheDay.js';
import moment from 'moment';
import XLSX  from 'xlsx';

const getJobsOfTheDay = asyncHandler(async (req, res) => {
  const JobExists = await JobsOfTheDay.find({})
  res.status(200).json(JobExists)
})
const setJobsOfTheDay = asyncHandler(async (req, res) => {
  const { jobTitle, jobDescription, Employers_contact, DeadlineDate, Category, EMPLOYER_EMAIL, Employers_Name, Location,Requirment,Salary } = req.body;
  console.log('this is the data we got ', req.body)
  if (!jobTitle || !jobDescription || !Employers_contact || !Category || !EMPLOYER_EMAIL || !Employers_Name) {
    res.status(400)
    throw new Error('Please add a text field')
  }
  
  console.log(Requirment)
  // Assuming you have an existing job instance, you can update it like this:
  const existingJob = await JobsOfTheDay.findOneAndUpdate(
    { /* Find the existing job based on your criteria */ },
    {
      jobTitle,
      jobDescription,
      Employers_contact,
      DeadlineDate,
      Category,
      EMPLOYER_EMAIL,
      Location,
      Employers_Name,
      Requirment,
      Salary
    },
    { new: true } // This option returns the updated job instance
  );

  if (!existingJob) {
    res.status(404)
    throw new Error('Job not found')
  }
console.log(existingJob)
  res.status(200).json(existingJob);
});





const getJobs = asyncHandler(async (req, res) => {
    const JobExists = await Jobs.find({})
  
    res.status(200).json(JobExists)
  })

const setJob = asyncHandler(async (req, res) => {
  const {user,jobTitle,jobDescription,Employers_contact,DeadlineDate,Category,EMPLOYER_EMAIL,Employers_Name,Location} = req.body;
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
    Location,
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
    console.log('job removed')
    await JobExists.remove()
    res.json({message: 'Job removed'})
  } else {np
    res.status(404)
    console.log('Job not found')
    throw new Error('Job not found')
  }
})
const ExcelToMongoDB = asyncHandler(async (req, res) => {
  console.log("bubssss")
  const savedJobs = []; // Array to store the saved jobs

//console.log(req.body)
  // looping through the json data to save in jobs collection
  for (var i = 0; i < req.body.length; i++) {
    var data= req.body[i];
    //console.log(data);
    //console.log(data)
  
    let start_date = data.Start_Date
    start_date=new Date((start_date - 1) * 24 * 60 * 60 * 1000 + new Date('1900-01-01').getTime());
   //console.log('this is start date',start_date)
   //start_date = moment('1900-01-01').add(start_date - 1, 'days').toDate();


    //var numDate= new Date(start_date).toISOString().slice(0, 10);
    //console.log('this is numdate ',numDate)
    let APPLICATIONS_DEADLINE_DATE = data.APPLICATIONS_DEADLINE_DATE;
    APPLICATIONS_DEADLINE_DATE=new Date((APPLICATIONS_DEADLINE_DATE - 1) * 24 * 60 * 60 * 1000 + new Date('1900-01-01').getTime());

    
    //var deadlineDate= new Date(APPLICATIONS_DEADLINE_DATE).toISOString().slice(0, 10);
    //console.log('this is deadline date',deadlineDate) 
    const Employers_Name = data.Employers_Name
    const EMPLOYER_EMAIL = data.EMPLOYERS_EMAIL
    const Employers_contact = data.Employers_Contact
    const jobTitle = data.Job_Post_Title
    const jobDescription = data.Job_Description
    const Category = data.Job_category
    const Location = data.Location
    console.log('this is deadline date ',APPLICATIONS_DEADLINE_DATE)
    console.log('this is start date ',start_date)



    const job = await Jobs.create({
      jobTitle,
      jobDescription,
      Employers_contact,
      DeadlineDate:APPLICATIONS_DEADLINE_DATE,
      Category,
      EMPLOYER_EMAIL,
      Employers_Name,
      Start_Date:start_date,
      Location

    })

 
    //savedJobs.push(job); // Add the saved job to the array

  }
 res.status(200).json(savedJobs); // Send the response with all saved jobs
  
})
export {setJob, getJobs,getOneJob,updateJob,deleteJob,ExcelToMongoDB,getJobsOfTheDay,setJobsOfTheDay};


