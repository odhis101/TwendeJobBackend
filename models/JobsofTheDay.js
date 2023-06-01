import mongoose from "mongoose";

const postedJobsOfTheDay = mongoose.Schema({
  
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
    Location:{
        type: String,
        required: [true, 'Please enter the Location'], 
    },
    Requirment:{
        type: String,
    },
    Salary:{
        type:String,
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString().slice(0, 10)
    },
})

var JobsOfTheDay = mongoose.model('postedJobsOfTheDay', postedJobsOfTheDay)
export default JobsOfTheDay;


