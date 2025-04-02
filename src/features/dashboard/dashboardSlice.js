import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cacheDataThunk, fetchMappingThunk } from "./dashboardThunk";
// import { toast } from "react-toastify";

const initialState = {
  isRightDrawerOpen: false,
  isLeftDrawer: true,
  isPromptView: true,
  showImage: { show: false, src: "" },
  chatList: [],
  isLoading: false,
  filters: null,
  folders: null,
  // {
  //   Category_Folder: "GB_haircare",
  //   Customer_Folder: "elida_beauty",
  //   Product_Folder: "brand_pulse"
  // }
  botMapping: null,
};

export const fetchMapping = createAsyncThunk(
  "dashboard/fetchMapping",
  async (thunkAPI) => {
    return fetchMappingThunk("/download-mapping", thunkAPI);
  }
);

export const cacheData = createAsyncThunk(
  "dashboard/cacheData",
  async (folder, thunkAPI) => {
    const url = `/cache-data?Customer_Folder=${folder.Customer_Folder}&Product_Folder=${folder.Product_Folder}&Category_Folder=${folder.Category_Folder}`;

    console.log("url : ", url);

    return fetchMappingThunk(url, thunkAPI);
  }
);

export const testFunc = createAsyncThunk(
  "dashboard/testFunc",
  async (folder, thunkAPI) => {
    console.log("folder : ", folder);

    const url = `/testfunc?Customer_Folder=${"folder.Customer_Folder"}`;

    return fetchMappingThunk(url, thunkAPI);
  }
);

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
      if (state.folders != null) {
        const tmpList = [...state.chatList];
        const newPayload = {
          ...payload,
          id: tmpList.length + 1,
          response: "",
          images: [],
        };
        tmpList.push(newPayload);
        state.chatList = tmpList;
      }
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
    initFilters: (state, { payload }) => {
      state.filters = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapping.pending, (state) => {
        // console.log("fetchMapping - pending");
        state.isLoading = true;
      })
      .addCase(fetchMapping.fulfilled, (state, { payload }) => {
        // console.log("fetchMapping - fulfilled");
        state.isLoading = false;
        state.botMapping = payload;
      })
      .addCase(fetchMapping.rejected, (state) => {
        // console.log("fetchMapping - rejected");
        state.isLoading = false;
      })
      .addCase(cacheData.pending, (state) => {
        console.log("cacheData - pending");
        state.isLoading = true;
      })
      .addCase(cacheData.fulfilled, (state, { payload }) => {
        console.log("cacheData - fulfilled : ");
        state.folders = payload.folders;
        state.isLoading = false;
      })
      .addCase(cacheData.rejected, (state) => {
        console.log("cacheData - rejected");
        state.isLoading = false;
      })
      .addCase(testFunc.pending, (state) => {
        console.log("testFunc - pending");
      })
      .addCase(testFunc.fulfilled, (state, { payload }) => {
        console.log("testFunc - fulfilled : ");
      })
      .addCase(testFunc.rejected, (state) => {
        console.log("testFunc - rejected");
      });
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
  initFilters,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
