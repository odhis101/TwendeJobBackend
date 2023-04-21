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
  Subscription: {
    type: Boolean,
    "default": false
  },
  otpCode: {
    type: String
  },
  isOtpVerified: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});

var User = _mongoose["default"].model('User', userSchema);

var _default = User;
exports["default"] = _default;