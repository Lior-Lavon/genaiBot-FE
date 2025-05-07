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
  authorKeys: {
    JustASec: { label: "Just a sec...", persistent: false },
    PlannerAgent: { label: "Show thinking ...", persistent: false },
    SqlGenerationAgent: { label: "Resolving ...", persistent: false },
    SqlExecutionAgent: { label: "", persistent: false },
    ResponseSynthesizerAgent: { label: "", persistent: true },
    VizCodeGeneratorAgent: { label: "", persistent: true },
  },
  isBlock: false,
  missingProductIdOrCategoryId: false,
};

export const fetchOptions = createAsyncThunk(
  "dashboard/fetchOptions",
  async (startParam, thunkAPI) => {
    let url = "/options/?startParam=" + startParam;
    console.log("url : ", url);

    return getThunk(url, thunkAPI);
  }
);

export const loadData = createAsyncThunk(
  "dashboard/loadData",
  async (body, thunkAPI) => {
    return postThunk("/load_data", body, thunkAPI);
  }
);

export const testFunc = createAsyncThunk(
  "dashboard/testFunc",
  async (thunkAPI) => {
    return postThunk("/test", thunkAPI);
  }
);

export const startChat = createAsyncThunk(
  "dashboard/startChat",
  async (body, thunkAPI) => {
    let qPosition = body.qPosition;
    delete body.qPosition;

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
    try {
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
        if (done) {
          break;
        }

        // console.log("processing ... ");
        const chunk = decoder.decode(value, { stream: true });

        // check for data: {"invocation_id"
        if (
          chunk.startsWith('{"invocation_id"') ||
          chunk.startsWith('data: {"invocation_id"')
        ) {
          continue;
        }

        // // if (matches > 0) {
        // //   console.log("jumping over");
        // //   continue;
        // // }

        const matches = chunk.match("content");
        const count = matches ? matches.length : 0;
        if (count > 1) {
          console.log("!!!!!!!!!!!!!!");
          console.log("!!!!!!!Found a duplication!!!!!!!");
          console.log("!!!!!!!!!!!!!!");
        }

        // // 👇 Emit partial result to the store (custom action)
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
    setMissingSelectedFoldersFlag: (state, { payload }) => {
      state.missingProductIdOrCategoryId = payload;
    },
    initChunk: (state, action) => {
      let qPosition = action.payload;
      state.chatList[qPosition].response["JustASec"] = "";
    },
    streamChunk: (state, action) => {
      // console.log("1");
      let qPosition = action.payload.qPosition;
      // console.log("2");
      if (action.payload.chunk.startsWith("data")) {
        // console.log("3");
        try {
          const payload = action.payload;

          const jsonString = payload?.chunk.replace(/^data:\s*/, "").trim();
          // console.log("length : ", jsonString.length);
          // console.log("jsonString : ", jsonString);

          // const results = extractJsonObjects(jsonString);
          // console.log("len : ", results.length);
          // console.log(results);
          // console.log("--------------------");

          const data = JSON.parse(jsonString);
          if (data?.type == "done") {
            console.log("finished");
            return;
          }

          let author = data?.author;
          // console.log("author : ", author);

          if (author == "VizCodeGeneratorAgent") {
            return;
          }

          // // // let imgTag = "";
          // if (author == "ArtifactLoader") {
          //   const text = data?.content?.parts?.[0]?.text;

          //   // Match Markdown image syntax and extract the data URL
          //   const imageMarkdownMatch = text.match(/!\[.*?\]\((.*?)\)/);

          //   if (!imageMarkdownMatch) {
          //     console.warn("⚠️ No Markdown image found in input.");
          //     return;
          //   }

          //   const dataUrl = imageMarkdownMatch[1];

          //   // Extract the base64 content from the data URL
          //   const base64Match = dataUrl.match(
          //     /^data:image\/[a-zA-Z]+;base64,(.+)$/
          //   );

          //   if (!base64Match) {
          //     console.warn("⚠️ Invalid or missing base64 image data.");
          //     return;
          //   }
          //   const base64Image = base64Match[1];

          //   const imgTag = "![1](" + base64Image + ")";
          //   state.chatList[qPosition].response["ResponseSynthesizerAgent"] +=
          //     imgTag;

          //   return;
          // }

          const text = data?.content?.parts?.[0]?.text;
          if (data?.partial && text) {
            // Clean up any ```json or ``` markers
            const cleanedText = text
              .replace(/^```json\s*/i, "")
              .replace(/\s*```$/, "");
            if (author in state.chatList[qPosition].response) {
              state.chatList[qPosition].response[author] += cleanedText;
            } else {
              // clear all keys
              state.chatList[qPosition].response = {};
              // add new key
              state.chatList[qPosition].response[author] = cleanedText;
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
        // console.log("fetchOptions - fulfilled - ");
        state.isLoading = false;
        if (payload.error == "missing client_id") {
          state.isBlock = true;
        } else if (payload.error == "missing keys : product_id, category_id") {
          console.log(payload.error);
          state.folders = { populate: false, data: payload.options };
          state.missingProductIdOrCategoryId = true;
        } else {
          state.folders = { populate: false, data: payload.options };
          state.selectedFolders = payload.defaults;
        }
      })
      .addCase(fetchOptions.rejected, (state) => {
        // console.log("fetchOptions - rejected");
        state.isLoading = false;
      })
      .addCase(testFunc.pending, (state) => {
        console.log("testFunc - pending");
        state.isLoading = true;
      })
      .addCase(testFunc.fulfilled, (state, { payload }) => {
        console.log("testFunc - fulfilled : ", payload);
        state.isLoading = false;
      })
      .addCase(testFunc.rejected, (state) => {
        console.log("testFunc - rejected");
        state.isLoading = false;
      })
      // loadData
      .addCase(loadData.pending, (state) => {
        // console.log("loadData - pending");
        state.isLoading = true;
      })
      .addCase(loadData.fulfilled, (state, { payload }) => {
        // console.log("loadData - fulfilled : ");
        if (payload.status == "success") {
          state.session_id = payload.session_id;
          state.selectedFolders = payload.defaults;
          state.myBrands = [...payload.global_options.my_brands_list];
          state.competitorBrands = [
            ...payload.global_options.competitor_brands_list,
          ];
        }
        state.isLoading = false;
      })
      .addCase(loadData.rejected, (state) => {
        // console.log("loadData - rejected");
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
  setMissingSelectedFoldersFlag,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
