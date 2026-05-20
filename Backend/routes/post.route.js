import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { allPosts, comment, getAllPosts, like, savedPost, uploadPost } from '../controllers/post.controllers.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/upload',isAuth,upload.single('media'),uploadPost);
router.get('/my-posts',isAuth,getAllPosts);
router.get('/like-post/:postId',isAuth,like);
router.post('/comment-post/:postId',isAuth,comment);
router.get('/save-post/:postId',isAuth,savedPost);
router.get('/all-posts',isAuth,allPosts);

export default router;


