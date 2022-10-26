import  express  from "express";
import {registerUser,loginUser,Getme} from "../controllers/user.js";
const router = express.Router();
router.post ('/users', registerUser);
router.post ('/login', loginUser);
router.get ('/me', Getme);

export default router;