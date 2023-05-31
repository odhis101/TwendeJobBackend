"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var consumer_key = 'R2kA2Avi3cOFAdkdvR7zVgOZjKibRCOm';
var consumer_secret = 'h2gwMdxszxc2tJ35';

var getaccess_token = function getaccess_token() {
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

var generateTimestamp = function generateTimestamp() {
  var date = new Date();
  var timestamp = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + (date.getDate() + 1)).slice(-2) + ("0" + (date.getHours() + 1)).slice(-2) + ("0" + (date.getMinutes() + 1)).slice(-2) + ("0" + (date.getSeconds() + 1)).slice(-2);
  return timestamp;
};

var makeSTKPushRequest = function makeSTKPushRequest(number, amount) {
  var url, access_token, auth, passkey, timestamp, Passwords;
  return regeneratorRuntime.async(function makeSTKPushRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; // Get the access token using your preferred method

          _context.next = 4;
          return regeneratorRuntime.awrap(getaccess_token());

        case 4:
          access_token = _context.sent;
          // Replace with your access token retrieval code
          console.log(access_token);
          auth = "Bearer " + access_token;
          console.log(auth);
          passkey = '3e05a5eb019d9bc8cb1eb2045e0bff9e6b46279ca5e57d87356ae07bc6308d70';
          timestamp = generateTimestamp();
          Passwords = Buffer.from("494977" + passkey + timestamp).toString('base64');
          console.log(Passwords);
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
              "CallBackURL": "https://twendejob-backend.oa.r.appspot.com/daraja/stk_callback?number=".concat(number, "&amount=").concat(amount),
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
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw new Error("An error occurred while processing the STK push request");

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};
/*
const access_token = await getaccess_token();
console.log('hello')
makeDarajaAPIRequest('0703757369', 1, access_token);
//console.log(access_token)
*/


makeSTKPushRequest('254703757369', 1);