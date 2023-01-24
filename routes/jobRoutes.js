import  express  from "express";
import {setJob, getJobs,getOneJob,updateJob,deleteJob,ExcelToMongoDB} from "../controllers/jobs.js";
//import {protect} from "../middleware/authMiddleware"
import protect from "../middleware/authMiddleware.js"
const router = express.Router();
router.post ('/setJob', setJob);
router.get ('/getJobs', getJobs);
router.get('/getJobs/:id', getOneJob);
router.get('/updateJobs/:id', updateJob);
router.delete('/deleteJobs/:id', deleteJob);
router.post('/excelToMongoDb', ExcelToMongoDB);

export default router;