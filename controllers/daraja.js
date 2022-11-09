import { json } from 'express';
import request from 'request';

const access_token =  (req, res) => {
    // gett access token from daraja
        getaccess_token(req, res);
    

    
}

function getaccess_token(req, res){
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = new Buffer("aSUmderYVHuVGUhyEl3dWF7kBt1fOWej:G0k2bp5urvkWkf79").toString("base64");
   
    request(
        {
        url :url,
        headers:{
            "Authorization":"Basic "+ auth
        }
    
        },
        (error, response, body) => {
            if (error) {
                console.log(error);
            } else {
 
               res.json(JSON.parse(body).access_token);
              
               

            }
        }
        
    )
}
const register_url = (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    let auth = "Bearer "+ getaccess_token ();
    console.log(auth);
    request(
        {
            url :url,
           method : "POST",
            headers:{
                "Authorization":auth
              },
              json:{
                "ShortCode": "600987",
                "ResponseType": "Completed",
                "ConfirmationURL": "http://192.168.0.35:801/confirmation",
                "ValidationURL": "http://192.168.0.35:801/validation_url"
                

              }



        },
        function (error, response, body) {
            if (error) {
                console.log(error);
                console.log(auth)
            } else {
                console.log(body);
            }
        }

    )
}

export {access_token,getaccess_token,register_url};