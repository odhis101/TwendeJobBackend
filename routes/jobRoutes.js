import  express  from "express";
import {setJob, getJobs,getOneJob} from "../controllers/jobs.js";
//import {protect} from "../middleware/authMiddleware"
import protect from "../middleware/authMiddleware.js"
const router = express.Router();
router.post ('/setJob', setJob);
router.get ('/getJobs', getJobs);
router.get('/getJobs/:id', getOneJob);


export default router;