"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var postedJobsOfTheDay = _mongoose["default"].Schema({
  jobTitle: {
    type: String,
    required: [true, 'Please enter the job title']
  },
  jobDescription: {
    type: String,
    required: [true, 'Please enter the job description']
  },
  Employers_contact: {
    type: String,
    required: [true, 'Please enter the Employers contact']
  },
  DeadlineDate: {
    type: Date,
    required: [false, 'Please enter the DeadlineDate']
  },
  Category: {
    type: String,
    required: [true, 'Please enter the Category']
  },
  EMPLOYER_EMAIL: {
    type: String,
    required: [true, 'Please enter the EMPLOYER EMAIL']
  },
  Employers_Name: {
    type: String,
    required: [true, 'Please enter the Employers Name']
  },
  Location: {
    type: String,
    required: [true, 'Please enter the Location']
  },
  Requirment: {
    type: String
  },
  Salary: {
    type: String
  },
  createdAt: {
    type: Date,
    "default": new Date().toISOString().slice(0, 10)
  }
});

var JobsOfTheDay = _mongoose["default"].model('postedJobsOfTheDay', postedJobsOfTheDay);

var _default = JobsOfTheDay;
exports["default"] = _default;