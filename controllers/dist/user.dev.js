"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.registerAdmin = exports.loginAdmin = exports.getUsers = exports.Getme = exports.loginUser = exports.verifyOtpForNewUser = exports.sendOtpForNewUser = exports.sendOtpForNewAdmin = exports.verifyOtpForNewAdmin = exports.updatePasswordAdmin = exports.updateNumber = exports.deleteNumber = void 0;

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

var PATA_SMS_URL = process.env.PATA_SMS_URL;
var PATA_SMS_USERNAME = process.env.PATA_SMS_USERNAME;
var PATA_SMS_PASSWORD = process.env.PATA_SMS_PASSWORD; //const jwt = require('jsonwebtoken');

var sendOtpForNewUser = (0, _expressAsyncHandler["default"])(function _callee(req, res) {
  var _req$body, phoneNumber, password, url, username, Password, auth, userExists, otp, message, salt, hashedPassword, user, response;

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

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
            console.log(phoneNumber);
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
          _context.next = 27;
          return regeneratorRuntime.awrap(_userModels["default"].create({
            phoneNumber: phoneNumber,
            password: hashedPassword,
            otpCode: otp
          }));

        case 27:
          user = _context.sent;

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

        case 29:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.sendOtpForNewUser = sendOtpForNewUser;
var sendOtpForNewAdmin = (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var phoneNumber, url, username, Password, auth, userExists, otp, message, user, response;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          phoneNumber = req.body.phoneNumber;
          console.log(req.body);
          url = PATA_SMS_URL;
          username = PATA_SMS_USERNAME;
          Password = PATA_SMS_PASSWORD;
          auth = "Basic " + new Buffer.from(username + ":" + Password).toString("base64"); // if number start with 0 to 254

          console.log(_typeof(phoneNumber));

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(phoneNumber); // Check if user already exists with the given phone number

          _context2.next = 11;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 11:
          userExists = _context2.sent;

          if (!userExists) {
            _context2.next = 15;
            break;
          }

          res.status(400).json({
            message: ' user registered'
          });
          return _context2.abrupt("return");

        case 15:
          // Generate OTP and message body
          otp = Math.floor(100000 + Math.random() * 900000);
          message = "Your verification code is ".concat(otp);
          console.log(otp); // Store user credentials and OTP in the database

          _context2.next = 20;
          return regeneratorRuntime.awrap(_adminModels["default"].create({
            phoneNumber: phoneNumber,
            password: password,
            otpCode: otp
          }));

        case 20:
          user = _context2.sent;
          console.log(user); // Send OTP to the user

          try {
            /*
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
                "sender": 'Titan',
                "recipient": phoneNumber,
                "link_id": '',
                'bulk':1,
                "message": message,
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
            */
            console.log('sending otp');
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

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.sendOtpForNewAdmin = sendOtpForNewAdmin;
var verifyOtpForNewUser = (0, _expressAsyncHandler["default"])(function _callee3(req, res) {
  var _req$body2, phoneNumber, otp, user, timeoutId;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('we are in verifyOtpForNewUser');
          _req$body2 = req.body, phoneNumber = _req$body2.phoneNumber, otp = _req$body2.otp;

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
  var _req$body3, phoneNumber, otp, user, timeoutId;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('we are in verifyOtpForNewAdmin');
          console.log(req.body);
          _req$body3 = req.body, phoneNumber = _req$body3.phoneNumber, otp = _req$body3.otp;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          console.log(phoneNumber); // Find user by phone number and OTP

          _context4.next = 7;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber,
            otpCode: otp
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
  var _req$body4, phoneNumber, password, userExists, salt, _hashedPassword, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, phoneNumber = _req$body4.phoneNumber, password = _req$body4.password;
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
          _hashedPassword = _context5.sent;
          console.log(_hashedPassword);
          _context5.next = 19;
          return regeneratorRuntime.awrap(_adminModels["default"].create({
            phoneNumber: phoneNumber,
            password: _hashedPassword
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
  var _req$body5, phoneNumber, password, user;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body5 = req.body, phoneNumber = _req$body5.phoneNumber, password = _req$body5.password;

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
  var _req$body6, phoneNumber, password, user;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body6 = req.body, phoneNumber = _req$body6.phoneNumber, password = _req$body6.password;

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
  var _req$body7, phoneNumber, newPassword, user, salt, _hashedPassword2;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body7 = req.body, phoneNumber = _req$body7.phoneNumber, newPassword = _req$body7.newPassword;

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
          _hashedPassword2 = _context8.sent;
          user.password = _hashedPassword2;
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
  var _req$body8, phoneNumber, newPassword, user, salt, _hashedPassword3;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body8 = req.body, phoneNumber = _req$body8.phoneNumber, newPassword = _req$body8.newPassword;

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
          _hashedPassword3 = _context9.sent;
          user.password = _hashedPassword3;
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
var updateNumber = (0, _expressAsyncHandler["default"])(function _callee11(req, res) {
  var id, phoneNumber, number, updatedNumber;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          id = req.params.id;
          phoneNumber = req.body.phoneNumber;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context11.next = 5;
          return regeneratorRuntime.awrap(_userModels["default"].findById(id));

        case 5:
          number = _context11.sent;
          console.log(number);

          if (!number) {
            _context11.next = 15;
            break;
          }

          number.phoneNumber = phoneNumber;
          _context11.next = 11;
          return regeneratorRuntime.awrap(number.save());

        case 11:
          updatedNumber = _context11.sent;
          res.json(updatedNumber);
          _context11.next = 17;
          break;

        case 15:
          res.status(404);
          throw new Error('Phone number not found');

        case 17:
        case "end":
          return _context11.stop();
      }
    }
  });
});
exports.updateNumber = updateNumber;
var deleteNumber = (0, _expressAsyncHandler["default"])(function _callee12(req, res) {
  var id, deletedNumber;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          id = req.params.id;
          _context12.next = 3;
          return regeneratorRuntime.awrap(_userModels["default"].findByIdAndDelete(id));

        case 3:
          deletedNumber = _context12.sent;

          if (deletedNumber) {
            _context12.next = 7;
            break;
          }

          res.status(404);
          throw new Error("Phone number with id ".concat(id, " not found"));

        case 7:
          res.json({
            message: "Phone number ".concat(deletedNumber.number, " deleted successfully")
          });

        case 8:
        case "end":
          return _context12.stop();
      }
    }
  });
});
exports.deleteNumber = deleteNumber;
var getUsers = (0, _expressAsyncHandler["default"])(function _callee13(req, res) {
  var userExists;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(_userModels["default"].find({}));

        case 2:
          userExists = _context13.sent;
          res.status(200).json(userExists);

        case 4:
        case "end":
          return _context13.stop();
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