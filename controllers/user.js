import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from "../models/userModels.js"
import Admin from "../models/adminModels.js"
import twilio from 'twilio';
import request from 'request';
import dotenv from 'dotenv';

dotenv.config();

const PATA_SMS_URL ="https://api.patasms.com/send_one"
const PATA_SMS_USERNAME = 'twende.jobs'
const PATA_SMS_PASSWORD = 'P@ssw0rd'
//const jwt = require('jsonwebtoken');
const sendOtpForNewUser = asyncHandler(async (req, res) => {
    let {phoneNumber, password } = req.body;
    console.log(req.body)
    let url = PATA_SMS_URL;
    let username = PATA_SMS_USERNAME
    let Password = PATA_SMS_PASSWORD
    let auth =  "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
    console.log('testing here ')
      console.log(PATA_SMS_URL)
    // if number start with 0 to 254
    console.log(typeof phoneNumber)
    if(phoneNumber.startsWith('0')  ){
      phoneNumber = phoneNumber.replace('0', '254');    
  }
  
    // Check if user already exists with the given phone number
    const userExists = await User.findOne({ phoneNumber });
   
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
  
    // Generate OTP and message body
    const otp = Math.floor(100000 + Math.random() * 900000);
    const message = `Your verification code is ${otp}`;
    console.log(otp)
  
    // Store user credentials and OTP in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      phoneNumber,
      password: hashedPassword,
      otpCode:otp,
    });
    
   //console.log(user)

  
    // Send OTP to the user
    
    try {
      request(  {
        method: "POST",
        url: url,
        path: '/send',
        'maxRedirects': 20,
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json",
          'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn',
        },
        json:{
          "sender": 'Titan',
          "recipient": phoneNumber,
          "link_id": '',
          'bulk':1,
          "message": message,
        },
  
      },
       
       function (error, response, body) {
          if (error) {
              console.log(error);
            
          } else {
            console.log(body);
            
            
          }
       }
      )
      
      const response = {
        message: "OTP sent successfully",
        data: { phoneNumber, hashedPassword, otp },
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      console.log(error)
      res.status(500).json({ message: "An error occurred while sending OTP" });
    }
  });

  const sendOtpForNewAdmin= asyncHandler(async (req, res) => {
    let {phoneNumber} = req.body;
    console.log(req.body)
    let url = PATA_SMS_URL;
    let username = PATA_SMS_USERNAME
    let Password = PATA_SMS_PASSWORD
    let auth =  "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
    // if number start with 0 to 254
    console.log(typeof phoneNumber)
    if(phoneNumber.startsWith('0')  ){
        phoneNumber = phoneNumber.replace('0', '254');    
    }
    console.log(phoneNumber)
    // Check if user already exists with the given phone number
    const userExists = await Admin.findOne({ phoneNumber });
   
    if (userExists) {
      res.status(400).json({ message: ' user registered' });
      return;
    }
  
    // Generate OTP and message body
    const otp = Math.floor(100000 + Math.random() * 900000);
    const message = `Your verification code is ${otp}`;
    console.log(otp)
  
    // Store user credentials and OTP in the database
    
    const user = await Admin.create({
      phoneNumber,
      password,
      otpCode:otp,
    });
    console.log(user)

  
    // Send OTP to the user
    
    try {
      /*
      request(  {
        method: "POST",
        url: url,
        path: '/send',
        'maxRedirects': 20,
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json",
          'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn',
        },
        json:{
          "sender": 'Titan',
          "recipient": phoneNumber,
          "link_id": '',
          'bulk':1,
          "message": message,
        },
  
      },
       
       function (error, response, body) {
          if (error) {
              console.log(error);
            
          } else {
            console.log(body);
            
            
          }
       }
      )
      */
     console.log('sending otp')
    
      const response = {
        message: "OTP sent successfully",
        data: { phoneNumber, hashedPassword, otp },
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      console.log(error)
      res.status(500).json({ message: "An error occurred while sending OTP" });
    }
  });
  
  const verifyOtpForNewUser = asyncHandler(async (req, res) => {
    console.log('we are in verifyOtpForNewUser')
    
    let { phoneNumber, otp } = req.body;
    if(phoneNumber.startsWith('0')  ){
      phoneNumber = phoneNumber.replace('0', '254');    
  }
  
  
    // Find user by phone number and OTP
    const user = await User.findOne({ phoneNumber, otpCode: otp});
  
    if (!user) {
      // User not found or OTP doesn't match, return error
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }
  
    // Check if user has logged in yet
    if (!user.isOtpVerified) {
      // If user hasn't logged in, delete user after 15 seconds
      const timeoutId = setTimeout(() => {
        User.deleteOne({ _id: user._id }).then(() => {
          console.log(`Deleted user ${user._id}`);
        });
      },  15 * 1000); // 15 seconds in milliseconds
  
      // Mark user as logged in
      user.isOtpVerified = true;
      await user.save();
      console.log(user);
  
      // Cancel the scheduled timeout
      clearTimeout(timeoutId);
    }
  
    // Return success message
    res.status(200).json({ message: 'OTP verification successful' });
  });

  const verifyOtpForNewAdmin = asyncHandler(async (req, res) => {
    console.log('we are in verifyOtpForNewAdmin')
    console.log(req.body)
    
    let { phoneNumber, otp } = req.body;
    if(phoneNumber.startsWith('0')  ){
        phoneNumber = phoneNumber.replace('0', '254');    
    }
    console.log(phoneNumber)
  
    // Find user by phone number and OTP
    const user = await Admin.findOne({ phoneNumber, otpCode: otp});
    console.log(user)
  
    if (!user) {
      // User not found or OTP doesn't match, return error
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }
  
    // Check if user has logged in yet
    if (!user.isOtpVerified) {
      // If user hasn't logged in, delete user after 15 seconds
      const timeoutId = setTimeout(() => {
        User.deleteOne({ _id: user._id }).then(() => {
          console.log(`Deleted user ${user._id}`);
        });
      },  15 * 1000); // 15 seconds in milliseconds
  
      // Mark user as logged in
      user.isOtpVerified = true;
      await user.save();
      console.log(user);
  
      // Cancel the scheduled timeout
      clearTimeout(timeoutId);
    }
  
    // Return success message
    res.status(200).json({ message: 'OTP verification successful' });
  });


  
  
// create admin register
const registerAdmin = asyncHandler(async (req, res) => {
    let {  phoneNumber, password } = req.body;
    console.log(req.body)
    if(phoneNumber.startsWith('0')  ){
      phoneNumber = phoneNumber.replace('0', '254');    
  }
    
    const userExists = await Admin.findOne({ phoneNumber });
    if (userExists) {
        res.status(400);

    }
    else{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)
    const user = await Admin.create({
        phoneNumber,
        password: hashedPassword,
    });
    console.log(user)
    if (user) {
        res.status(201).json({
            _id: user._id,
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
   let { phoneNumber, password } = req.body;
   if(phoneNumber.startsWith('0')  ){
    phoneNumber = phoneNumber.replace('0', '254');    
}


  
    const user = await User.findOne({ phoneNumber });
    if (user && (await bcrypt.compare(password, user.password)) && user.isOtpVerified) {
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
const loginAdmin = asyncHandler(async(req , res) => {
    let { phoneNumber, password } = req.body;
    if(phoneNumber.startsWith('0')  ){
      phoneNumber = phoneNumber.replace('0', '254');    
  }
     const user = await Admin.findOne({ phoneNumber });
      // here its not user but admin 
      console.log(phoneNumber,password);
      console.log(user);
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
 // crreate a signupAdmin function

 const updatePassword = asyncHandler(async (req, res) => {
    let { phoneNumber, newPassword } = req.body;
    if(phoneNumber.startsWith('0')  ){
      phoneNumber = phoneNumber.replace('0', '254');    
  }
    console.log(req.body)
  
    const user = await User.findOne({ phoneNumber });
    console.log(user)
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      user.isOtpVerified = true;
      await user.save();
      console.log(user)
      
  
      res.json({
        message: 'Password updated successfully',
      });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  });
  const updatePasswordAdmin = asyncHandler(async (req, res) => {
    let { phoneNumber, newPassword } = req.body;
    if(phoneNumber.startsWith('0')  ){
      phoneNumber = phoneNumber.replace('0', '254');    
  }
    console.log(req.body)
  
    const user = await Admin.findOne({ phoneNumber });
    console.log(user)
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      user.isOtpVerified = true;
      await user.save();
      console.log(user)
      
  
      res.json({
        message: 'Password updated successfully',
      });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  });
  


const Getme = asyncHandler( async (req , res) => {
    const {_id,phoneNumber} =await User.find;
    console.log(_id,phoneNumber);
    res.status(200).json({
        _id: _id,
        phoneNumber
        
})

})
const updateNumber = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { phoneNumber } = req.body;
  if(phoneNumber.startsWith('0')  ){
    phoneNumber = phoneNumber.replace('0', '254');    
}

  const number = await User.findById(id);
  console.log(number)
  if (number) {
    number.phoneNumber = phoneNumber;
    const updatedNumber = await number.save();
    res.json(updatedNumber);
  } else {
    res.status(404);
    throw new Error('Phone number not found');
  }
});
const deleteNumber = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedNumber = await User.findByIdAndDelete(id);
  if (!deletedNumber) {
    res.status(404);
    throw new Error(`Phone number with id ${id} not found`);
  }
  res.json({ message: `Phone number ${deletedNumber.number} deleted successfully` });
});
  

const getUsers = asyncHandler( async (req , res) => {
const userExists = await User.find({})
  
res.status(200).json(userExists)
})

 const generateToken = (id) => {
    
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

export {deleteNumber,updateNumber,updatePasswordAdmin,verifyOtpForNewAdmin,sendOtpForNewAdmin,sendOtpForNewUser,verifyOtpForNewUser,loginUser,Getme,getUsers,loginAdmin,registerAdmin,updatePassword};

