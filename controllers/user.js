import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js"
const registerUser = asyncHandler(async (req, res) => {
    const { name, phoneNumber, password } = req.body;
    const userExists = await User.findOne({ phoneNumber });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        phoneNumber,
        password,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            password: user.password,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})
  
const loginUser = asyncHandler(async(req , res) => {
    res.json({message : 'User Login'});
})
const Getme = asyncHandler( async (req , res) => {
    res.json({message : 'User data'});
})

export {registerUser,loginUser,Getme};