import axios from 'axios';
import request from 'request';



const consumer_key = 'R2kA2Avi3cOFAdkdvR7zVgOZjKibRCOm';
const consumer_secret  = 'h2gwMdxszxc2tJ35'; 
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
  const makeSTKPushRequest = async (number, amount) => {
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
            "CallBackURL": `https://twendejob-backend.oa.r.appspot.com/daraja/stk_callback?number=${number}&amount=${amount}`,
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
  
  
  
  /*
  const access_token = await getaccess_token();
  console.log('hello')
  makeDarajaAPIRequest('0703757369', 1, access_token);
//console.log(access_token)
*/

makeSTKPushRequest('254703757369', 1);

