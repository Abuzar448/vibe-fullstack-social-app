import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';
import { getAllMessages, getPreviousChats, sendMessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.post('/send/:receiverId', isAuth, upload.single('image'), sendMessage);
router.get('/getAllMessages/:receiverId',isAuth, getAllMessages);
router.get('/previousChats',isAuth,getPreviousChats);


export default router;
