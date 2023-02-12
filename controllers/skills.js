import skillModel from '../models/skillModel.js';
import mongoose from 'mongoose';
import express from 'express';
import asyncHandler from 'express-async-handler';



const getSkills = asyncHandler(async (req, res) => {
    const SkillExists = await skillModel.find({})

    res.status(200).json(SkillExists)
})
const postSkill = asyncHandler(async (req, res) => {
    const {Names,skillName,skillDescription,skillCategory,skillLevel,Location,Email,phoneNumber} = req.body;
    if (!skillName, !skillDescription, !skillCategory, !skillLevel, !Location, !Email,!Names) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    else{
        const skill = await skillModel.create({
            Names,
            skillName,
            skillDescription,
            phoneNumber,
            Location,
            skillLevel,
            Email
        })
        res.status(200).json(skill)
    }
})
const deleteSkill = asyncHandler(async (req, res) => {
    const {id: _id} = req.params;
    // delete the skill
    const skill = await skillModel.findByIdAndDelete(_id)
    if (skill) {
        res.status(200).json({message: 'skill deleted'})
    }
    else {
        res.status(404).json({message: 'skill not found'})
    }

})
const updateSkill = asyncHandler(async (req, res) => {
    const {id: _id} = req.params;
    //console.log(_id)
    console.log(_id)
    //delete with id 
})

export { getSkills, postSkill, deleteSkill}