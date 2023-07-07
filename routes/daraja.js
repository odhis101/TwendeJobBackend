import  express  from "express";
//import {access_token,register_url} from "../controllers/daraja.js";
import request from 'request';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';

import User from "../models/darajaModels.js"

import { Getsubscribers,GetAllsubscribers, Deletesubscribers} from "../controllers/daraja.js";
import { get } from "mongoose";
import dotenv from 'dotenv';
const router = express.Router();
const consumer_key = 'R2kA2Avi3cOFAdkdvR7zVgOZjKibRCOm';
const consumer_secret  = 'h2gwMdxszxc2tJ35';
const Backend_url = 'https://twendejob-backend.oa.r.appspot.com';
dotenv.config();
let url1 = process.env.PATA_SMS_URL;
let username1 = process.env.PATA_SMS_USERNAME
let password1 = process.env.PATA_SMS_PASSWORD
let auth1 =  "Basic " + new Buffer.from(username1 + ":" + password1).toString("base64");

router.get ('/access_token', getaccess_token, (req, res)=>{
    res.status (200).json({
        access_token: req.access_token
    })

});    

router.get ('/register', getaccess_token,(req, res)=>{
    let url = "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    let auth = "Bearer "+ req.access_token;
    console.log(auth);
    request(

        {
            url :url,
            method : "POST",
            headers:{
                "Authorization":auth
            },
            json:{
                "ShortCode": "494977",
                "ResponseType": "Completed",
                "ConfirmationURL": `${Backend_url}/daraja/confirmation`,// chang
                "ValidationURL": `${Backend_url}/daraja/validation`
              }


        },
        function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json(body);
                
            }
        }
    )

    
});



function getaccess_token(req, res,next){
 
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
                console.log('here is the error ',error);
            } else {
                //console.log('here is the body ',body);
               req.access_token = JSON.parse(body).access_token;
               //console.log(req.IncomingMessage) 
               next()
                
            }
  
}
    )

}
//console.log(getaccess_token())
router.get ('/confirmation', getaccess_token,(req, res)=>{

    //let mpesa_resp = ;
    res.status(200).json({
        request:req.body
    });
    
});


router.post ('/validation', getaccess_token,(req, res)=>{
    console.log('validation');
    console.log(req.body);
    //res.status(200).send("User Page");
});
router.post ('/getdata', getaccess_token,(req, res)=>{
    //res.status(200).send("User Page");
    console.log(req.body);
});

router.get ('/simulate',  getaccess_token, (req, res)=>{
    let url = "https://api.safaricom.co.ke/mpesa/c2b/v1/simulate";
    let auth = "Bearer "+ req.access_token;
    
    request(
        {
            url :url,
              method : "POST",
            headers:{
                "Authorization":auth
                },
                json:{
                    "ShortCode": "600987",
                    "CommandID": "CustomerPayBillOnline",
                    "Amount": "1",
                    "Msisdn": "254708374149",
                    "BillRefNumber": "twendejob"
                }
        },
        function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json(body);
            }
        }
        
    )
})
const middleware = (req, res, next) => {
    req.name = "lahiru";
    next();
  };
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

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
router.post('/stkpush',middleware, getaccess_token,asyncHandler(async (req, res)=>{
    let url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    let auth = "Bearer "+ req.access_token;
   
    const {number,amount,id} = req.body;

 

    let passkey ='3e05a5eb019d9bc8cb1eb2045e0bff9e6b46279ca5e57d87356ae07bc6308d70'
    const timestamp =generateTimestamp()
    const Passwords = new Buffer.from("494977" + passkey + timestamp).toString('base64');
    console.log(timestamp)
    console.log(typeof(timestamp));

    request(
        
        {
            url :url,
            method : "POST",
            headers:{
                "Authorization":auth
                },
                json:{
                    "BusinessShortCode": "494977",
                    "Password":Passwords, 
                    "Timestamp":timestamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": number,
                    "PartyB": "494977",
                    "PhoneNumber": number,
                    "CallBackURL": "https://twendejob-backend.oa.r.appspot.com/daraja/stk_callback?number="+id+"&amount="+amount,
                    "AccountReference": "Twendejob",
                    "TransactionDesc": "Twendejob Subscription"
                }
        },
        function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.status(200).json(body);
                console.log(response);
            }
        }
        
    )
        }))
        
       
 

router.post('/subscriptions',Getsubscribers)
router.get('/Allsubscriptions',GetAllsubscribers)
router.delete('/Deletesubscribers/:id',Deletesubscribers)



router.post('/stk_callback', middleware, asyncHandler(async (req, res) => {
    console.log('this is testing confirmation');
    console.log('test2');
    const id = req.query.number;
    const amount = req.query.amount;
    const linkId = req.query.linkId;
    console.log(req.query);
    console.log(typeof(amount));
    let daysToExpiry = 0;
    switch (amount) {
      case '85':
        daysToExpiry = 7;
        break;
      case '250':
        daysToExpiry = 30;
        break;
      default:
        daysToExpiry = 0;
    }
    
    let today = new Date().toISOString().slice(0, 10);
    console.log(daysToExpiry);
    let expiry = addDays(today, daysToExpiry).toISOString().slice(0, 10);
    console.log(expiry);
    console.log(req.body.Body)
    
    if (req.body.Body.stkCallback.ResultDesc === 'The service request is processed successfully.') {
        
        
      const Subscription = await User.create({
        phoneNumber: id,
        Subscription: true,
        lengthOfSubscription: daysToExpiry,
        amount: amount,
        SubscriptionDate: today,
        expiry: expiry,
      });

      request(  {
        method: "POST",
        url: url1,
        path: '/send',
        'maxRedirects': 20,
        headers: {
          "Authorization": auth1,
          "Content-Type": "application/json",
          'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn',
        },
        json:{
          "sender": "TWENDEJOBS",
          "recipient": phoneNumber,
          "link_id": '',
          'bulk':1,
          "message": "Welcome to Kazi Chap!  Tailored job tips, Kazi match, and instant notifications. Your journey to opportunities starts here. Enjoy!",
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
      
 
  
    }
    else{
        // send a message that we have failed to subscribe
        request(  {
            method: "POST",
            url: url1,
            path: '/send',
            'maxRedirects': 20,
            headers: {
              "Authorization": auth1,
              "Content-Type": "application/json",
              'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn',
            },
            json:{
              "sender": "TWENDEJOBS",
              "recipient": phoneNumber,
              "link_id": '',
              'bulk':1,
              "message": "Welcome to Kazi Chap!  Tailored job tips, Kazi match, and instant notifications. Your journey to opportunities starts here. Enjoy!",
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

    }

})
      );
  

export default router;


