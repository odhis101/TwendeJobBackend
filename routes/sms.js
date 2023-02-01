import  express  from "express";
import {getsms,sendsms,call_back} from "../controllers/sms.js";

const router = express.Router();
router.post ('/sms', getsms);
router.post('/sendsms', sendsms)
router.get ('/callback', call_back);
export default router;