import  express  from "express";
import {getsms,call_back,getallsms} from "../controllers/sms.js";
import cron from 'node-cron';

const router = express.Router();
router.post ('/sms', getsms);
router.get ('/getall', getallsms);
//router.get ('sendsms', sendsms);
//router.post('/sendsms', sendsms)

// run a cron job every minute
/*
cron.schedule('* * * * * *', () => {
    console.log('Task running every 20 seconds');
  });
*/

router.get ('/callback', call_back);
export default router;