"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var smsText = _mongoose["default"].Schema({
  phoneNumber: {
    type: String,
    required: [false, 'Please enter the phoneNumber']
  },
  messageText: {
    type: String,
    required: [true, 'Please enter the message']
  },
  createdAt: {
    type: Date,
    "default": new Date().toISOString().slice(0, 10)
  }
});

var SmsText = _mongoose["default"].model('smsText', smsText);

var _default = SmsText;
exports["default"] = _default;