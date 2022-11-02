import mongoose from "mongoose";

const postedJobs = mongoose.Schema({
    user: {
        type: String,
        required: [true, 'Please Username'],
    },
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
    }
})

var Jobs = mongoose.model('PostedJobs', postedJobs)
export default Jobs;


