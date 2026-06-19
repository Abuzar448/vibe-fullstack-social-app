import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/DB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import reelRouter from './routes/reel.route.js';
import storyRouter from './routes/story.routes.js';
import messageRouter from './routes/message.route.js';
import { app, server } from './socket.js';

dotenv.config();

const PORT = process.env.PORT;

connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server');
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/post/', postRouter);
app.use('/api/reel/', reelRouter);
app.use('/api/story/', storyRouter);
app.use('/api/message/',messageRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});