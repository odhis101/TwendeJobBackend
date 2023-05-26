import { json } from 'express';
import request from 'request';
import Subscribers from '../models/darajaModels.js';
import asyncHandler from 'express-async-handler';
import Jobs from '../models/JobsModel.js';
import https from 'follow-redirects';
import fs from 'fs';
import cron from 'node-cron';
import twilio from 'twilio';
import SmsText from '../models/smsModel.js';
import User from "../models/userModels.js"
import Admin from "../models/adminModels.js"
import dotenv from 'dotenv';

const PATA_SMS_URL ="https://api.patasms.com/send_one"
const PATA_SMS_USERNAME = 'twende.jobs'
const PATA_SMS_PASSWORD = 'P@ssw0rd'



      
     
//const jwt = require('jsonwebtoken');

const getsms = asyncHandler(async (req, res) => {
    //const JobExists = await Jobs.find({})
 
    console.log('hit the route')
    console.log(req.body);
    console.log(req.body);
    let sender = req.body.msisdn
    let shortcode = req.body.shortcode
    let linkId = req.body.linkId
    let recMessage = req.body.message
    

   
    // i want to update i after every cron schedule 

    let url = PATA_SMS_URL;
    let username = PATA_SMS_USERNAME
    let password = PATA_SMS_PASSWORD
    let auth =  "Basic " + new Buffer.from(username + ":" + password).toString("base64");
    const subscribers =await Subscribers.find({});
    const jobs = await Jobs.find({});
    // create an array of jobs 
    let jobsTitle = [];
    console.log('testing');
    jobs.forEach((job) => {
      jobsTitle.push(job.jobTitle);
    });
    let jobDescription = [];
    jobs.forEach((job) => {
      jobDescription.push(job.jobDescription);
    });
    console.log(jobsTitle);
    //console.log(subscribers);
    let numbersArray = [];
    const currentDate = new Date().toISOString().slice(0, 10)
    subscribers.forEach((subscriber) => {
      //numbersArray.push(subscriber.phoneNumber);
 
      if (subscriber.expiry > currentDate) {
        //these are the ones that are not expired 
        numbersArray.push(subscriber.phoneNumber);
      } else {
        // this is the expired ones 
        //numbersArray.push(subscriber.phoneNumber);
        
      }
    });
    
    const numbers = [...new Set(numbersArray)]
    console.log(numbers);
    res.send(JSON.stringify(numbers))
    const i = Math.floor(Math.random() * jobsTitle.length);
    // checking for 254 in the sender number
   
    let checker = sender;
    
    console.log('this is sender ',sender)
    console.log('type of sender', typeof sender)
    if (sender.toString().startsWith('254')) {
      checker = sender.toString().replace('254', '0');
      console.log('this is checker ', checker);
    }
    // replacing all phone numbers in numbers to start with 254
    let numbers0 = numbers.map((number) => {
        if (number.startsWith('254')) {
            return number.replace('254', '0');
        } else {
            return number;
        }
    }
    )
    console.log('numbers that start with ',numbers0);

    let message = ''
    if (!numbers0.includes(checker)) {
      // sender is not in the numbers array
      console.log('sender is not in the numbers array');
      message = `Please subscribe to our service to get the latest jobs:\n\n`;
      message += `1. Send 1 for daily SMS @ 10 Ksh\n`;
      message += `2. Send 2 for weekly SMS @ 49 Ksh\n`;
      message += `3. Send 3 for monthly SMS @ 199 Ksh`;
    
      // Rest of your code to send the message
    }  
      else {
          message = `Hello From Twende Job, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]}`;
        // sender is in the numbers array
      }
     console.log(message);
      if (recMessage.toLowerCase().replace(/\s/g, '') === 'jobs') {
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
          "sender": 23551,
          "recipient": sender,
          "link_id": linkId,
          'bulk':0,
          "message": message,
        },
      },
       
       function (error, response, body) {
          if (error) {
              console.log(error);
            
          } else {

            const sms = new SmsText({
                phoneNumber: sender,
                messageText: message,
                })
            sms.save()
            console.log(sms);
            console.log(body);
            
            
          }
       }
      )
      }
      else if (recMessage.toLowerCase().replace(/\s/g, '') === '1' || recMessage.toLowerCase().replace(/\s/g, '') === '2' || recMessage.toLowerCase().replace(/\s/g, '') === '3') {
        let subscriptionMessage;
        if (recMessage === '1') {
          subscriptionMessage = "You have subscribed to daily SMS at 10 Ksh.";
        } else if (recMessage === '2') {
          subscriptionMessage = "You have subscribed to weekly SMS at 49 Ksh.";
        } else if (recMessage === '3') {
          subscriptionMessage = "You have subscribed to monthly SMS at 199 Ksh.";
        }
      
        request({
          method: "POST",
          url: url,
          path: '/send',
          'maxRedirects': 20,
          headers: {
            "Authorization": auth,
            "Content-Type": "application/json",
            'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn',
          },
          json: {
            "sender": 23551,
            "recipient": sender,
            "link_id": linkId,
            'bulk': 0,
            "message": subscriptionMessage,
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            const sms = new SmsText({
              phoneNumber: sender,
              messageText: subscriptionMessage,
            })
            sms.save()
            console.log(sms);
            console.log(body);
          }
        });
      }
      
      else{
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
            "sender": 23551,
            "recipient": sender,
            "link_id": linkId,
            'bulk':0,
            "message": '  Please write "jobs" if you want to get the latest jobs',
          },
    
        },
         
         function (error, response, body) {
            if (error) {
                console.log(error);
              
            } else {       
              console.log(sms);
              console.log(body);
              
              
            }
         }
        )

      }
      
  
      
  
     console.log(jobsTitle[i])

    
   // print jobtitle[i] and jobdescription[i]

  })
  const call_back = asyncHandler(async (req, res) => {
    res.status(200).json(req.body)
    console.log(req.body);
  })
  // get all sms from the database
    const getallsms = asyncHandler(async (req, res) => {
        const sms = await SmsText.find({});
        res.status(200).json(sms);
    })
    const sendOtp = asyncHandler(async (req, res) => {
      console.log('hit the sendOtp route');
      console.log(req.body);
      let url = PATA_SMS_URL;
      let username = PATA_SMS_USERNAME
      let Password = PATA_SMS_PASSWORD
      let auth =  "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
    
      let { phoneNumber } = req.body;
      if(phoneNumber.startsWith('0')  ){
        phoneNumber = phoneNumber.replace('0', '254');    
    }
    
    const userExists = await User.findOne({ phoneNumber})
    if(!userExists){
      console.log(userExists)
      console.log(phoneNumber)
      res.status(400)
      throw new Error('User does not exist')
    }
      const otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit code
      const message = `Your verification code is ${otp}`; // create the message body
      console.log(message);
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
        
        // Save the OTP in the database
        
        const user = await User.findOneAndUpdate({ phoneNumber }, { otpCode:otp}, { new: true, upsert: true });
        console.log(user);
        if(user){
          res.status(200).json({ message: 'OTP sent successfully' });

        }
        else{
          res.status(400).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending OTP' });
      }
    });
    
