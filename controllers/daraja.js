import { json } from 'express';
import request from 'request';
import Subscribers from '../models/darajaModels.js';
import asyncHandler from 'express-async-handler';
const Getsubscribers = asyncHandler( async (req , res) => {
    const subscribers =await Subscribers.find({});
    res.status(200).json({
        subscribers
})
})

export {Getsubscribers};