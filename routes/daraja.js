import  express  from "express";
//import {access_token,register_url} from "../controllers/daraja.js";
import request from 'request';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';
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
                "ConfirmationURL": "https://be71-196-207-148-228.ap.ngrok.io/daraja/confirmation",
                "ValidationURL": "https://be71-196-207-148-228.ap.ngrok.io/daraja/validation"
                

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
    let consumer_key = "rAUu1dXQKMzvA6AG2TBAWJ5GPOZFMPTj";
    let consumer_secret = "IkbzJoLUZcOeiQaF";
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
                console.log(error);
            } else {
               req.access_token = JSON.parse(body).access_token;
                next()
                
            }
  
}
    )

}
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
router.post('/stkpush', getaccess_token,asyncHandler(async (req, res)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    let auth = "Bearer "+ req.access_token;
   const {number,amount} = req.body; 
    let datenow = new Date() 
    let passkey ='MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjAwNDMwMTgzOTQ5'
    const timestamp = datenow.getFullYear()+ ""+""+datenow.getMonth()+""+""+datenow.getDate()+""+""+datenow.getHours()+""+""+datenow.getMinutes()+""+""+datenow.getSeconds();
    const Passwords = new Buffer.from("174379" + passkey + timestamp).toString('base64');
    console.log(req.body)
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
                    "CallBackURL": "https://898e-196-207-148-228.eu.ngrok.io/daraja/stk_callback",
                    "AccountReference": "testapi",
                    "TransactionDesc": "testapi"
                }
        },
        function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                console.log('hiiii')
                res.status(200).json(body);
            }
        }
        
    )
}))
router.post('/stk_callback', (req, res)=>{
    console.log("stk");
    res.status(200).send("User Page");
    console.log(req.body);
})
export default router;