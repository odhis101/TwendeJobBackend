import mongoose from "mongoose";

const postedSkills = mongoose.Schema({
    Names: {
        type: String,
        required: [true, 'Please enter the Names'],
    },
    skillDescription: {
        type: String,
        required: [true, 'Please enter the job description'],
    },
    Location: {
        type: String,
        required: [true, 'Please enter the Location'],
    },
    phoneNumber: {
        type: Date,
        required: [false, 'Please enter the phoneNumber'],
    },  
    Email: {
        type: String,
        required: [true, 'Please enter the Email'],
    },

})

var Skills = mongoose.model('postedSkills', postedSkills)
export default Skills;