"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var postedJobs = _mongoose["default"].Schema({
  jobTitle: {
    type: String,
    "default": 'N/A' //required: [true, 'Please enter the job title'],

  },
  jobDescription: {
    type: String //required: [true, 'Please enter the job description'],

  },
  Employers_contact: {
    type: String,
    "default": 'N/A' // required: [true, 'Please enter the Employers contact'],

  },
  DeadlineDate: {
    type: Date,
    "default": 12 / 10 / 2023 // required: [false, 'Please enter the DeadlineDate'],

  },
  Category: {
    type: String,
    "default": 'N/A' // required: [true, 'Please enter the Category'],

  },
  EMPLOYER_EMAIL: {
    type: String,
    "default": 'N/A' //required: [true, 'Please enter the EMPLOYER EMAIL'],

  },
  Employers_Name: {
    type: String,
    "default": 'N/A' // required: [true, 'Please enter the Employers Name'], 

  },
  Location: {
    type: String,
    "default": 'N/A' // required: [true, 'Please enter the Location'], 

  },
  Salary: {
    type: String,
    "default": 'N/A'
  },
  createdAt: {
    type: Date,
    "default": new Date().toISOString().slice(0, 10)
  }
});

var Jobs = _mongoose["default"].model('PostedJobs', postedJobs);

var _default = Jobs;
exports["default"] = _default;