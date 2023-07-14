import  express  from "express";
import {setJob, getJobs,getOneJob,updateJob,deleteJob,ExcelToMongoDB,getJobsOfTheDay,setJobsOfTheDay} from "../controllers/jobs.js";
import {getClassifiedJobs,setClassifiedJob} from "../controllers/classifiedJobs.js";
//import {protect} from "../middleware/authMiddleware"
import protect from "../middleware/authMiddleware.js"

const router = express.Router();
router.post ('/setJob', setJob);
router.get ('/getJobs', getJobs);
router.get('/getJobs/:id', getOneJob);
router.post('/updateJobs/:id', updateJob);
router.delete('/deleteJobs/:id', deleteJob);
router.post('/excelToMongoDb', ExcelToMongoDB);
router.get('/getClassifiedJobs', getClassifiedJobs);
router.post('/setClassifiedJob', setClassifiedJob);

router.post('/setJobsOfTheDay',setJobsOfTheDay);
router.get('/getJobsOfTheDay',getJobsOfTheDay);
export default router;