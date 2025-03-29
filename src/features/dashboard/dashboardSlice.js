import { createSlice } from "@reduxjs/toolkit";

import Img1 from "../../assets/img-1.png";
import Img2 from "../../assets/img-2.png";

const initialState = {
  isRightDrawerOpen: false,
  isLeftDrawer: true,
  isPromptView: true,
  showImage: { show: false, src: "" },
  chatList: [],
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setRightDrawer: (state) => {
      state.isRightDrawerOpen = !state.isRightDrawerOpen;
    },
    setLeftDrawer: (state) => {
      state.isLeftDrawer = !state.isLeftDrawer;
    },
    setPromptView: (state) => {
      state.isPromptView = !state.isPromptView;
    },
    setImage: (state, { payload }) => {
      // payload == { show: true, src: "" }
      state.showImage = payload;
    },
    removeImage: (state) => {
      state.showImage = { show: false, src: "" };
    },
    addNewQuestion: (state, { payload }) => {
      const tmpList = [...state.chatList];
      const newPayload = {
        ...payload,
        id: tmpList.length + 1,
        response: "",
        images: [],
      };
      tmpList.push(newPayload);
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
  setRightDrawer,
  setLeftDrawer,
  setImage,
  removeImage,
  addNewQuestion,
  updateResponse,
  updateResponseImages,
  setPromptView,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
