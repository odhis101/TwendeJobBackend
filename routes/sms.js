import  express  from "express";
import {getsms} from "../controllers/sms.js";

const router = express.Router();
router.post ('/sms', getsms);
export default router;