"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _request = _interopRequireDefault(require("request"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _darajaModels = _interopRequireDefault(require("../models/darajaModels.js"));

var _daraja = require("../controllers/daraja.js");

var _mongoose = require("mongoose");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var router = _express["default"].Router();

var consumer_key = 'R2kA2Avi3cOFAdkdvR7zVgOZjKibRCOm';
var consumer_secret = 'h2gwMdxszxc2tJ35';
var Backend_url = 'https://twendejob-backend.oa.r.appspot.com';

_dotenv["default"].config();

var url1 = process.env.PATA_SMS_URL;
var username1 = process.env.PATA_SMS_USERNAME;
var password1 = process.env.PATA_SMS_PASSWORD;
var auth1 = "Basic " + new Buffer.from(username1 + ":" + password1).toString("base64");
router.get('/access_token', getaccess_token, function (req, res) {
  res.status(200).json({
    access_token: req.access_token
  });
});
router.get('/register', getaccess_token, function (req, res) {
  var url = "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl";
  var auth = "Bearer " + req.access_token;
  console.log(auth);
  (0, _request["default"])({
    url: url,
    method: "POST",
    headers: {
      "Authorization": auth
    },
    json: {
      "ShortCode": "494977",
      "ResponseType": "Completed",
      "ConfirmationURL": "".concat(Backend_url, "/daraja/confirmation"),
      // chang
      "ValidationURL": "".concat(Backend_url, "/daraja/validation")
    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json(body);
    }
  });
});

function getaccess_token(req, res, next) {
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
    } else {
      //console.log('here is the body ',body);
      req.access_token = JSON.parse(body).access_token; //console.log(req.IncomingMessage) 

      next();
    }
  });
} //console.log(getaccess_token())


router.get('/confirmation', getaccess_token, function (req, res) {
  //let mpesa_resp = ;
  res.status(200).json({
    request: req.body
  });
});
router.post('/validation', getaccess_token, function (req, res) {
  console.log('validation');
  console.log(req.body); //res.status(200).send("User Page");
});
router.post('/getdata', getaccess_token, function (req, res) {
  //res.status(200).send("User Page");
  console.log(req.body);
});
router.get('/simulate', getaccess_token, function (req, res) {
  var url = "https://api.safaricom.co.ke/mpesa/c2b/v1/simulate";
  var auth = "Bearer " + req.access_token;
  (0, _request["default"])({
    url: url,
    method: "POST",
    headers: {
      "Authorization": auth
    },
    json: {
      "ShortCode": "600987",
      "CommandID": "CustomerPayBillOnline",
      "Amount": "1",
      "Msisdn": "254708374149",
      "BillRefNumber": "twendejob"
    }
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      res.status(200).json(body);
    }
  });
});

var middleware = function middleware(req, res, next) {
  req.name = "lahiru";
  next();
};

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

var generateTimestamp = function generateTimestamp() {
  var date = new Date();
  var timestamp = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + (date.getDate() + 1)).slice(-2) + ("0" + (date.getHours() + 1)).slice(-2) + ("0" + (date.getMinutes() + 1)).slice(-2) + ("0" + (date.getSeconds() + 1)).slice(-2);
  return timestamp;
};

router.post('/stkpush', middleware, getaccess_token, (0, _expressAsyncHandler["default"])(function _callee(req, res) {
  var url, auth, _req$body, number, amount, id, passkey, timestamp, Passwords;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
          auth = "Bearer " + req.access_token;
          _req$body = req.body, number = _req$body.number, amount = _req$body.amount, id = _req$body.id;
          passkey = '3e05a5eb019d9bc8cb1eb2045e0bff9e6b46279ca5e57d87356ae07bc6308d70';
          timestamp = generateTimestamp();
          Passwords = new Buffer.from("494977" + passkey + timestamp).toString('base64');
          console.log(timestamp);
          console.log(_typeof(timestamp));
          (0, _request["default"])({
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
              "CallBackURL": "https://twendejob-backend.oa.r.appspot.com/daraja/stk_callback?number=" + id + "&amount=" + amount,
              "AccountReference": "Twendejob",
              "TransactionDesc": "Twendejob Subscription"
            }
          }, function (error, response, body) {
            if (error) {
              console.log(error);
            } else {
              res.status(200).json(body);
              console.log(response);
            }
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}));
router.post('/subscriptions', _daraja.Getsubscribers);
router.get('/Allsubscriptions', _daraja.GetAllsubscribers);
router["delete"]('/Deletesubscribers/:id', _daraja.Deletesubscribers);
router.post('/stk_callback', middleware, (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var id, amount, linkId, daysToExpiry, today, expiry, Subscription;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log('this is testing confirmation');
          console.log('test2');
          id = req.query.number;
          amount = req.query.amount;
          linkId = req.query.linkId;
          console.log(req.query);
          console.log(_typeof(amount));
          daysToExpiry = 0;
          _context2.t0 = amount;
          _context2.next = _context2.t0 === '85' ? 11 : _context2.t0 === '250' ? 13 : 15;
          break;

        case 11:
          daysToExpiry = 7;
          return _context2.abrupt("break", 16);

        case 13:
          daysToExpiry = 30;
          return _context2.abrupt("break", 16);

        case 15:
          daysToExpiry = 0;

        case 16:
          today = new Date().toISOString().slice(0, 10);
          console.log(daysToExpiry);
          expiry = addDays(today, daysToExpiry).toISOString().slice(0, 10);
          console.log(expiry);
          console.log(req.body.Body);

          if (!(req.body.Body.stkCallback.ResultDesc === 'The service request is processed successfully.')) {
            _context2.next = 28;
            break;
          }

          _context2.next = 24;
          return regeneratorRuntime.awrap(_darajaModels["default"].create({
            phoneNumber: id,
            Subscription: true,
            lengthOfSubscription: daysToExpiry,
            amount: amount,
            SubscriptionDate: today,
            expiry: expiry
          }));

        case 24:
          Subscription = _context2.sent;
          (0, _request["default"])({
            method: "POST",
            url: url1,
            path: '/send',
            'maxRedirects': 20,
            headers: {
              "Authorization": auth1,
              "Content-Type": "application/json",
              'Cookie': 'CAKEPHP=207vs9u597a35i68b2eder2jvn'
            },
            json: {
              "sender": "TWENDEJOBS",
              "recipient": phoneNumber,
              "link_id": '',
              'bulk': 1,
              "message": "Welcome to Kazi Chap!  Tailored job tips, Kazi match, and instant notifications. Your journey to opportunities starts here. Enjoy!"
            }
          }, function (error, response, body) {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          });
          _context2.next = 29;
          break;

        case 28:
          console.log('canceled by the user ');

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  });
}));
var _default = router;
exports["default"] = _default;