const sendOtpAdmin = asyncHandler(async (req, res) => {
  console.log('hit the admin route');
  console.log(req.body);
  let url = PATA_SMS_URL;
  let username = PATA_SMS_USERNAME
  let Password = PATA_SMS_PASSWORD
  let auth =  "Basic " + new Buffer.from(username + ":" + Password).toString("base64");

  let { phoneNumber } = req.body;
  if(phoneNumber.startsWith('0')  ){
    phoneNumber = phoneNumber.replace('0', '254');    
}
console.log(phoneNumber);
const userExists = await Admin.findOne({ phoneNumber})
if(!userExists){
  res.status(400)
  throw new Error('User does not exist')
}
  const otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit code
  const message = `Your verification code is ${otp}`; // create the message body
  console.log(message);
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
    
    // Save the OTP in the database
    
    const user = await Admin.findOneAndUpdate({ phoneNumber }, { otpCode:otp}, { new: true, upsert: true });
    console.log(user);
    if(user){
      res.status(200).json({ message: 'OTP sent successfully' });

    }
    else{
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while sending OTP' });
  }
});


    const verifyOTP = asyncHandler(async (req, res) => {
      let { phoneNumber, otp } = req.body;
      if(phoneNumber.startsWith('0')  ){
        phoneNumber = phoneNumber.replace('0', '254');    
    }
    console.log(phoneNumber, otp);
    
      try {
        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });
        //console.log(user);
    
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
    console.log('here is the stored otp',user.otpCode , 'here is the otp sent',otp) 
    console.log(typeof user.otpCode, typeof otp)
   

        // Check if the OTP matches
        if (user.otpCode === otp) {
          console.log('otp matches');
          // Clear the OTP from the user document
          //user.otp = undefined;
          //await user.select('-phone -password').save();
          console.log('success')
          return res.status(200).json({ message: 'OTP verification successful' });
        } else {
          return res.status(400).json({ message: 'Invalid OTP' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while verifying OTP' });
      }
    });
  export {sendOtpAdmin,getsms,call_back,getallsms,sendOtp,verifyOTP};


