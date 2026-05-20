import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { getStoryByUsername, uploadStory, viewStory } from '../controllers/story.controllers.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/upload',isAuth,upload.single('media'),uploadStory);
router.get('/view-story/:storyId',isAuth,viewStory);
router.get('/story/:username',isAuth,getStoryByUsername);

export default router;