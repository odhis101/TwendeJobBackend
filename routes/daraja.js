import  express  from "express";
//import {access_token,register_url} from "../controllers/daraja.js";
import request from 'request';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';

import User from "../models/darajaModels.js"

import { Getsubscribers,GetAllsubscribers, Deletesubscribers} from "../controllers/daraja.js";
import { get } from "mongoose";

const router = express.Router();
router.get ('/access_token', getaccess_token, (req, res)=>{
    res.status (200).json({
        access_token: req.access_token
    })

});    





router.get ('/register', getaccess_token,(req, res)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    let auth = "Bearer "+ req.access_token;
    request(

        {
            url :url,
            method : "POST",
            headers:{
                "Authorization":auth
            },
            json:{
                "ShortCode": "600730",
                "ResponseType": "Completed",
                "ConfirmationURL": "https://twendejob-backend.oa.r.appspot.com/daraja/confirmation",
                "ValidationURL": "https://twendejob-backend.oa.r.appspot.com/daraja/validation"
                

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
    let consumer_key = "5ijH05e0wrWCkVKtsuA247YKAosfP3ED";
    let consumer_secret = "BfopAok9WlYz3gjX";
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
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
router.post ('/confirmation', getaccess_token,(req, res)=>{

    //let mpesa_resp = ;
    console.log(req.body);
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
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
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
router.post('/stkpush',middleware, getaccess_token,asyncHandler(async (req, res)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    let auth = "Bearer "+ req.access_token;
    const {number,amount,id} = req.body;

 
    let datenow = new Date() 
    let passkey ='MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjAwNDMwMTgzOTQ5'
    const timestamp = datenow.getFullYear()+ ""+""+datenow.getMonth()+""+""+datenow.getDate()+""+""+datenow.getHours()+""+""+datenow.getMinutes()+""+""+datenow.getSeconds();
    const Passwords = new Buffer.from("174379" + passkey + timestamp).toString('base64');

    request(
        
        {
            url :url,
              method : "POST",
            headers:{
                "Authorization":auth
                },
                json:{
                    "BusinessShortCode": "174379",
                    "Password":'MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjAwNDMwMTgzOTQ5', 
                    "Timestamp":'20200430183949',
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": number,
                    "PartyB": "174379",
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
            }
        }
        
    )
    /*
let daysToExpiry = 0;
console.log(amount)
    switch(amount){
        case "10":
       daysToExpiry = 1;
        break;
      case "49":
        daysToExpiry = 7;
        break;
      case "199":
        daysToExpiry = 30;
        break;
        // create a default 
        default:
        daysToExpiry = 0;

    }
     
    let today = new Date().toISOString().slice(0, 10)
    let expiry = addDays(today, daysToExpiry).toISOString().slice(0, 10)
    console.log(expiry)
 
        const Subscription = await User.create({
                phoneNumber: id,
                Subscription:true,
                lengthOfSubscription:7,
                amount:amount,
                SubscriptionDate: today,
                expiry:expiry,
            })
            console.log(Subscription)
            */
        }))
        
       

    

router.post('/subscriptions',Getsubscribers)
router.get('/Allsubscriptions',GetAllsubscribers)
router.delete('/Deletesubscribers/:id',Deletesubscribers)
router.post('/stk_callback',middleware,asyncHandler(async (req, res)=>{
    console.log("test2");
    const id = req.query.number
    const amount = req.query.amount
    console.log(req.query);
    console.log(typeof(amount))
    let daysToExpiry = 0;
    switch(amount){
    case "10":
    daysToExpiry = 1;
    break;
  case "49":
    daysToExpiry = 7;
    break;
  case "199":
    daysToExpiry = 30;
    break;
    // create a default
    default:
    daysToExpiry = 0;
}

    
    let today = new Date().toISOString().slice(0, 10)
    console.log(daysToExpiry)
    let expiry = today.addDays(daysToExpiry)
    console.log(expiry)
    let check_success = req.body.Body.stkCallback.ResultCode
    if(check_success > 0 ){
        // update subscription
        const Subscription = await User.update({
            Subscription:true,
            lengthOfSubscription:daysToExpiry,
            amount:amount,
            SubscriptionDate: today,
            expiry:expiry,
        },{
            where:{
                phoneNumber:id
            }
        })


       /*
        const Subscription = await User.create({
            phoneNumber: id,
            Subscription:true,
            lengthOfSubscription:7,
            amount:amount,
            SubscriptionDate: today,
            expiry:expiry,
        })
        */
        console.log(Subscription)
    }
    else{
    console.log("something went rsssong")
    }
  

 

}))

export default router;


