"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _sms = require("../controllers/sms.js");

var _nodeCron = _interopRequireDefault(require("node-cron"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/sms', _sms.getsms);
router.get('/getall', _sms.getallsms);
router.post('/sendOtp', _sms.sendOtp);
router.post('/verifyOtp', _sms.verifyOTP);
router.post('/sendOtpAdmin', _sms.sendOtpAdmin);
var _default = router;
exports["default"] = _default;