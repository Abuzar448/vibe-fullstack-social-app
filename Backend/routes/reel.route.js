import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { myReels, comment, like, uploadLoop, allReels } from '../controllers/loop.controllers.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/upload',isAuth,upload.single('media'),uploadLoop);
router.get('/my-reels',isAuth,myReels);
router.get('/like-reel/:reelId',isAuth,like);
router.post('/comment-reel/:reelId',isAuth,comment);
router.get('/all-reels',isAuth,allReels);



export default router;