"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setJobsOfTheDay = exports.getJobsOfTheDay = exports.ExcelToMongoDB = exports.deleteJob = exports.updateJob = exports.getOneJob = exports.getJobs = exports.setJob = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _userModels = _interopRequireDefault(require("../models/userModels.js"));

var _JobsModel = _interopRequireDefault(require("../models/JobsModel.js"));

var _JobsofTheDay = _interopRequireDefault(require("../models/JobsofTheDay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getJobsOfTheDay = (0, _expressAsyncHandler["default"])(function _callee(req, res) {
  var JobExists;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_JobsofTheDay["default"].find({}));

        case 2:
          JobExists = _context.sent;
          res.status(200).json(JobExists);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getJobsOfTheDay = getJobsOfTheDay;
var setJobsOfTheDay = (0, _expressAsyncHandler["default"])(function _callee2(req, res) {
  var _req$body, jobTitle, jobDescription, Employers_contact, DeadlineDate, Category, EMPLOYER_EMAIL, Employers_Name, Location, Requirment, Salary, existingJob;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, jobTitle = _req$body.jobTitle, jobDescription = _req$body.jobDescription, Employers_contact = _req$body.Employers_contact, DeadlineDate = _req$body.DeadlineDate, Category = _req$body.Category, EMPLOYER_EMAIL = _req$body.EMPLOYER_EMAIL, Employers_Name = _req$body.Employers_Name, Location = _req$body.Location, Requirment = _req$body.Requirment, Salary = _req$body.Salary;
          console.log('this is the data we got ', req.body);

          if (!(!jobTitle || !jobDescription || !Employers_contact || !Category || !EMPLOYER_EMAIL || !Employers_Name)) {
            _context2.next = 5;
            break;
          }

          res.status(400);
          throw new Error('Please add a text field');

        case 5:
          console.log(Requirment); // Assuming you have an existing job instance, you can update it like this:

          _context2.next = 8;
          return regeneratorRuntime.awrap(_JobsofTheDay["default"].findOneAndUpdate({
            /* Find the existing job based on your criteria */
          }, {
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            Employers_contact: Employers_contact,
            DeadlineDate: DeadlineDate,
            Category: Category,
            EMPLOYER_EMAIL: EMPLOYER_EMAIL,
            Location: Location,
            Employers_Name: Employers_Name,
            Requirment: Requirment,
            Salary: Salary
          }, {
            "new": true
          } // This option returns the updated job instance
          ));

        case 8:
          existingJob = _context2.sent;

          if (existingJob) {
            _context2.next = 12;
            break;
          }

          res.status(404);
          throw new Error('Job not found');

        case 12:
          console.log(existingJob);
          res.status(200).json(existingJob);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.setJobsOfTheDay = setJobsOfTheDay;
var getJobs = (0, _expressAsyncHandler["default"])(function _callee3(req, res) {
  var JobExists;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_JobsModel["default"].find({}));

        case 2:
          JobExists = _context3.sent;
          res.status(200).json(JobExists);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getJobs = getJobs;
var setJob = (0, _expressAsyncHandler["default"])(function _callee4(req, res) {
  var _req$body2, user, jobTitle, jobDescription, Employers_contact, DeadlineDate, Category, EMPLOYER_EMAIL, Employers_Name, Location, job;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, user = _req$body2.user, jobTitle = _req$body2.jobTitle, jobDescription = _req$body2.jobDescription, Employers_contact = _req$body2.Employers_contact, DeadlineDate = _req$body2.DeadlineDate, Category = _req$body2.Category, EMPLOYER_EMAIL = _req$body2.EMPLOYER_EMAIL, Employers_Name = _req$body2.Employers_Name, Location = _req$body2.Location;

          if (!(!jobTitle, !jobDescription, !Employers_contact, !DeadlineDate, !Category, !EMPLOYER_EMAIL, !Employers_Name)) {
            _context4.next = 4;
            break;
          }

          res.status(400);
          throw new Error('Please add a text field');

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(_JobsModel["default"].create({
            user: user,
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            Employers_contact: Employers_contact,
            DeadlineDate: DeadlineDate,
            Category: Category,
            EMPLOYER_EMAIL: EMPLOYER_EMAIL,
            Location: Location,
            Employers_Name: Employers_Name
          }));

        case 6:
          job = _context4.sent;
          res.status(200).json(job);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.setJob = setJob;
var getOneJob = (0, _expressAsyncHandler["default"])(function _callee5(req, res) {
  var _id, JobExists;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_JobsModel["default"].findById(_id));

        case 3:
          JobExists = _context5.sent;
          res.status(200).json(JobExists);

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.getOneJob = getOneJob;
var updateJob = (0, _expressAsyncHandler["default"])(function _callee6(req, res) {
  var _id, JobExists, updatedJob;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _id = req.params.id; //console.log(_id)

          console.log(_id);
          console.log('this is the data we got ', req.body);
          _context6.next = 5;
          return regeneratorRuntime.awrap(_JobsModel["default"].findById(_id));

        case 5:
          JobExists = _context6.sent;

          if (!JobExists) {
            _context6.next = 20;
            break;
          }

          console.log('it exists ');
          JobExists.jobTitle = req.body.jobTitle || JobExists.jobTitle;
          JobExists.jobDescription = req.body.jobDescription || JobExists.jobDescription;
          JobExists.Employers_contact = req.body.Employers_contact || JobExists.Employers_contact;
          JobExists.DeadlineDate = req.body.DeadlineDate || JobExists.DeadlineDate;
          JobExists.Category = req.body.Category || JobExists.Category;
          JobExists.EMPLOYER_EMAIL = req.body.EMPLOYER_EMAIL || JobExists.EMPLOYER_EMAIL;
          JobExists.Employers_Name = req.body.Employers_Name || JobExists.Employers_Name;
          _context6.next = 17;
          return regeneratorRuntime.awrap(JobExists.save());

        case 17:
          updatedJob = _context6.sent;
          _context6.next = 22;
          break;

        case 20:
          res.status(404);
          throw new Error('Job not found');

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.updateJob = updateJob;
var deleteJob = (0, _expressAsyncHandler["default"])(function _callee7(req, res) {
  var _id, JobExists;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _id = req.params.id;
          console.log(_id);
          console.log(req.body);
          _context7.next = 5;
          return regeneratorRuntime.awrap(_JobsModel["default"].findById(_id));

        case 5:
          JobExists = _context7.sent;

          if (!JobExists) {
            _context7.next = 12;
            break;
          }

          _context7.next = 9;
          return regeneratorRuntime.awrap(JobExists.remove());

        case 9:
          res.json({
            message: 'Job removed'
          });
          _context7.next = 14;
          break;

        case 12:
          res.status(404);
          throw new Error('Job not found');

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.deleteJob = deleteJob;
var ExcelToMongoDB = (0, _expressAsyncHandler["default"])(function _callee8(req, res) {
  var i, data, start_date, numDate, APPLICATIONS_DEADLINE_DATE, deadlineDate, Employers_Name, EMPLOYER_EMAIL, Employers_contact, jobTitle, jobDescription, Category, job;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log("bub");
          console.log(req.body); // looping through the json data to save in jobs collection

          i = 0;

        case 3:
          if (!(i < req.body.length)) {
            _context8.next = 31;
            break;
          }

          data = req.body[i]; //console.log(data);

          console.log(data);
          start_date = data.Start_Date;
          numDate = new Date(start_date).toISOString().slice(0, 10);
          console.log(numDate);
          APPLICATIONS_DEADLINE_DATE = data.APPLICATIONS_DEADLINE_DATE;
          deadlineDate = new Date(APPLICATIONS_DEADLINE_DATE).toISOString().slice(0, 10);
          console.log(deadlineDate);
          Employers_Name = data.Employers_Name;
          EMPLOYER_EMAIL = data.EMPLOYERS_EMAIL;
          Employers_contact = data.Employers_Contact;
          jobTitle = data.Job_Post_Title;
          jobDescription = data.Job_Description;
          Category = data.Job_category;
          console.log(jobTitle);

          if (!(!jobTitle, !jobDescription, !Employers_contact, !deadlineDate, !Category, !EMPLOYER_EMAIL, !Employers_Name)) {
            _context8.next = 24;
            break;
          }

          res.status(400);
          throw new Error('Please add a text field');

        case 24:
          _context8.next = 26;
          return regeneratorRuntime.awrap(_JobsModel["default"].create({
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            Employers_contact: Employers_contact,
            DeadlineDate: deadlineDate,
            Category: Category,
            EMPLOYER_EMAIL: EMPLOYER_EMAIL,
            Employers_Name: Employers_Name,
            Start_Date: numDate
          }));

        case 26:
          job = _context8.sent;
          res.status(200).json(job);

        case 28:
          i++;
          _context8.next = 3;
          break;

        case 31:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.ExcelToMongoDB = ExcelToMongoDB;