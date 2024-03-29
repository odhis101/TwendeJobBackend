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
import axios from 'axios';

const PATA_SMS_URL =process.env.PATA_SMS_URL
const PATA_SMS_USERNAME = 'twende.jobs'
const PATA_SMS_PASSWORD = 'P@ssw0rd'
dotenv.config();

console.log('here is some enve stuff ',process.env.PATA_SMS_URL);

      
     
//const jwt = require('jsonwebtoken');
const consumer_key = 'R2kA2Avi3cOFAdkdvR7zVgOZjKibRCOm';
const consumer_secret  = 'h2gwMdxszxc2tJ35'; 
const cronSchedule = '0 9 * * *';
//const cronSchedule = '*/10 * * * * *'; // Run every 10 seconds


cron.schedule(cronSchedule, async () => {
  //const JobExists = await Jobs.find({})

  console.log('trying to send dayly sms'); 
  // i want to update i after every cron schedule 

  let url = PATA_SMS_URL;
  let username = process.env.PATA_SMS_USERNAME
  let password = process.env.PATA_SMS_PASSWORD
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
  let Employers_contact= []
  jobs.forEach((job) => {
    Employers_contact.push(job.Employers_contact);
   })
  //console.log(jobsTitle);
  //console.log(subscribers);
  let NumbersArray = [];
  const currentDate = new Date().toISOString().slice(0, 10)
  const number = Math.floor(Math.random() * jobsTitle.length);
 let message = `Daily Message From Twende Job , we have new jobs for you. ${jobsTitle[number]} ${jobDescription[number]} contact ${Employers_contact[number]} for more information`
 //console.log(message );
  subscribers.forEach((subscriber) => {
    //numbersArray.push(subscriber.phoneNumber);

    if (subscriber.expiry > currentDate) {
      //these are the ones that are not expired 
      NumbersArray.push(subscriber.phoneNumber);
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
            "sender": "TWENDEJOBS",
            "recipient": subscriber.phoneNumber,
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
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending Daily jobs' });
      }
     



    }
    else{
      console.log('they are no subscribers')
    }

  });


  
  

  });



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
    // get jobID so that we can dynamically link 
    let jobID = [];
    jobs.forEach((job) => {
      jobID.push(job._id);
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
    
    const getaccess_token = () => {
      return new Promise((resolve, reject) => {
        let url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        let auth = "Basic " + new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
        request(
          {
            url: url,
            headers: {
              "Authorization": auth
            }
          },
          function (error, response, body) {
            if (error) {
              console.log('here is the error ', error);
              reject(error);
            } else {
              const access_token = JSON.parse(body).access_token;
              resolve(access_token);
            }
          }
        );
      });
    };
    
const generateTimestamp = () => {
  const date = new Date()
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + (date.getDate() + 1)).slice(-2) +
    ("0" + (date.getHours() + 1)).slice(-2) +
    ("0" + (date.getMinutes() + 1)).slice(-2) +
    ("0" + (date.getSeconds() + 1)).slice(-2)
  return timestamp
}
const makeSTKPushRequest = async (number, amount,linkId) => {
  try {
    let url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    // Get the access token using your preferred method
    let access_token = await getaccess_token(); // Replace with your access token retrieval code
    console.log(access_token)
    

    let auth = "Bearer " + access_token;
    console.log(auth)

    let passkey = '3e05a5eb019d9bc8cb1eb2045e0bff9e6b46279ca5e57d87356ae07bc6308d70';
    const timestamp = generateTimestamp();
    const Passwords = Buffer.from("494977" + passkey + timestamp).toString('base64');
    console.log(Passwords)
    console.log(timestamp);
    console.log(typeof(timestamp));

    request(
      {
        url: url,
        method: "POST",
        headers: {
          "Authorization": auth
        },
        json: {
          "BusinessShortCode": "494977",
          "Password": Passwords,
          "Timestamp": timestamp,
          "TransactionType": "CustomerPayBillOnline",
          "Amount": amount,
          "PartyA": number,
          "PartyB": "494977",
          "PhoneNumber": number,
          "CallBackURL": `https://twendejob-backend.oa.r.appspot.com/daraja/stk_callback?number=${number}&amount=${amount}&link_id=${linkId}`,
          "AccountReference": "Twendejob",
          "TransactionDesc": "Twendejob Subscription"
        }
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
      }
    );

  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while processing the STK push request");
  }
};


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
      message = `Welcome! Enjoy exclusive opportunities. Start your journey now!:\n\n`;
      message += `1. Reply 1 for weekly @100 Juliswa notifications \n`;
      message += `2. Reply 2 for monthly 250. \n`;
      message += `Use www.twendejob.co.ke to create your profile`;

    
      // Rest of your code to send the message
    }  

    //
      else {
          message = `Hello From Twende Job, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]} for more details visit https://twendejob.co.ke/details/${jobID[i]} `;
        // sender is in the numbers array
      }
     console.log(message);
     if (
      recMessage.toLowerCase().replace(/\s/g, '') === 'jobs' ||
      recMessage.toLowerCase().replace(/\s/g, '') === 'kazi' ||
      recMessage.toLowerCase().replace(/\s/g, '') === 'job'

    ) {
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
      else if ( recMessage.toLowerCase().replace(/\s/g, '') === '1' || recMessage.toLowerCase().replace(/\s/g, '') === '2') {
        let subscriptionMessage;
         if (recMessage === '1') {
          subscriptionMessage = "You have subscribed to weekly SMS at 100 Ksh.";
          try {
            const darajaResponse = await makeSTKPushRequest(sender, 100, linkId);
            console.log(darajaResponse);
            // Handle the response from the Daraja API as needed
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
                "message": 'Thanks for Subscribing, we are processing your request, Please send Jobs after 30 Seconds',
              },
            },
            )
          } catch (error) {
            console.error(error);
          }
        } else if (recMessage === '2') {
          subscriptionMessage = "You have subscribed to monthly SMS at 250 Ksh.";
          try {
            const darajaResponse = await makeSTKPushRequest(sender, 250, linkId);
            console.log(darajaResponse);
            // Handle the response from the Daraja API as needed
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
                "message": 'Thanks for Subscribing, we are processing your request, Please send Jobs after 30 Seconds',
              },
            },
            )
          } catch (error) {
            console.error(error);
          }
        }
        // Add any additional logic or handling for other subscription options
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
            "message": 'Please write "jobs" if you want to get the latest jobs',
          },
    
        },
         
         function (error, response, body) {
            if (error) {
                console.log(error);
              
            } else {       
              //console.log(sms);
              //console.log(body);
              
              
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
      let username = process.env.PATA_SMS_USERNAME
      let Password = process.env.PATA_SMS_PASSWORD
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
            "sender": "TWENDEJOBS",
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
        "sender": 'TWENDEJOBS',
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


