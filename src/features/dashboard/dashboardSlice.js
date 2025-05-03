import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getThunk, postThunk } from "./dashboardThunk";

const initialState = {
  isRightDrawerOpen: false,
  isLeftDrawer: true,
  isPromptView: true,
  user_id: null,
  session_id: null,
  showImage: { show: false, src: "" },
  chatList: [],
  isLoading: false,
  isStreaming: false,
  filters: null,
  folders: null,
  selectedFolders: null,
  slideToBottom: false,
  myBrands: [],
  competitorBrands: [],
};

export const fetchOptions = createAsyncThunk(
  "dashboard/fetchOptions",
  async (thunkAPI) => {
    return getThunk("/options", thunkAPI);
  }
);

export const loadData = createAsyncThunk(
  "dashboard/loadData",
  async (body, thunkAPI) => {
    return postThunk("/load_data", body, thunkAPI);
  }
);

export const startChat = createAsyncThunk(
  "dashboard/startChat",
  async (body, thunkAPI) => {
    let qPosition = body.qPosition;
    delete body.qPosition;

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
    try {
      // thunkAPI.dispatch({
      //   type: "dashboard/initChunk",
      //   payload: {
      //     qPosition,
      //   },
      // });

      const response = await fetch(`${baseUrl}/stream_chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // 👇 Emit partial result to the store (custom action)
        thunkAPI.dispatch({
          type: "dashboard/streamChunk",
          payload: {
            qPosition,
            chunk,
          },
        });
      }

      return "done"; // Optional return value
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
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
          response: {},
          images: [],
        };
        tmpList.push(newPayload);
        state.chatList = tmpList;
        state.slideToBottom = true;
      }
    },
    initFolders: (state, { payload }) => {
      state.folders = payload;
    },
    initFilters: (state, { payload }) => {
      state.filters = payload;
    },
    slideContentToBottom: (state, { payload }) => {
      state.slideToBottom = payload;
    },
    setUserId: (state, { payload }) => {
      state.user_id = payload;
    },
    restartChat: (state) => {
      state.chatList = [];
      state.isLoading = false;
      state.isStreaming = false;
    },
    setStreamingStatus: (state, { payload }) => {
      state.isStreaming = payload;
    },
    initChunk: (state, action) => {
      let qPosition = action.payload;
      state.chatList[qPosition].response["JustASec"] = "";
    },
    streamChunk: (state, action) => {
      let qPosition = action.payload.qPosition;
      if (action.payload.chunk.startsWith("data")) {
        try {
          const jsonString = action.payload.chunk
            .replace(/^data:\s*/, "")
            .trim();
          const data = JSON.parse(jsonString);
          // Use parsed data (e.g., append message)
          // if (data.author == "PlannerAgent") {
          const text = data?.content?.parts?.[0]?.text;
          if (data?.partial && text) {
            // Clean up any ```json or ``` markers
            const cleanedText = text
              .replace(/^```json\s*/i, "")
              .replace(/\s*```$/, "");

            if (data.author in state.chatList[qPosition].response) {
              state.chatList[qPosition].response[data.author] += cleanedText;
            } else {
              // clear all keys
              state.chatList[qPosition].response = {};
              // add new key
              state.chatList[qPosition].response[data.author] = cleanedText;
            }
          }
        } catch (e) {
          console.warn("Invalid JSON after 'data:' prefix");
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOptions.pending, (state) => {
        // console.log("fetchOptions - pending");
        state.isLoading = true;
      })
      .addCase(fetchOptions.fulfilled, (state, { payload }) => {
        // console.log("fetchOptions - fulfilled");
        state.isLoading = false;
        state.folders = { populate: false, data: payload.options };
        state.selectedFolders = payload.defaults;
      })
      .addCase(fetchOptions.rejected, (state) => {
        console.log("fetchOptions - rejected");
        state.isLoading = false;
      })
      // loadData
      .addCase(loadData.pending, (state) => {
        // console.log("loadData - pending");
        state.isLoading = true;
      })
      .addCase(loadData.fulfilled, (state, { payload }) => {
        // console.log("loadData - fulfilled : ", payload.global_options);
        if (payload.status == "success") {
          state.session_id = payload.session_id;
          state.myBrands = [...payload.global_options.my_brands_list];
          state.competitorBrands = [
            ...payload.global_options.competitor_brands_list,
          ];
        }
        state.isLoading = false;
      })
      .addCase(loadData.rejected, (state) => {
        console.log("loadData - rejected");
        state.isLoading = false;
      });
    // startChat
    //   .addCase(startChat.pending, (state) => {
    //     // console.log("startChat - pending");
    //     // state.isLoading = true;
    //     state.chatStream = "";
    //   })
    //   .addCase(startChat.fulfilled, (state) => {
    //     // console.log("startChat - fulfilled");
    //     // state.isLoading = false;
    //   })
    //   .addCase(startChat.rejected, (state) => {
    //     console.log("startChat - rejected");
    //     // state.isLoading = false;
    //   });
  },
});

export const {
  setRightDrawer,
  setLeftDrawer,
  setImage,
  removeImage,
  addNewQuestion,
  // updateQuestionPrompt,
  clearResponse,
  updateResponseImages,
  setPromptView,
  initFilters,
  initFolders,
  slideContentToBottom,
  restartChat,
  setStreamingStatus,
  setUserId,
  initChunk,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
