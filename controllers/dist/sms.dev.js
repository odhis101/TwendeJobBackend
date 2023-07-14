"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyOTP = exports.sendOtp = exports.getallsms = exports.call_back = exports.getsms = exports.sendOtpAdmin = void 0;

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

var _adminModels = _interopRequireDefault(require("../models/adminModels.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var PATA_SMS_URL = process.env.PATA_SMS_URL;
var PATA_SMS_USERNAME = 'twende.jobs';
var PATA_SMS_PASSWORD = 'P@ssw0rd';

_dotenv["default"].config();

console.log('here is some enve stuff ', process.env.PATA_SMS_URL); //const jwt = require('jsonwebtoken');

var consumer_key = 'R2kA2Avi3cOFAdkdvR7zVgOZjKibRCOm';
var consumer_secret = 'h2gwMdxszxc2tJ35';
var cronSchedule = '0 9 * * *'; //const cronSchedule = '*/10 * * * * *'; // Run every 10 seconds

_nodeCron["default"].schedule(cronSchedule, function _callee() {
  var url, username, password, auth, subscribers, jobs, jobsTitle, jobDescription, Employers_contact, NumbersArray, currentDate, number, message;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //const JobExists = await Jobs.find({})
          console.log('trying to send dayly sms'); // i want to update i after every cron schedule 

          url = PATA_SMS_URL;
          username = process.env.PATA_SMS_USERNAME;
          password = process.env.PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + password).toString("base64");
          _context.next = 7;
          return regeneratorRuntime.awrap(_darajaModels["default"].find({}));

        case 7:
          subscribers = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(_JobsModel["default"].find({}));

        case 10:
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
          Employers_contact = [];
          jobs.forEach(function (job) {
            Employers_contact.push(job.Employers_contact);
          }); //console.log(jobsTitle);
          //console.log(subscribers);

          NumbersArray = [];
          currentDate = new Date().toISOString().slice(0, 10);
          number = Math.floor(Math.random() * jobsTitle.length);
          message = "Daily Message From Twende Job , we have new jobs for you. ".concat(jobsTitle[number], " ").concat(jobDescription[number], " contact ").concat(Employers_contact[number], " for more information"); //console.log(message );

          subscribers.forEach(function (subscriber) {
            //numbersArray.push(subscriber.phoneNumber);
            if (subscriber.expiry > currentDate) {
              //these are the ones that are not expired 
              NumbersArray.push(subscriber.phoneNumber);

              try {
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
                    "sender": "TWENDEJOBS",
                    "recipient": subscriber.phoneNumber,
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
              } catch (error) {
                console.error(error);
                res.status(500).json({
                  message: 'An error occurred while sending Daily jobs'
                });
              }
            } else {
              console.log('they are no subscribers');
            }
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  });
});

var getsms = (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var sender, shortcode, linkId, recMessage, url, username, password, auth, subscribers, jobs, jobsTitle, jobDescription, jobID, numbersArray, currentDate, getaccess_token, generateTimestamp, makeSTKPushRequest, numbers, i, checker, numbers0, message, subscriptionMessage, darajaResponse, _darajaResponse;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          //const JobExists = await Jobs.find({})
          console.log('hit the route');
          console.log(req.body);
          console.log(req.body);
          sender = req.body.msisdn;
          shortcode = req.body.shortcode;
          linkId = req.body.linkId;
          recMessage = req.body.message; // i want to update i after every cron schedule 

          url = PATA_SMS_URL;
          username = PATA_SMS_USERNAME;
          password = PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + password).toString("base64");
          _context3.next = 13;
          return regeneratorRuntime.awrap(_darajaModels["default"].find({}));

        case 13:
          subscribers = _context3.sent;
          _context3.next = 16;
          return regeneratorRuntime.awrap(_JobsModel["default"].find({}));

        case 16:
          jobs = _context3.sent;
          // create an array of jobs 
          jobsTitle = [];
          console.log('testing');
          jobs.forEach(function (job) {
            jobsTitle.push(job.jobTitle);
          });
          jobDescription = [];
          jobs.forEach(function (job) {
            jobDescription.push(job.jobDescription);
          }); // get jobID so that we can dynamically link 

          jobID = [];
          jobs.forEach(function (job) {
            jobID.push(job._id);
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

          getaccess_token = function getaccess_token() {
            return new Promise(function (resolve, reject) {
              var url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
              var auth = "Basic " + new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
              (0, _request["default"])({
                url: url,
                headers: {
                  "Authorization": auth
                }
              }, function (error, response, body) {
                if (error) {
                  console.log('here is the error ', error);
                  reject(error);
                } else {
                  var access_token = JSON.parse(body).access_token;
                  resolve(access_token);
                }
              });
            });
          };

          generateTimestamp = function generateTimestamp() {
            var date = new Date();
            var timestamp = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + (date.getDate() + 1)).slice(-2) + ("0" + (date.getHours() + 1)).slice(-2) + ("0" + (date.getMinutes() + 1)).slice(-2) + ("0" + (date.getSeconds() + 1)).slice(-2);
            return timestamp;
          };

          makeSTKPushRequest = function makeSTKPushRequest(number, amount, linkId) {
            var _url, access_token, _auth, passkey, timestamp, Passwords;

            return regeneratorRuntime.async(function makeSTKPushRequest$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    _url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; // Get the access token using your preferred method

                    _context2.next = 4;
                    return regeneratorRuntime.awrap(getaccess_token());

                  case 4:
                    access_token = _context2.sent;
                    // Replace with your access token retrieval code
                    console.log(access_token);
                    _auth = "Bearer " + access_token;
                    console.log(_auth);
                    passkey = '3e05a5eb019d9bc8cb1eb2045e0bff9e6b46279ca5e57d87356ae07bc6308d70';
                    timestamp = generateTimestamp();
                    Passwords = Buffer.from("494977" + passkey + timestamp).toString('base64');
                    console.log(Passwords);
                    console.log(timestamp);
                    console.log(_typeof(timestamp));
                    (0, _request["default"])({
                      url: _url,
                      method: "POST",
                      headers: {
                        "Authorization": _auth
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
                        "CallBackURL": "https://twendejob-backend.oa.r.appspot.com/daraja/stk_callback?number=".concat(number, "&amount=").concat(amount, "&link_id=").concat(linkId),
                        "AccountReference": "Twendejob",
                        "TransactionDesc": "Twendejob Subscription"
                      }
                    }, function (error, response, body) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(body);
                      }
                    });
                    _context2.next = 21;
                    break;

                  case 17:
                    _context2.prev = 17;
                    _context2.t0 = _context2["catch"](0);
                    console.log(_context2.t0);
                    throw new Error("An error occurred while processing the STK push request");

                  case 21:
                  case "end":
                    return _context2.stop();
                }
              }
            }, null, null, [[0, 17]]);
          };

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
            message = "Please subscribe to our service to get the latest jobs:\n\n";
            message += "1. Send 1 for weekly SMS @ 100 Ksh\n";
            message += "2. Send 2 for monthly SMS @ 250 Ksh"; // Rest of your code to send the message
          } //
          else {
              message = "Hello From Twende Job, we have new jobs for you. ".concat(jobsTitle[i], " ").concat(jobDescription[i], " for more details visit https://twendejob.com/jobs/").concat(jobID[i], " "); // sender is in the numbers array
            }

          console.log(message);

          if (!(recMessage.toLowerCase().replace(/\s/g, '') === 'jobs' || recMessage.toLowerCase().replace(/\s/g, '') === 'kazi')) {
            _context3.next = 48;
            break;
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
          _context3.next = 80;
          break;

        case 48:
          if (!(recMessage.toLowerCase().replace(/\s/g, '') === '1' || recMessage.toLowerCase().replace(/\s/g, '') === '2')) {
            _context3.next = 79;
            break;
          }

          if (!(recMessage === '1')) {
            _context3.next = 64;
            break;
          }

          subscriptionMessage = "You have subscribed to weekly SMS at 100 Ksh.";
          _context3.prev = 51;
          _context3.next = 54;
          return regeneratorRuntime.awrap(makeSTKPushRequest(sender, 100, linkId));

        case 54:
          darajaResponse = _context3.sent;
          console.log(darajaResponse); // Handle the response from the Daraja API as needed

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
              "message": 'Thanks for Subscribing, we are processing your request, Please send Jobs after 30 Seconds'
            }
          });
          _context3.next = 62;
          break;

        case 59:
          _context3.prev = 59;
          _context3.t0 = _context3["catch"](51);
          console.error(_context3.t0);

        case 62:
          _context3.next = 77;
          break;

        case 64:
          if (!(recMessage === '2')) {
            _context3.next = 77;
            break;
          }

          subscriptionMessage = "You have subscribed to monthly SMS at 250 Ksh.";
          _context3.prev = 66;
          _context3.next = 69;
          return regeneratorRuntime.awrap(makeSTKPushRequest(sender, 250, linkId));

        case 69:
          _darajaResponse = _context3.sent;
          console.log(_darajaResponse); // Handle the response from the Daraja API as needed

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
              "message": 'Thanks for Subscribing, we are processing your request, Please send Jobs after 30 Seconds'
            }
          });
          _context3.next = 77;
          break;

        case 74:
          _context3.prev = 74;
          _context3.t1 = _context3["catch"](66);
          console.error(_context3.t1);

        case 77:
          _context3.next = 80;
          break;

        case 79:
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
              "message": 'Please write "jobs" if you want to get the latest jobs'
            }
          }, function (error, response, body) {
            if (error) {
              console.log(error);
            } else {//console.log(sms);
              //console.log(body);
            }
          });

        case 80:
          console.log(jobsTitle[i]); // print jobtitle[i] and jobdescription[i]

        case 81:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[51, 59], [66, 74]]);
});
exports.getsms = getsms;
var call_back = (0, _expressAsyncHandler["default"])(function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          res.status(200).json(req.body);
          console.log(req.body);

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // get all sms from the database

exports.call_back = call_back;
var getallsms = (0, _expressAsyncHandler["default"])(function _callee4(req, res) {
  var sms;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(_smsModel["default"].find({}));

        case 2:
          sms = _context5.sent;
          res.status(200).json(sms);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.getallsms = getallsms;
var sendOtp = (0, _expressAsyncHandler["default"])(function _callee5(req, res) {
  var url, username, Password, auth, phoneNumber, userExists, otp, message, user;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log('hit the sendOtp route');
          console.log(req.body);
          url = PATA_SMS_URL;
          username = process.env.PATA_SMS_USERNAME;
          Password = process.env.PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
          phoneNumber = req.body.phoneNumber;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context6.next = 10;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 10:
          userExists = _context6.sent;

          if (userExists) {
            _context6.next = 16;
            break;
          }

          console.log(userExists);
          console.log(phoneNumber);
          res.status(400);
          throw new Error('User does not exist');

        case 16:
          otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit code

          message = "Your verification code is ".concat(otp); // create the message body

          console.log(message);
          _context6.prev = 19;
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
              "sender": "TWENDEJOBS",
              "recipient": phoneNumber,
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

          _context6.next = 23;
          return regeneratorRuntime.awrap(_userModels["default"].findOneAndUpdate({
            phoneNumber: phoneNumber
          }, {
            otpCode: otp
          }, {
            "new": true,
            upsert: true
          }));

        case 23:
          user = _context6.sent;
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

          _context6.next = 32;
          break;

        case 28:
          _context6.prev = 28;
          _context6.t0 = _context6["catch"](19);
          console.error(_context6.t0);
          res.status(500).json({
            message: 'An error occurred while sending OTP'
          });

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[19, 28]]);
});
exports.sendOtp = sendOtp;
var sendOtpAdmin = (0, _expressAsyncHandler["default"])(function _callee6(req, res) {
  var url, username, Password, auth, phoneNumber, userExists, otp, message, user;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log('hit the admin route');
          console.log(req.body);
          url = PATA_SMS_URL;
          username = PATA_SMS_USERNAME;
          Password = PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
          phoneNumber = req.body.phoneNumber;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(phoneNumber);
          _context7.next = 11;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 11:
          userExists = _context7.sent;

          if (userExists) {
            _context7.next = 15;
            break;
          }

          res.status(400);
          throw new Error('User does not exist');

        case 15:
          otp = Math.floor(100000 + Math.random() * 900000); // generate a random 6-digit code

          message = "Your verification code is ".concat(otp); // create the message body

          console.log(message);
          _context7.prev = 18;
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
              "sender": 'TWENDEJOBS',
              "recipient": phoneNumber,
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

          _context7.next = 22;
          return regeneratorRuntime.awrap(_adminModels["default"].findOneAndUpdate({
            phoneNumber: phoneNumber
          }, {
            otpCode: otp
          }, {
            "new": true,
            upsert: true
          }));

        case 22:
          user = _context7.sent;
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

          _context7.next = 31;
          break;

        case 27:
          _context7.prev = 27;
          _context7.t0 = _context7["catch"](18);
          console.error(_context7.t0);
          res.status(500).json({
            message: 'An error occurred while sending OTP'
          });

        case 31:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[18, 27]]);
});
exports.sendOtpAdmin = sendOtpAdmin;
var verifyOTP = (0, _expressAsyncHandler["default"])(function _callee7(req, res) {
  var _req$body, phoneNumber, otp, user;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body = req.body, phoneNumber = _req$body.phoneNumber, otp = _req$body.otp;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(phoneNumber, otp);
          _context8.prev = 3;
          _context8.next = 6;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 6:
          user = _context8.sent;

          if (user) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            message: 'User not found'
          }));

        case 9:
          console.log('here is the stored otp', user.otpCode, 'here is the otp sent', otp);
          console.log(_typeof(user.otpCode), _typeof(otp)); // Check if the OTP matches

          if (!(user.otpCode === otp)) {
            _context8.next = 17;
            break;
          }

          console.log('otp matches'); // Clear the OTP from the user document
          //user.otp = undefined;
          //await user.select('-phone -password').save();

          console.log('success');
          return _context8.abrupt("return", res.status(200).json({
            message: 'OTP verification successful'
          }));

        case 17:
          return _context8.abrupt("return", res.status(400).json({
            message: 'Invalid OTP'
          }));

        case 18:
          _context8.next = 24;
          break;

        case 20:
          _context8.prev = 20;
          _context8.t0 = _context8["catch"](3);
          console.error(_context8.t0);
          res.status(500).json({
            message: 'An error occurred while verifying OTP'
          });

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[3, 20]]);
});
exports.verifyOTP = verifyOTP;