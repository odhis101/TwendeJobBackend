import  express  from "express";
import  {sendOtpAgainForNewUser,deleteNumber,updateNumber,updatePasswordAdmin,verifyOtpForNewAdmin,sendOtpForNewAdmin,sendOtpForNewUser,verifyOtpForNewUser,loginUser,Getme,getUsers,loginAdmin,registerAdmin,updatePassword} from "../controllers/user.js";
//import {protect} from "../middleware/authMiddleware"
import protect from "../middleware/authMiddleware.js"
const router = express.Router();
router.post ('/users', sendOtpForNewUser);
router.post('/verifyOtp', verifyOtpForNewUser)
router.post ('/login', loginUser);
router.post ('/loginAdmin', loginAdmin);
router.get ('/me', Getme);
router.get ('/getUsers', getUsers);
router.post ('/registerAdmin', registerAdmin);
router.post('/updatePassword', updatePassword);
router.post ('/sendOtpForNewAdmin', sendOtpForNewAdmin);
router.post('/verifyOtpForNewAdmin', verifyOtpForNewAdmin)
router.post('/updatePasswordAdmin', updatePasswordAdmin)
router.post('/updateNumber/:id', updateNumber)
router.delete('/deleteNumber/:id',deleteNumber)
router.post('/send-otp-again',sendOtpAgainForNewUser)


export default router;