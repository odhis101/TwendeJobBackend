import  express  from "express";
//import {access_token,register_url} from "../controllers/daraja.js";
import request from 'request';
import bodyParser from 'body-parser';
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
                "ShortCode": "600987",
                "ResponseType": "Complete",
                "ConfirmationURL": "http://192.168.0.35:5000/confirmation",
                "ValidationURL": "http://192.168.0.35:5000/daraja/validation"
                

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
    let consumer_key = "aSUmderYVHuVGUhyEl3dWF7kBt1fOWej";
    let consumer_secret = "G0k2bp5urvkWkf79";
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
                next();
                
            }
  
}
    )

}
router.post ('/confirmation', getaccess_token,(req, res)=>{

    //let mpesa_resp = ;
    console.log(req.body);
});


router.get ('/validation', getaccess_token,(req, res)=>{
    console.log('validation');
    console.log(req.body);
    res.status(200).send("User Page");
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
                    "BillRefNumber": "testapi"
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

export default router;