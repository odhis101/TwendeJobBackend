"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userSchema = _mongoose["default"].Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please enter your number']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password']
  },
  otpCode: {
    type: String
  },
  isOtpVerified: {
    type: Boolean,
    "default": false
  }
});

var Admin = _mongoose["default"].model('Admin', userSchema);

var _default = Admin;
exports["default"] = _default;