import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice.js';
import postSlice from './postSlice.js';
import loopSlice from './loopSlice.js';
import storySlice from './storySlice.js';

const store = configureStore({
  reducer: {
    user:userSlice,
    post:postSlice,
    loop:loopSlice,
    story:storySlice,
  }
});

export default store;