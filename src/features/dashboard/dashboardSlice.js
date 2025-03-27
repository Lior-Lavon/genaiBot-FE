import { createSlice } from "@reduxjs/toolkit";

import Img1 from "../../assets/img-1.png";
import Img2 from "../../assets/img-2.png";

const initialState = {
  isDrawerOpen: false,
  showImage: { show: false, id: 0 },
  chatList: [],
  isLoading: false,
  imageList: [
    // {
    //   id: "1",
    //   src: Img1,
    // },
    // {
    //   id: "2",
    //   src: Img2,
    // },
  ],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
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
      const pChat = { ...state.chatList[pos], response: payload.response };
      state.chatList[pos] = pChat;
    },
    addResponseImage: (state, { payload }) => {
      // const pos = payload.id - 1;
      // const pChat = { ...state.chatList[pos] };
      // const pImages = [...pChat.images];
      // pImages.push({ id: pImages.length + 1, img: payload.image });
      // pChat.images = pImages;
      // state.chatList[pos] = pChat;
    },
  },
});

export const {
  setDrawer,
  setImage,
  removeImage,
  addNewQuestion,
  updateResponse,
  addResponseImage,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
