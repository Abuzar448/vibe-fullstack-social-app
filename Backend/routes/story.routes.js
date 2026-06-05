import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { allStories, getStoryByUsername, uploadStory, viewStory } from '../controllers/story.controllers.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/upload',isAuth,upload.single('media'),uploadStory);
router.get('/view-story/:storyId',isAuth,viewStory);
router.get('/getstoryByUsername/:username',isAuth,getStoryByUsername);
router.get('/getAllStories',isAuth,allStories);

export default router;