import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket : null,
    onlineUsers:null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineusers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setSocket,setOnlineusers } = socketSlice.actions;
export default socketSlice.reducer;
