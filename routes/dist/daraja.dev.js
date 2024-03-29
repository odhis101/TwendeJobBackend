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

var _mpesaModels = _interopRequireDefault(require("../models/mpesaModels.js"));

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

router.post('/stkpush', getaccess_token, (0, _expressAsyncHandler["default"])(function _callee(req, res) {
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
router.post('/stk_callback', (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var _req$body$Body$stkCal, CheckoutRequestID, PhoneNumber, Amount, ResultDesc, transactionId, existingCallback, newCallback, id, amount, linkId, daysToExpiry, today, expiry, Subscription;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body$Body$stkCal = req.body.Body.stkCallback, CheckoutRequestID = _req$body$Body$stkCal.CheckoutRequestID, PhoneNumber = _req$body$Body$stkCal.PhoneNumber, Amount = _req$body$Body$stkCal.Amount, ResultDesc = _req$body$Body$stkCal.ResultDesc;
          transactionId = req.body.Body.stkCallback.CheckoutRequestID;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_mpesaModels["default"].findOne({
            transactionId: transactionId
          }));

        case 4:
          existingCallback = _context2.sent;

          if (!existingCallback) {
            _context2.next = 8;
            break;
          }

          console.log("Duplicate callback received for transaction ID: ".concat(transactionId));
          return _context2.abrupt("return", res.status(200).end());

        case 8:
          newCallback = new _mpesaModels["default"]({
            transactionId: CheckoutRequestID,
            phoneNumber: PhoneNumber,
            amount: Amount,
            resultDesc: ResultDesc // Add more fields as needed

          });
          _context2.next = 11;
          return regeneratorRuntime.awrap(newCallback.save());

        case 11:
          console.log('this is testing confirmation');
          console.log('test2');
          id = req.query.number;
          amount = req.query.amount;
          linkId = req.query.linkId;
          console.log(req.query);
          console.log(_typeof(amount));
          daysToExpiry = 0;
          console.log(req.body); //const transactionId = req.body.Body.stkCallback.CheckoutRequestID;

          _context2.t0 = amount;
          _context2.next = _context2.t0 === '100' ? 23 : _context2.t0 === '250' ? 25 : 27;
          break;

        case 23:
          daysToExpiry = 7;
          return _context2.abrupt("break", 28);

        case 25:
          daysToExpiry = 30;
          return _context2.abrupt("break", 28);

        case 27:
          daysToExpiry = 0;

        case 28:
          today = new Date().toISOString().slice(0, 10);
          console.log(daysToExpiry);
          expiry = addDays(today, daysToExpiry).toISOString().slice(0, 10);
          console.log(expiry);
          console.log(req.body.Body);

          if (!(req.body.Body.stkCallback.ResultDesc === 'The service request is processed successfully.')) {
            _context2.next = 40;
            break;
          }

          _context2.next = 36;
          return regeneratorRuntime.awrap(_darajaModels["default"].create({
            phoneNumber: id,
            Subscription: true,
            lengthOfSubscription: daysToExpiry,
            amount: amount,
            SubscriptionDate: today,
            expiry: expiry
          }));

        case 36:
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
              "recipient": id,
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
          _context2.next = 41;
          break;

        case 40:
          // send a message that we have failed to subscribe
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
              "recipient": id,
              "link_id": '',
              'bulk': 1,
              "message": "Sorry, we were unable to process your subcription. Please try again later"
            }
          }, function (error, response, body) {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          });

        case 41:
        case "end":
          return _context2.stop();
      }
    }
  });
}));
var _default = router;
exports["default"] = _default;