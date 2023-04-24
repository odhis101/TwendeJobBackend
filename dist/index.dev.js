"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _cors = _interopRequireDefault(require("cors"));

var _posts = _interopRequireDefault(require("./routes/posts.js"));

var _userRoutes = _interopRequireDefault(require("./routes/userRoutes.js"));

var _jobRoutes = _interopRequireDefault(require("./routes/jobRoutes.js"));

var _daraja = _interopRequireDefault(require("./routes/daraja.js"));

var _skillRoutes = _interopRequireDefault(require("./routes/skillRoutes.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _sms = _interopRequireDefault(require("./routes/sms.js"));

var _expressFileupload = _interopRequireDefault(require("express-fileupload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import jobRoutes from './routes/jobRoutes.js';
var app = (0, _express["default"])();

_dotenv["default"].config();

app.use(_bodyParser["default"].json({
  limit: "30mb",
  extended: true
}));
app.use(_bodyParser["default"].urlencoded({
  limit: "30mb",
  extended: true
}));
app.use((0, _cors["default"])());
app.use((0, _expressFileupload["default"])());
app.use('/posts', _posts["default"]);
app.use('/users', _userRoutes["default"]);
app.use('/jobs', _jobRoutes["default"]);
app.use('/daraja', _daraja["default"]);
app.use('/messages', _sms["default"]);
app.use('/skills', _skillRoutes["default"]);
var CONNECTION_URL = 'mongodb+srv://odhis101:natasha12@cluster0.r1d9hq1.mongodb.net/?retryWrites=true&w=majority';
var PORT = process.env.PORT || 8080;
var now = new Date();
var hours = now.getHours();
var minutes = now.getMinutes();
console.log("The time i s ".concat(hours, ":").concat(minutes));

_mongoose["default"].connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return app.listen(PORT, function () {
    return console.log("Server running on port: ".concat(PORT));
  });
})["catch"](function (error) {
  return console.log(error.message);
});