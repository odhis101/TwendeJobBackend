"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyOTP = exports.sendOtp = exports.getallsms = exports.call_back = exports.getsms = void 0;

var _express = require("express");

var _request = _interopRequireDefault(require("request"));

var _darajaModels = _interopRequireDefault(require("../models/darajaModels.js"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _JobsModel = _interopRequireDefault(require("../models/JobsModel.js"));

var _followRedirects = _interopRequireDefault(require("follow-redirects"));

var _fs = _interopRequireDefault(require("fs"));

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _twilio = _interopRequireDefault(require("twilio"));

var _smsModel = _interopRequireDefault(require("../models/smsModel.js"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var PATA_SMS_URL = "https://api.patasms.com/send_one";
var PATA_SMS_USERNAME = 'twende.jobs';
var PATA_SMS_PASSWORD = 'P@ssw0rd'; //const jwt = require('jsonwebtoken');

var getsms = (0, _expressAsyncHandler["default"])(function _callee(req, res) {
  var sender, shortcode, linkId, url, username, password, auth, subscribers, jobs, jobsTitle, jobDescription, numbersArray, currentDate, numbers, i, checker, numbers0, message;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //const JobExists = await Jobs.find({})
          console.log('hit the route');
          console.log(req.body);
          console.log(req.body);
          sender = req.body.msisdn;
          shortcode = req.body.shortcode;
          linkId = req.body.linkId; // i want to update i after every cron schedule 

          url = PATA_SMS_URL;
          username = PATA_SMS_USERNAME;
          password = PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + password).toString("base64");
          _context.next = 12;
          return regeneratorRuntime.awrap(_darajaModels["default"].find({}));

        case 12:
          subscribers = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(_JobsModel["default"].find({}));

        case 15:
          jobs = _context.sent;
          // create an array of jobs 
          jobsTitle = [];
          console.log('testing');
          jobs.forEach(function (job) {
            jobsTitle.push(job.jobTitle);
          });
          jobDescription = [];
          jobs.forEach(function (job) {
            jobDescription.push(job.jobDescription);
          });
          console.log(jobsTitle); //console.log(subscribers);

          numbersArray = [];
          currentDate = new Date().toISOString().slice(0, 10);
          subscribers.forEach(function (subscriber) {
            //numbersArray.push(subscriber.phoneNumber);
            if (subscriber.expiry > currentDate) {
              //these are the ones that are not expired 
              numbersArray.push(subscriber.phoneNumber);
            } else {// this is the expired ones 
              //numbersArray.push(subscriber.phoneNumber);
            }
          });
          numbers = _toConsumableArray(new Set(numbersArray));
          console.log(numbers);
          res.send(JSON.stringify(numbers));
          i = Math.floor(Math.random() * jobsTitle.length); // checking for 254 in the sender number

          checker = sender;
          console.log('this is sender ', sender);
          console.log('type of sender', _typeof(sender));

          if (sender.toString().startsWith('254')) {
            checker = sender.toString().replace('254', '0');
            console.log('this is checker ', checker);
          } // replacing all phone numbers in numbers to start with 254


          numbers0 = numbers.map(function (number) {
            if (number.startsWith('254')) {
              return number.replace('254', '0');
            } else {
              return number;
            }
          });
          console.log('numbers that start with ', numbers0);
          message = '';

          if (!numbers0.includes(checker)) {
            // sender is not in the numbers array
            console.log('sender is not in the numbers array');
            message = "please subscribe to our service to get the latest jobs, go twendejobs.com to create your subscription";
          } else {
            message = "Hello From Twende Job, we have new jobs for you. ".concat(jobsTitle[i], " ").concat(jobDescription[i]); // sender is in the numbers array
          }

          (0, _request["default"])({
            method: "POST",
            url: url,
            path: '/send',
            'maxRedirects': 20,
            headers: {
              "Authorization": auth,
              "Content-Type": "application/json",
              'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn'
            },
            json: {
              "sender": 23551,
              "recipient": sender,
              "link_id": linkId,
              'bulk': 0,
              "message": message
            }
          }, function (error, response, body) {
            if (error) {
              console.log(error);
            } else {
              var sms = new _smsModel["default"]({
                phoneNumber: sender,
                messageText: message
              });
              sms.save();
              console.log(sms);
              console.log(body);
            }
          });
          console.log(jobsTitle[i]); // print jobtitle[i] and jobdescription[i]

        case 39:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getsms = getsms;
var call_back = (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          res.status(200).json(req.body);
          console.log(req.body);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // get all sms from the database

exports.call_back = call_back;
var getallsms = (0, _expressAsyncHandler["default"])(function _callee3(req, res) {
  var sms;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_smsModel["default"].find({}));

        case 2:
          sms = _context3.sent;
          res.status(200).json(sms);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getallsms = getallsms;
var sendOtp = (0, _expressAsyncHandler["default"])(function _callee4(req, res) {
  var url, username, Password, auth, phoneNumber, otp, message, user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('hit the sendOtp route');
          console.log(req.body);
          url = PATA_SMS_URL;
          username = PATA_SMS_USERNAME;
          Password = PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
          phoneNumber = req.body.phoneNumber;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit code

          message = "Your verification code is ".concat(otp); // create the message body

          console.log(message);
          _context4.prev = 11;
          (0, _request["default"])({
            method: "POST",
            url: url,
            path: '/send',
            'maxRedirects': 20,
            headers: {
              "Authorization": auth,
              "Content-Type": "application/json",
              'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn'
            },
            json: {
              "sender": 'Titan',
              "recipient": "0703757369",
              "link_id": '',
              'bulk': 1,
              "message": message
            }
          }, function (error, response, body) {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }); // Save the OTP in the database

          _context4.next = 15;
          return regeneratorRuntime.awrap(_userModels["default"].findOneAndUpdate({
            phoneNumber: phoneNumber
          }, {
            otpCode: otp
          }, {
            "new": true,
            upsert: true
          }));

        case 15:
          user = _context4.sent;
          console.log(user);

          if (user) {
            res.status(200).json({
              message: 'OTP sent successfully'
            });
          } else {
            res.status(400).json({
              message: 'User not found'
            });
          }

          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](11);
          console.error(_context4.t0);
          res.status(500).json({
            message: 'An error occurred while sending OTP'
          });

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[11, 20]]);
});
exports.sendOtp = sendOtp;
var verifyOTP = (0, _expressAsyncHandler["default"])(function _callee5(req, res) {
  var _req$body, phoneNumber, otp, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body = req.body, phoneNumber = _req$body.phoneNumber, otp = _req$body.otp;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 5:
          user = _context5.sent;

          if (user) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'User not found'
          }));

        case 8:
          console.log('here is the stored otp', user.otpCode, 'here is the otp sent', otp);
          console.log(_typeof(user.otpCode), _typeof(otp)); // Check if the OTP matches

          if (!(user.otpCode === otp)) {
            _context5.next = 16;
            break;
          }

          console.log('otp matches'); // Clear the OTP from the user document
          //user.otp = undefined;
          //await user.select('-phone -password').save();

          console.log('success');
          return _context5.abrupt("return", res.status(200).json({
            message: 'OTP verification successful'
          }));

        case 16:
          return _context5.abrupt("return", res.status(400).json({
            message: 'Invalid OTP'
          }));

        case 17:
          _context5.next = 23;
          break;

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](2);
          console.error(_context5.t0);
          res.status(500).json({
            message: 'An error occurred while verifying OTP'
          });

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 19]]);
}); // counter function to track the number of requests

