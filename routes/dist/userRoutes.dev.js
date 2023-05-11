"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = require("../controllers/user.js");

var _authMiddleware = _interopRequireDefault(require("../middleware/authMiddleware.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import {protect} from "../middleware/authMiddleware"
var router = _express["default"].Router();

router.post('/users', _user.sendOtpForNewUser);
router.post('/verifyOtp', _user.verifyOtpForNewUser);
router.post('/login', _user.loginUser);
router.post('/loginAdmin', _user.loginAdmin);
router.get('/me', _user.Getme);
router.get('/getUsers', _user.getUsers);
router.post('/registerAdmin', _user.registerAdmin);
router.post('/updatePassword', _user.updatePassword);
router.post('/sendOtpForNewAdmin', _user.sendOtpForNewAdmin);
router.post('/verifyOtpForNewAdmin', _user.verifyOtpForNewAdmin);
router.post('/updatePasswordAdmin', _user.updatePasswordAdmin);
router.post('/updateNumber/:id', _user.updateNumber);
router["delete"]('/deleteNumber/:id', _user.deleteNumber);
var _default = router;
exports["default"] = _default;