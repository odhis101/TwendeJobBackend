import { json } from 'express';
import request from 'request';
import Subscribers from '../models/darajaModels.js';
import asyncHandler from 'express-async-handler';
const getsms = asyncHandler(async (req, res) => {
    //const JobExists = await Jobs.find({})
  res.status(200).json(req.body)
   console.log(req.body);
  })
  export {getsms};