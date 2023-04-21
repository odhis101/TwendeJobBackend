import  express  from "express";
import {sendOtpForNewUser,verifyOtpForNewUser,loginUser,Getme,getUsers,loginAdmin,registerAdmin,updatePassword,} from "../controllers/user.js";
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

export default router;