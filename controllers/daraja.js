import { json } from 'express';
import request from 'request';
import Subscribers from '../models/darajaModels.js';
import asyncHandler from 'express-async-handler';
const Getsubscribers = asyncHandler( async (req , res) => {
    console.log(req.body);
    const subscribers =await Subscribers.find({"phoneNumber":req.body.phoneNumber});
    res.status(200).json({
        subscribers
})
})
const GetAllsubscribers = asyncHandler( async (req , res) => {
    console.log(req.body);
    const subscribers =await Subscribers.find({});
    res.status(200).json({
        subscribers
})
})
const Deletesubscribers = asyncHandler( async (req , res) => {
    // delete subscriber by id 
    const {id: _id} = req.params;
    const subscriber = await Subscribers.findByIdAndDelete(_id);
    if (subscriber) {
        res.json({ message: 'Subscriber deleted' });
    } else {
        res.status(404);
        throw new Error('Subscriber not found');
    }
})


export {Getsubscribers,GetAllsubscribers,Deletesubscribers};