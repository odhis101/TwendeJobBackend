import mongoose from "mongoose";

const postedJobs = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
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
        type: String,
        required: [false, 'Please enter the DeadlineDate'],
    },  
    Category: {
        type: String,
        required: [true, 'Please enter the Category'],
    },
    Location: {
        type: String,
        required: [true, 'Please enter the Location'],
    },
})

var Jobs = mongoose.model('PostedJobs', postedJobs)
export default Jobs;


