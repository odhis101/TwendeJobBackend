"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePassword = exports.registerAdmin = exports.loginAdmin = exports.getUsers = exports.Getme = exports.loginUser = exports.verifyOtpForNewUser = exports.sendOtpForNewUser = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

var _adminModels = _interopRequireDefault(require("../models/adminModels.js"));

var _twilio = _interopRequireDefault(require("twilio"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//const jwt = require('jsonwebtoken');
var sendOtpForNewUser = (0, _expressAsyncHandler["default"])(function _callee(req, res) {
  var _req$body, phoneNumber, password, accountSid, authToken, client, userExists, otp, message, salt, hashedPassword, user, response;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, phoneNumber = _req$body.phoneNumber, password = _req$body.password;
          console.log(req.body);
          accountSid = "AC8c9b65406300a5fb2456e225ed765b11";
          authToken = "82d221bc3faa13adc6ea02a02924123c";
          client = (0, _twilio["default"])(accountSid, authToken); // if number start with 0 to 254

          console.log(_typeof(phoneNumber));

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          } // Check if user already exists with the given phone number


          _context.next = 9;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 9:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 13;
            break;
          }

          res.status(400).json({
            message: 'User already exists'
          });
          return _context.abrupt("return");

        case 13:
          // Generate OTP and message body
          otp = Math.floor(100000 + Math.random() * 900000);
          message = "Your verification code is ".concat(otp);
          console.log(otp); // Store user credentials and OTP in the database

          _context.next = 18;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 18:
          salt = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 21:
          hashedPassword = _context.sent;
          _context.next = 24;
          return regeneratorRuntime.awrap(_userModels["default"].create({
            phoneNumber: phoneNumber,
            password: hashedPassword,
            otpCode: otp
          }));

        case 24:
          user = _context.sent;
          _context.prev = 25;
          _context.next = 28;
          return regeneratorRuntime.awrap(client.messages.create({
            body: message,
            from: '+15076154216',
            to: '+' + phoneNumber
          }));

        case 28:
          response = {
            message: "OTP sent successfully",
            data: {
              phoneNumber: phoneNumber,
              hashedPassword: hashedPassword,
              otp: otp
            }
          };
          res.status(200).json(response);
          _context.next = 36;
          break;

        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](25);
          console.error(_context.t0);
          res.status(500).json({
            message: "An error occurred while sending OTP"
          });

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[25, 32]]);
});
exports.sendOtpForNewUser = sendOtpForNewUser;
var verifyOtpForNewUser = (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var _req$body2, phoneNumber, otp, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, phoneNumber = _req$body2.phoneNumber, otp = _req$body2.otp;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          } // Find user by phone number and OTP


          _context2.next = 4;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber,
            otpCode: otp
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 8;
            break;
          }

          // User not found or OTP doesn't match, return error
          res.status(400).json({
            message: 'Invalid OTP'
          });
          return _context2.abrupt("return");

        case 8:
          if (!user.isOtpVerified) {
            _context2.next = 14;
            break;
          }

          // If user hasn't logged in, delete user after 10 minutes
          setTimeout(function () {
            _userModels["default"].deleteOne({
              _id: user._id
            }).then(function () {
              console.log("Deleted user ".concat(user._id));
            });
          }, 15 * 1000); // 10 minutes in milliseconds
          // Mark user as logged in

          user.isOtpVerified = true;
          _context2.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          console.log(user);

        case 14:
          // Return success message
          res.status(200).json({
            message: 'OTP verification successful'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // create admin register

exports.verifyOtpForNewUser = verifyOtpForNewUser;
var registerAdmin = (0, _expressAsyncHandler["default"])(function _callee3(req, res) {
  var _req$body3, phoneNumber, password, userExists, salt, hashedPassword, user;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, phoneNumber = _req$body3.phoneNumber, password = _req$body3.password;
          console.log(req.body);
          _context3.next = 4;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 4:
          userExists = _context3.sent;

          if (!userExists) {
            _context3.next = 9;
            break;
          }

          res.status(400);
          _context3.next = 26;
          break;

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 11:
          salt = _context3.sent;
          _context3.next = 14;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, salt));

        case 14:
          hashedPassword = _context3.sent;
          console.log(hashedPassword);
          _context3.next = 18;
          return regeneratorRuntime.awrap(_adminModels["default"].create({
            phoneNumber: phoneNumber,
            password: hashedPassword
          }));

        case 18:
          user = _context3.sent;
          console.log(user);

          if (!user) {
            _context3.next = 24;
            break;
          }

          res.status(201).json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id)
          });
          _context3.next = 26;
          break;

        case 24:
          res.status(400);
          throw new Error('Invalid user data');

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.registerAdmin = registerAdmin;
var loginUser = (0, _expressAsyncHandler["default"])(function _callee4(req, res) {
  var _req$body4, phoneNumber, password, user;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body4 = req.body, phoneNumber = _req$body4.phoneNumber, password = _req$body4.password;

          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '254');
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 4:
          user = _context4.sent;
          _context4.t1 = user;

          if (!_context4.t1) {
            _context4.next = 10;
            break;
          }

          _context4.next = 9;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 9:
          _context4.t1 = _context4.sent;

        case 10:
          _context4.t0 = _context4.t1;

          if (!_context4.t0) {
            _context4.next = 13;
            break;
          }

          _context4.t0 = user.isOtpVerified;

        case 13:
          if (!_context4.t0) {
            _context4.next = 17;
            break;
          }

          res.json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id)
          });
          _context4.next = 19;
          break;

        case 17:
          res.status(401);
          throw new Error('Invalid phone number or password');

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.loginUser = loginUser;
var loginAdmin = (0, _expressAsyncHandler["default"])(function _callee5(req, res) {
  var _req$body5, phoneNumber, password, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body5 = req.body, phoneNumber = _req$body5.phoneNumber, password = _req$body5.password;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_adminModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 3:
          user = _context5.sent;
          // here its not user but admin 
          console.log(phoneNumber, password);
          console.log(user);
          _context5.t0 = user;

          if (!_context5.t0) {
            _context5.next = 11;
            break;
          }

          _context5.next = 10;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 10:
          _context5.t0 = _context5.sent;

        case 11:
          if (!_context5.t0) {
            _context5.next = 15;
            break;
          }

          res.json({
            _id: user._id,
            phoneNumber: user.phoneNumber,
            password: user.password,
            token: generateToken(user._id)
          });
          _context5.next = 17;
          break;

        case 15:
          res.status(401);
          throw new Error('Invalid phone number or password');

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // crreate a signupAdmin function

exports.loginAdmin = loginAdmin;
var updatePassword = (0, _expressAsyncHandler["default"])(function _callee6(req, res) {
  var _req$body6, phoneNumber, newPassword, user, salt, hashedPassword;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body6 = req.body, phoneNumber = _req$body6.phoneNumber, newPassword = _req$body6.newPassword;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_userModels["default"].findOne({
            phoneNumber: phoneNumber
          }));

        case 3:
          user = _context6.sent;

          if (!user) {
            _context6.next = 16;
            break;
          }

          _context6.next = 7;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 7:
          salt = _context6.sent;
          _context6.next = 10;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, salt));

        case 10:
          hashedPassword = _context6.sent;
          _context6.next = 13;
          return regeneratorRuntime.awrap(_adminModels["default"].updateOne({
            phoneNumber: phoneNumber
          }, {
            password: hashedPassword
          }));

        case 13:
          res.json({
            message: 'Password updated successfully'
          });
          _context6.next = 18;
          break;

        case 16:
          res.status(401);
          throw new Error('User not found');

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.updatePassword = updatePassword;
var Getme = (0, _expressAsyncHandler["default"])(function _callee7(req, res) {
  var _ref, _id, phoneNumber;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(_userModels["default"].find);

        case 2:
          _ref = _context7.sent;
          _id = _ref._id;
          phoneNumber = _ref.phoneNumber;
          console.log(_id, phoneNumber);
          res.status(200).json({
            _id: _id,
            phoneNumber: phoneNumber
          });

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.Getme = Getme;
var getUsers = (0, _expressAsyncHandler["default"])(function _callee8(req, res) {
  var userExists;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(_userModels["default"].find({}));

        case 2:
          userExists = _context8.sent;
          res.status(200).json(userExists);

        case 4:
        case "end":
          return _context8.stop();
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