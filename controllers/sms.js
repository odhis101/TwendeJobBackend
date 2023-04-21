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


const getsms = asyncHandler(async (req, res) => {
    //const JobExists = await Jobs.find({})
 
    console.log('hit the route')
    console.log(req.body);
    console.log(req.body);
    let sender = req.body.msisdn
    let shortcode = req.body.shortcode
    let linkId = req.body.linkId
    

   
    // i want to update i after every cron schedule 

    let url = "https://api.patasms.com/send_one";
    let username = 'twende.jobs'
    let password = 'P@ssw0rd'
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
        message = `please subscribe to our service to get the latest jobs, go twendejobs.com to create your subscription`;
      } else {
          message = `Hello From Twende Job, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]}`;
        // sender is in the numbers array
      }
     

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
    
      const { phoneNumber } = req.body;
    
      try {
        const otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit code
        const message = `Your verification code is ${otp}`; // create the message body
    
        await client.messages.create({
          body: message,
          from: 'your_twilio_number',
          to: phoneNumber
        });
    
        // Save the OTP in the database
        const user = await User.findOneAndUpdate({ phoneNumber }, { otp }, { new: true, upsert: true });
        console.log(user);
        res.status(200).json({ message: 'OTP sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending OTP' });
      }
    });
    

    const verifyOTP = asyncHandler(async (req, res) => {
      const { phoneNumber, otp } = req.body;
    
      try {
        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });
    
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
    
        // Check if the OTP matches
        if (otp === user.otp) {
          // Clear the OTP from the user document
          user.otp = undefined;
          await user.save();
    
          return res.status(200).json({ message: 'OTP verification successful' });
        } else {
          return res.status(400).json({ message: 'Invalid OTP' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while verifying OTP' });
      }
    });
  export {getsms,call_back,getallsms,sendOtp,verifyOTP};


  // counter function to track the number of requests

 /* 
  const sendsms = asyncHandler(async (req, res) => {
    let i = 0;
   
    // i want to update i after every cron schedule 

    let url = "https://api.patasms.com/send_one";
    let username = 'twende.jobs'
    let password = 'P@ssw0rd'
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
    //console.log(subscribers);
    let numbersArray = [];
    const currentDate = new Date().toISOString().slice(0, 10)
    subscribers.forEach((subscriber) => {
      //numbersArray.push(subscriber.phoneNumber);
 
      if (subscriber.expiry > currentDate) {
        // numbersArray.push(subscriber.phoneNumber);
      } else {
        // this is the expired ones 
        numbersArray.push(subscriber.phoneNumber);
        
      }
    });
    
    const numbers = [...new Set(numbersArray)]
    console.log(numbers);
    numbers.forEach((number) => {
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
        "sender": 23552,
        "recipient": number,
        "link_id": "812389123",
        'bulk':0,
        "message": `Hello, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]}`,
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
    })

    
   i++ 
   console.log(jobsTitle[i])

  });

*/
//console.log(`The time i s ${hours}:${minutes}`);

/*twilio version */ 
/* 30 1 * * * */ 
/*
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
cron.schedule('* 30 1 * * * *',  asyncHandler(async (req, res) => {  const subscribers =await Subscribers.find({});
 console.log('its 8 am')   
const jobs = await Jobs.find({});
    // create an array of jobs 
    let jobsTitle = [];
    jobs.forEach((job) => {
      jobsTitle.push(job.jobTitle);
    });
    let jobDescription = [];
    jobs.forEach((job) => {
      jobDescription.push(job.jobDescription);
    });
    console.log(jobsTitle,jobDescription);
    let numbersArray = [];
    const currentDate = new Date().toISOString().slice(0, 10)
    subscribers.forEach((subscriber) => {
      //numbersArray.push(subscriber.phoneNumber);
 
      if (subscriber.expiry > currentDate) {
        // numbersArray.push(subscriber.phoneNumber);
      } else {
        // this is the expired ones 
        if(subscriber.phoneNumber.startsWith('0')  ){
          subscriber.phoneNumber = subscriber.phoneNumber.replace('0', '254');
          
      }
        numbersArray.push(subscriber.phoneNumber);
        
      }
    });
    const countryCode = '+254'; // Replace with your country code
    const numbers = [...new Set(numbersArray)]
    

    console.log(numbers);
    const accountSid = 'AC8c9b65406300a5fb2456e225ed765b11';
    const authToken = '396516a55b393caab2bd3f0827ac1998';
    const client = twilio(accountSid, authToken);

    numbers.forEach((number) => {
     
client.messages
  .create({
    body: `Hello, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]}`,
    from: '+15076154216',
    to: `+${number}`
  })
  .then(message => console.log(`Message sent: ${message.sid}`))
  .catch(error => console.error(error));

    
  })
  i++

}))

*/
