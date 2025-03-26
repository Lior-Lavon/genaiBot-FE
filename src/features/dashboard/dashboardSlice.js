import { createSlice } from "@reduxjs/toolkit";

import Img1 from "../../assets/img-1.png";
import Img2 from "../../assets/img-2.png";

const initialState = {
  isDrawerOpen: false,
  showImage: { show: false, id: 0 },
  isLoading: false,
  imageList: [
    {
      id: "1",
      src: Img1,
    },
    {
      id: "2",
      src: Img2,
    },
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
  },
});

export const { setDrawer, setImage, removeImage } = dashboardSlice.actions;
export default dashboardSlice.reducer;
