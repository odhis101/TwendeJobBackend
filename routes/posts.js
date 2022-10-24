import  express  from "express";
import { getPost,createPost,getPosts} from "../controllers/post.js";

const router = express.Router();
router.get('/',getPost);
router.post('/', createPost);
router.get('/:id', getPosts);

export default router;