import  express  from "express";
import {getsms,call_back,getallsms,sendOtp,verifyOTP,sendOtpAdmin} from "../controllers/sms.js";
import cron from 'node-cron';

const router = express.Router();
router.post ('/sms', getsms);
router.get ('/getall', getallsms);
router.post ('/sendOtp', sendOtp);
router.post ('/verifyOtp', verifyOTP);
router.post ('/sendOtpAdmin', sendOtpAdmin);
export default router;