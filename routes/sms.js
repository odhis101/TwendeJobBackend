import  express  from "express";
import {getSms} from "../controllers/sms.js";
const router = express.Router();
router.post ('/sms', getSms);
export default router;