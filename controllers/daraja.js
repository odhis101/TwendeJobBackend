import { json } from 'express';
import request from 'request';

const access_token =  (req, res) => {
    // gett access token from daraja
        getaccess_token();
    

    
}

function getaccess_token(req, res){
  
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
        async function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                let resp = await JSON.parse(body);
                let access_token = await resp.access_token;
                console.log(access_token);
                
            }
  
}
    )

}

 const register_url = async (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    let auth = "Bearer "+ await getaccess_token ();
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

export {access_token,register_url};