/* 
 const sendsms = asyncHandler(async (req, res) => {
   let i = 0;
  
   // i want to update i after every cron schedule 

   let url = "https://api.patasms.com/send_one";
   let username = 'twende.jobs'
   let password = 'P@ssw0rd'
   let auth =  "Basic " + new Buffer.from(username + ":" + password).toString("base64");
   const subscribers =await Subscribers.find({});
   const jobs = await Jobs.find({});
   // create an array of jobs 
   let jobsTitle = [];
   console.log('testing');
   jobs.forEach((job) => {
     jobsTitle.push(job.jobTitle);
   });
   let jobDescription = [];
   jobs.forEach((job) => {
     jobDescription.push(job.jobDescription);
   });
   //console.log(subscribers);
   let numbersArray = [];
   const currentDate = new Date().toISOString().slice(0, 10)
   subscribers.forEach((subscriber) => {
     //numbersArray.push(subscriber.phoneNumber);

     if (subscriber.expiry > currentDate) {
       // numbersArray.push(subscriber.phoneNumber);
     } else {
       // this is the expired ones 
       numbersArray.push(subscriber.phoneNumber);
       
     }
   });
   
   const numbers = [...new Set(numbersArray)]
   console.log(numbers);
   numbers.forEach((number) => {
   request(  {
     method: "POST",
     url: url,
     path: '/send',
     'maxRedirects': 20,
     headers: {
       "Authorization": auth,
       "Content-Type": "application/json",
       'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn',
     },
     json:{
       "sender": 23552,
       "recipient": number,
       "link_id": "812389123",
       'bulk':0,
       "message": `Hello, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]}`,
     },

   },
    
    function (error, response, body) {
       if (error) {
           console.log(error);
       } else {
         console.log(body);
       }
    }
   )
   })

   
  i++ 
  console.log(jobsTitle[i])

 });

*/
//console.log(`The time i s ${hours}:${minutes}`);

/*twilio version */

/* 30 1 * * * */

/*
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
cron.schedule('* 30 1 * * * *',  asyncHandler(async (req, res) => {  const subscribers =await Subscribers.find({});
 console.log('its 8 am')   
const jobs = await Jobs.find({});
    // create an array of jobs 
    let jobsTitle = [];
    jobs.forEach((job) => {
      jobsTitle.push(job.jobTitle);
    });
    let jobDescription = [];
    jobs.forEach((job) => {
      jobDescription.push(job.jobDescription);
    });
    console.log(jobsTitle,jobDescription);
    let numbersArray = [];
    const currentDate = new Date().toISOString().slice(0, 10)
    subscribers.forEach((subscriber) => {
      //numbersArray.push(subscriber.phoneNumber);
 
      if (subscriber.expiry > currentDate) {
        // numbersArray.push(subscriber.phoneNumber);
      } else {
        // this is the expired ones 
        if(subscriber.phoneNumber.startsWith('0')  ){
          subscriber.phoneNumber = subscriber.phoneNumber.replace('0', '254');
          
      }
        numbersArray.push(subscriber.phoneNumber);
        
      }
    });
    const countryCode = '+254'; // Replace with your country code
    const numbers = [...new Set(numbersArray)]
    

    console.log(numbers);
    const accountSid = 'AC8c9b65406300a5fb2456e225ed765b11';
    const authToken = '396516a55b393caab2bd3f0827ac1998';
    const client = twilio(accountSid, authToken);

    numbers.forEach((number) => {
     
client.messages
  .create({
    body: `Hello, we have new jobs for you. ${jobsTitle[i]} ${jobDescription[i]}`,
    from: '+15076154216',
    to: `+${number}`
  })
  .then(message => console.log(`Message sent: ${message.sid}`))
  .catch(error => console.error(error));

    
  })
  i++

}))

*/

exports.verifyOTP = verifyOTP;