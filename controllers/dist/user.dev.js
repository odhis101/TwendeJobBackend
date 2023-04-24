"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.registerAdmin = exports.loginAdmin = exports.getUsers = exports.Getme = exports.loginUser = exports.verifyOtpForNewUser = exports.sendOtpForNewUser = exports.sendOtpForNewAdmin = exports.verifyOtpForNewAdmin = exports.updatePasswordAdmin = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

var _adminModels = _interopRequireDefault(require("../models/adminModels.js"));

var _twilio = _interopRequireDefault(require("twilio"));

var _request = _interopRequireDefault(require("request"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

_dotenv["default"].config();

var PATA_SMS_URL = "https://api.patasms.com/send_one";
var PATA_SMS_USERNAME = 'twende.jobs';
var PATA_SMS_PASSWORD = 'P@ssw0rd'; //const jwt = require('jsonwebtoken');

var sendOtpForNewUser = (0, _expressAsyncHandler["default"])(function _callee(req, res) {
  var _req$body, phoneNumber, password, url, username, Password, auth, userExists, otp, message, salt, hashedPassword, response;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, phoneNumber = _req$body.phoneNumber, password = _req$body.password;
          console.log(req.body);
          url = PATA_SMS_URL;
          username = PATA_SMS_USERNAME;
          Password = PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + Password).toString("base64");
          console.log('testing here ');
          console.log(PATA_SMS_URL); // if number start with 0 to 254

          console.log(_typeof(phoneNumber));

          if (phoneNumber.startsWith('254')) {
            phoneNumber = phoneNumber.replace('254', '0');
          } // Check if user already exists with the given phone number


          _context.next = 12;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 12:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 16;
            break;
          }

          res.status(400).json({
            message: 'User already exists'
          });
          return _context.abrupt("return");

        case 16:
          // Generate OTP and message body
          otp = Math.floor(100000 + Math.random() * 900000);
          message = "Your verification code is ".concat(otp);
          console.log(otp); // Store user credentials and OTP in the database

          _context.next = 21;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 21:
          salt = _context.sent;
          _context.next = 24;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 24:
          hashedPassword = _context.sent;

          /*  
            const user = await User.create({
              phoneNumber,
              password: hashedPassword,
              otpCode:otp,
            });
            */
          //console.log(user)
          // Send OTP to the user
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
            });
            response = {
              message: "OTP sent successfully",
              data: {
                phoneNumber: phoneNumber,
                hashedPassword: hashedPassword,
                otp: otp
              }
            };
            res.status(200).json(response);
          } catch (error) {
            console.error(error);
            console.log(error);
            res.status(500).json({
              message: "An error occurred while sending OTP"
            });
          }

        case 26:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.sendOtpForNewUser = sendOtpForNewUser;
