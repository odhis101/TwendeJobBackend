import express from 'express';
import { getSkills, postSkill, deleteSkill } from '../controllers/skills.js';
const router = express.Router();
router.get('/getSkill', getSkills);
router.post('/postSkill', postSkill);
router.delete('/deleteSkill/:id', deleteSkill);
export default router;