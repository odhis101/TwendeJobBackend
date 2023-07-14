"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var callbackSchema = new _mongoose["default"].Schema({
  transactionId: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String
  },
  amount: {
    type: Number
  },
  resultDesc: {
    type: String
  } // Add other fields as needed

});

var Transactions = _mongoose["default"].model('Callback', callbackSchema);

var _default = Transactions;
exports["default"] = _default;