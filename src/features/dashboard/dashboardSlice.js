import { createSlice } from "@reduxjs/toolkit";

import Img1 from "../../assets/img-1.png";
import Img2 from "../../assets/img-2.png";

const initialState = {
  isDrawerOpen: false,
  isLeftDrawer: true,
  showImage: { show: false, id: 0 },
  chatList: [],
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setLeftDrawer: (state) => {
      state.isLeftDrawer = !state.isLeftDrawer;
    },
    setImage: (state, { payload }) => {
      state.showImage = payload;
    },
    removeImage: (state) => {
      state.showImage = { show: false, id: 0 };
    },
    addNewQuestion: (state, { payload }) => {
      const tmpList = [...state.chatList];
      payload = {
        ...payload,
        id: tmpList.length + 1,
        response: "",
        images: [],
      };
      tmpList.push(payload);
      state.chatList = tmpList;
    },
    updateResponse: (state, { payload }) => {
      const pos = payload.id - 1;
      const pChat = {
        ...state.chatList[pos],
        response: payload.response,
      };
      state.chatList[pos] = pChat;
    },
    updateResponseImages: (state, { payload }) => {
      const pos = payload.id - 1;
      const pChat = {
        ...state.chatList[pos],
        images: payload.images,
      };
      state.chatList[pos] = pChat;
    },
  },
});

export const {
  setDrawer,
  setLeftDrawer,
  setImage,
  removeImage,
  addNewQuestion,
  updateResponse,
  updateResponseImages,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
