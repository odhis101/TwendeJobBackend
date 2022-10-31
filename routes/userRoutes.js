import  express  from "express";
import {registerUser,loginUser,Getme} from "../controllers/user.js";
//import {protect} from "../middleware/authMiddleware"
import protect from "../middleware/authMiddleware.js"
const router = express.Router();
router.post ('/users', registerUser);
router.post ('/login', loginUser);
router.get ('/me',protect , Getme);

export default router;