var sendOtpForNewAdmin = (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var _req$body2, phoneNumber, password, accountSid, authToken, client, userExists, otp, message, salt, hashedPassword, user, response;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, phoneNumber = _req$body2.phoneNumber, password = _req$body2.password;
          console.log(req.body);
          accountSid = "AC8c9b65406300a5fb2456e225ed765b11";
          authToken = "82d221bc3faa13adc6ea02a02924123c";
          client = (0, _twilio["default"])(accountSid, authToken); // if number start with 0 to 254

          console.log(_typeof(phoneNumber));

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          } // Check if user already exists with the given phone number


          _context2.next = 9;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 9:
          userExists = _context2.sent;

          if (!userExists) {
            _context2.next = 13;
            break;
          }

          res.status(400).json({
            message: 'User already exists'
          });
          return _context2.abrupt("return");

        case 13:
          // Generate OTP and message body
          otp = Math.floor(100000 + Math.random() * 900000);
          message = "Your verification code is ".concat(otp);
          console.log(otp); // Store user credentials and OTP in the database

          _context2.next = 18;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 18:
          salt = _context2.sent;
          _context2.next = 21;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 21:
          hashedPassword = _context2.sent;
          _context2.next = 24;
          return regeneratorRuntime.awrap(_adminModels["default"].create({
            phoneNumber: phoneNumber,
            password: hashedPassword,
            otpCode: otp
          }));

        case 24:
          user = _context2.sent;
          console.log(user); // Send OTP to the user

          try {
            /*
            await client.messages.create({
              body: message,
              from: '+15076154216',
              to: '+' + phoneNumber
            });
            */
            response = {
              message: "OTP sent successfully",
              data: {
                phoneNumber: phoneNumber,
                hashedPassword: hashedPassword,
                otp: otp
              }
            };
            res.status(200).json(response);
          } catch (error) {
            console.error(error);
            console.log(error);
            res.status(500).json({
              message: "An error occurred while sending OTP"
            });
          }

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.sendOtpForNewAdmin = sendOtpForNewAdmin;
var verifyOtpForNewUser = (0, _expressAsyncHandler["default"])(function _callee3(req, res) {
  var _req$body3, phoneNumber, otp, user, timeoutId;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('we are in verifyOtpForNewUser');
          _req$body3 = req.body, phoneNumber = _req$body3.phoneNumber, otp = _req$body3.otp;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          } // Find user by phone number and OTP


          _context3.next = 5;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber,
            otpCode: otp
          }));

        case 5:
          user = _context3.sent;

          if (user) {
            _context3.next = 9;
            break;
          }

          // User not found or OTP doesn't match, return error
          res.status(400).json({
            message: 'Invalid OTP'
          });
          return _context3.abrupt("return");

        case 9:
          if (user.isOtpVerified) {
            _context3.next = 16;
            break;
          }

          // If user hasn't logged in, delete user after 15 seconds
          timeoutId = setTimeout(function () {
            _userModels["default"].deleteOne({
              _id: user._id
            }).then(function () {
              console.log("Deleted user ".concat(user._id));
            });
          }, 15 * 1000); // 15 seconds in milliseconds
          // Mark user as logged in

          user.isOtpVerified = true;
          _context3.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          console.log(user); // Cancel the scheduled timeout

          clearTimeout(timeoutId);

        case 16:
          // Return success message
          res.status(200).json({
            message: 'OTP verification successful'
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.verifyOtpForNewUser = verifyOtpForNewUser;
var verifyOtpForNewAdmin = (0, _expressAsyncHandler["default"])(function _callee4(req, res) {
  var _req$body4, phoneNumber, otp, user, timeoutId;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('we are in verifyOtpForNewAdmin');
          console.log(req.body);
          _req$body4 = req.body, phoneNumber = _req$body4.phoneNumber, otp = _req$body4.otp;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(phoneNumber); // Find user by phone number and OTP

          _context4.next = 7;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 7:
          user = _context4.sent;
          console.log(user);

          if (user) {
            _context4.next = 12;
            break;
          }

          // User not found or OTP doesn't match, return error
          res.status(400).json({
            message: 'Invalid OTP'
          });
          return _context4.abrupt("return");

        case 12:
          if (user.isOtpVerified) {
            _context4.next = 19;
            break;
          }

          // If user hasn't logged in, delete user after 15 seconds
          timeoutId = setTimeout(function () {
            _userModels["default"].deleteOne({
              _id: user._id
            }).then(function () {
              console.log("Deleted user ".concat(user._id));
            });
          }, 15 * 1000); // 15 seconds in milliseconds
          // Mark user as logged in

          user.isOtpVerified = true;
          _context4.next = 17;
          return regeneratorRuntime.awrap(user.save());

        case 17:
          console.log(user); // Cancel the scheduled timeout

          clearTimeout(timeoutId);

        case 19:
          // Return success message
          res.status(200).json({
            message: 'OTP verification successful'
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // create admin register

exports.verifyOtpForNewAdmin = verifyOtpForNewAdmin;
var registerAdmin = (0, _expressAsyncHandler["default"])(function _callee5(req, res) {
  var _req$body5, phoneNumber, password, userExists, salt, hashedPassword, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body5 = req.body, phoneNumber = _req$body5.phoneNumber, password = _req$body5.password;
          console.log(req.body);

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context5.next = 5;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 5:
          userExists = _context5.sent;

          if (!userExists) {
            _context5.next = 10;
            break;
          }

          res.status(400);
          _context5.next = 27;
          break;

        case 10:
          _context5.next = 12;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 12:
          salt = _context5.sent;
          _context5.next = 15;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 15:
          hashedPassword = _context5.sent;
          console.log(hashedPassword);
          _context5.next = 19;
          return regeneratorRuntime.awrap(_adminModels["default"].create({
            phoneNumber: phoneNumber,
            password: hashedPassword
          }));

        case 19:
          user = _context5.sent;
          console.log(user);

          if (!user) {
            _context5.next = 25;
            break;
          }

          res.status(201).json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id)
          });
          _context5.next = 27;
          break;

        case 25:
          res.status(400);
          throw new Error('Invalid user data');

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.registerAdmin = registerAdmin;
var loginUser = (0, _expressAsyncHandler["default"])(function _callee6(req, res) {
  var _req$body6, phoneNumber, password, user;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body6 = req.body, phoneNumber = _req$body6.phoneNumber, password = _req$body6.password;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context6.next = 4;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 4:
          user = _context6.sent;
          _context6.t1 = user;

          if (!_context6.t1) {
            _context6.next = 10;
            break;
          }

          _context6.next = 9;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 9:
          _context6.t1 = _context6.sent;

        case 10:
          _context6.t0 = _context6.t1;

          if (!_context6.t0) {
            _context6.next = 13;
            break;
          }

          _context6.t0 = user.isOtpVerified;

        case 13:
          if (!_context6.t0) {
            _context6.next = 17;
            break;
          }

          res.json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id)
          });
          _context6.next = 19;
          break;

        case 17:
          res.status(401);
          throw new Error('Invalid phone number or password');

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.loginUser = loginUser;
var loginAdmin = (0, _expressAsyncHandler["default"])(function _callee7(req, res) {
  var _req$body7, phoneNumber, password, user;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body7 = req.body, phoneNumber = _req$body7.phoneNumber, password = _req$body7.password;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context7.next = 4;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 4:
          user = _context7.sent;
          // here its not user but admin 
          console.log(phoneNumber, password);
          console.log(user);
          _context7.t0 = user;

          if (!_context7.t0) {
            _context7.next = 12;
            break;
          }

          _context7.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 11:
          _context7.t0 = _context7.sent;

        case 12:
          if (!_context7.t0) {
            _context7.next = 16;
            break;
          }

          res.json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id)
          });
          _context7.next = 18;
          break;

        case 16:
          res.status(401);
          throw new Error('Invalid phone number or password');

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // crreate a signupAdmin function

exports.loginAdmin = loginAdmin;
var updatePassword = (0, _expressAsyncHandler["default"])(function _callee8(req, res) {
  var _req$body8, phoneNumber, newPassword, user, salt, hashedPassword;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body8 = req.body, phoneNumber = _req$body8.phoneNumber, newPassword = _req$body8.newPassword;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(req.body);
          _context8.next = 5;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 5:
          user = _context8.sent;
          console.log(user);

          if (!user) {
            _context8.next = 22;
            break;
          }

          _context8.next = 10;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 10:
          salt = _context8.sent;
          _context8.next = 13;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, salt));

        case 13:
          hashedPassword = _context8.sent;
          user.password = hashedPassword;
          user.isOtpVerified = true;
          _context8.next = 18;
          return regeneratorRuntime.awrap(user.save());

        case 18:
          console.log(user);
          res.json({
            message: 'Password updated successfully'
          });
          _context8.next = 23;
          break;

        case 22:
          res.status(400).json({
            message: 'User not found'
          });

        case 23:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.updatePassword = updatePassword;
var updatePasswordAdmin = (0, _expressAsyncHandler["default"])(function _callee9(req, res) {
  var _req$body9, phoneNumber, newPassword, user, salt, hashedPassword;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body9 = req.body, phoneNumber = _req$body9.phoneNumber, newPassword = _req$body9.newPassword;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(req.body);
          _context9.next = 5;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 5:
          user = _context9.sent;
          console.log(user);

          if (!user) {
            _context9.next = 22;
            break;
          }

          _context9.next = 10;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 10:
          salt = _context9.sent;
          _context9.next = 13;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, salt));

        case 13:
          hashedPassword = _context9.sent;
          user.password = hashedPassword;
          user.isOtpVerified = true;
          _context9.next = 18;
          return regeneratorRuntime.awrap(user.save());

        case 18:
          console.log(user);
          res.json({
            message: 'Password updated successfully'
          });
          _context9.next = 23;
          break;

        case 22:
          res.status(400).json({
            message: 'User not found'
          });

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.updatePasswordAdmin = updatePasswordAdmin;
var Getme = (0, _expressAsyncHandler["default"])(function _callee10(req, res) {
  var _ref, _id, phoneNumber;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(_userModels["default"].find);

        case 2:
          _ref = _context10.sent;
          _id = _ref._id;
          phoneNumber = _ref.phoneNumber;
          console.log(_id, phoneNumber);
          res.status(200).json({
            _id: _id,
            phoneNumber: phoneNumber
          });

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
});
exports.Getme = Getme;
var getUsers = (0, _expressAsyncHandler["default"])(function _callee11(req, res) {
  var userExists;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(_userModels["default"].find({}));

        case 2:
          userExists = _context11.sent;
          res.status(200).json(userExists);

        case 4:
        case "end":
          return _context11.stop();
      }
    }
  });
});
exports.getUsers = getUsers;

var generateToken = function generateToken(id) {
  return _jsonwebtoken["default"].sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};