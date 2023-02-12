import { json } from 'express';
import request from 'request';
import Subscribers from '../models/darajaModels.js';
import asyncHandler from 'express-async-handler';
const getsms = asyncHandler(async (req, res) => {
    //const JobExists = await Jobs.find({})
  res.status(200).json(req.body)
   console.log(req.body);
  })

  const sendsms = asyncHandler(async (req, res) => {
    let url = "https://api.patasms.com/send_one";
    let username = 'twende.jobs'
    let password = 'P@ssw0rd'
    // create a base64 encoded username:password
    let auth = new Buffer.from(username + ":" + password).toString("base64");
    let sender = 'PataSMS' // sender name
    request(
      {    
        method: "POST",
        url: url,
        headers: {
            "Authorization": auth,
        }
          },
          function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
              console.log(error);
               res.json(body);
            }
        }
          
          )
  })

  const call_back = asyncHandler(async (req, res) => {
    res.status(200).json(req.body)
    console.log(req.body);
  })

  export {getsms,sendsms,call_back};