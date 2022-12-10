import mongoose from "mongoose";

const postedJobs = mongoose.Schema({
  
    jobTitle: {
        type: String,
        required: [true, 'Please enter the job title'],
    },
    jobDescription: {
        type: String,
        required: [true, 'Please enter the job description'],
    },
    Employers_contact: {
        type: String,
        required: [true, 'Please enter the Employers contact'],
    },
    DeadlineDate: {
        type: Date,
        required: [false, 'Please enter the DeadlineDate'],
    },  
    Category: {
        type: String,
        required: [true, 'Please enter the Category'],
    },
    EMPLOYER_EMAIL: {
        type: String,
        required: [true, 'Please enter the EMPLOYER EMAIL'],
    },
    
    Employers_Name:{
        type: String,
        required: [true, 'Please enter the Employers Name'], 
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString().slice(0, 10)
    },
})

var Jobs = mongoose.model('PostedJobs', postedJobs)
export default Jobs;


