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
router.get('/getall', _sms.getallsms); //router.get ('sendsms', sendsms);
//router.post('/sendsms', sendsms)
// run a cron job every minute

/*
cron.schedule('* * * * * *', () => {
    console.log('Task running every 20 seconds');
  });
*/

router.get('/callback', _sms.call_back);
var _default = router;
exports["default"] = _default;