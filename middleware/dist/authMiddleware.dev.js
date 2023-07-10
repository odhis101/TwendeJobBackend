"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var protect = function protect(req, res, next) {
  var token, decoded;
  return regeneratorRuntime.async(function protect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
            _context.next = 8;
            break;
          }

          token = req.headers.authorization.split(' ')[1];
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
          console.log("this is decoded", decoded);
          _context.next = 7;
          return regeneratorRuntime.awrap(_userModels["default"].findById(decoded.id));

        case 7:
          req.user = _context.sent;

        case 8:
          if (token) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            message: 'Not authorized, no token'
          }));

        case 10:
          next();
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(401).json({
            message: 'Not authorized, token failed'
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var _default = protect;
exports["default"] = _default;