"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jobs = require("../controllers/jobs.js");

var _classifiedJobs = require("../controllers/classifiedJobs.js");

var _authMiddleware = _interopRequireDefault(require("../middleware/authMiddleware.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import {protect} from "../middleware/authMiddleware"
var router = _express["default"].Router();

router.post('/setJob', _jobs.setJob);
router.get('/getJobs', _jobs.getJobs);
router.get('/getJobs/:id', _jobs.getOneJob);
router.post('/updateJobs/:id', _jobs.updateJob);
router["delete"]('/deleteJobs/:id', _jobs.deleteJob);
router.post('/excelToMongoDb', _jobs.ExcelToMongoDB);
router.get('/getClassifiedJobs', _classifiedJobs.getClassifiedJobs);
router.post('/setClassifiedJob', _classifiedJobs.setClassifiedJob);
router.post('/setJobsOfTheDay', _jobs.setJobsOfTheDay);
router.get('/getJobsOfTheDay', _jobs.getJobsOfTheDay);
var _default = router;
exports["default"] = _default;