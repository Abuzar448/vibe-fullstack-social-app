import express from 'express';
import { editProfile, getCurrentUser, getProfile, suggestedUsers } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { Follow } from '../controllers/post.controllers.js';

const router = express.Router();

router.get('/current', isAuth, getCurrentUser);
router.get('/suggested',isAuth,suggestedUsers);
router.post('/editProfile',isAuth,upload.single('profilePicture'),editProfile);
router.get('/getProfile/:username',isAuth,getProfile);
router.get('/follow/:id',isAuth,Follow);


export default router;
