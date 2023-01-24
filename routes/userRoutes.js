import  express  from "express";
import {registerUser,loginUser,Getme,getUsers,loginAdmin} from "../controllers/user.js";
//import {protect} from "../middleware/authMiddleware"
import protect from "../middleware/authMiddleware.js"
const router = express.Router();
router.post ('/users', registerUser);
router.post ('/login', loginUser);
router.post ('/loginAdmin', loginAdmin);
router.get ('/me', Getme);
router.get ('/getUsers', getUsers);

export default router;