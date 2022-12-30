import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js"
//const jwt = require('jsonwebtoken');
const registerUser = asyncHandler(async (req, res) => {
    const { name, phoneNumber, password } = req.body;
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
        res.status(400);

    }
    else{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        phoneNumber,
        password: hashedPassword,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}
})
  
const loginUser = asyncHandler(async(req , res) => {
   const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid phone number or password');
    }
    // generateToken(JWT);
   
})
const Getme = asyncHandler( async (req , res) => {
    const {_id,phoneNumber} =await User.find;
    console.log(_id,phoneNumber);
    res.status(200).json({
        _id: _id,
        phoneNumber
        
})

})
const getUsers = asyncHandler( async (req , res) => {
const userExists = await User.find({})
  
res.status(200).json(userExists)
})

 const generateToken = (id) => {
    
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

export {registerUser,loginUser,Getme,getUsers};