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
    PlannerAgent: { label: "Thinking ...", persistent: false },
    SqlGenerationAgent: { label: "Thinking ...", persistent: false },
    SqlExecutionAgent: { label: "Thinking ...", persistent: false },
    ResponseSynthesizerAgent: { label: "", persistent: true },
    VizCodeGeneratorAgent: { label: "", persistent: true },
  },
  isBlock: false,
  missingProductIdOrCategoryId: false,
  tmpPrompt: null, // used between the option and loaddata
};

export const fetchOptions = createAsyncThunk(
  "dashboard/fetchOptions",
  async (body, thunkAPI) => {
    return postThunk("/options", body, thunkAPI);
  }
);

export const loadData = createAsyncThunk(
  "dashboard/loadData",
  async (body, thunkAPI) => {
    return postThunk("/load_data", body, thunkAPI);
  }
);

// export const testFunc = createAsyncThunk(
//   "dashboard/testFunc",
//   async (body, thunkAPI) => {
//     return postThunk("/test", body, thunkAPI);
//   }
// );

function extractDataChunks(raw) {
  return raw
    .split("data:")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk) // remove empty strings
    .map((chunk) => "data: " + chunk);
}

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

      console.log("Connected ... ");

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("closing");
          break;
        }

        // console.log("processing ... ");
        const data = decoder.decode(value, { stream: true });

        const chunk = data;

        if (chunk.startsWith('data: {"invocation_id')) {
          continue;
        }

        const exit = false;

        // const parts = chunk.split(/(?=data: )/);
        const parts = chunk.split(/(?=data: )/).map((part) => part.trim());
        for (const part of parts) {
          if (!part.startsWith("data")) {
            continue;
          }

          if (part.startsWith("data")) {
            const jsonString = part.replace(/^data:\s*/, "").trim();

            const firstBrace = jsonString.indexOf("{");
            const lastBrace = jsonString.lastIndexOf("}");

            if (firstBrace !== -1 && lastBrace !== -1) {
              const slice = jsonString.slice(firstBrace, lastBrace + 1);
              try {
                const jsonObj = JSON.parse(slice);

                // check if done received
                const type = jsonObj.type;
                if (type === "done") {
                  break;
                }
                console.log("sending");

                // thunkAPI.dispatch({
                //   type: "dashboard/streamChunk",
                //   payload: {
                //     qPosition,
                //     chunk: jsonObj,
                //   },
                // });
              } catch (e) {
                console.error("Still failed to parse JSON:", e);
                console.log("A : ", slice);
              }
            } else {
              console.error("Ops something went wrong");
              console.log("B jsonString : ", jsonString);
              console.log("B part : ", part);
            }
            // console.log(data);
          } else {
            console.error("part does not start with 'data' !!");
          }
        }

        /*        
        if (chunk.startsWith('data: {"content":{"parts":[{"text":"![Image]')) {
          // check how many images are included
          const matches = chunk.match(
            /data:\s*\{"content":\{"parts":\[\{"text":"!\[Image\]/g
          );
          const count = matches ? matches.length : 0;

          if (count > 1) {
            console.log("✅ String starts with image markdown chunk");
            console.log("count : ", count);

            const parts = chunk.split(/(?=data: \{"content":\{"parts":)/);
            for (const part of parts) {
              console.log("pushing part");

              thunkAPI.dispatch({
                type: "dashboard/streamChunk",
                payload: {
                  qPosition,
                  part,
                },
              });
            }

            continue; // prevent duplicate full chunk dispatch
          }
        }

        // 👇 Emit partial result to the store (custom action)
        thunkAPI.dispatch({
          type: "dashboard/streamChunk",
          payload: {
            qPosition,
            chunk,
          },
        });
*/
        // // if image break out
        // if (chunk.startsWith('data: {"content":{"parts":[{"text":"![Image]')) {
        //   console.log("✅ String starts with image markdown chunk");

        //   break;
        // }
      }

      return "done"; // Optional return value
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const newQuestion = (state, payload) => {
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
      state.showImage = payload;
    },
    removeImage: (state) => {
      state.showImage = { show: false, src: "" };
    },
    addNewQuestion: (state, { payload }) => {
      newQuestion(state, payload);
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
      // console.log("payload : ", action.payload);
      const chunk = action.payload.chunk;
      // console.log(chunk);
      const qPosition = action.payload.qPosition;
      // console.log("qPosition : ", qPosition);

      let author = chunk?.author;

      console.log("author : ", author);
      // if (author == "VizCodeGeneratorAgent") {
      //   if ("ResponseSynthesizerAgent" in state.chatList[qPosition].response) {
      //     if (
      //       !("VizCodeGeneratorAgent" in state.chatList[qPosition].response)
      //     ) {
      //       // add loader if not exist
      //       state.chatList[qPosition].response["VizCodeGeneratorAgent"] =
      //         "[LOADER]";
      //     }
      //   }
      //   return;
      // }

      if (author == "ResponseSynthesizerAgent") {
        const text = chunk?.content?.parts?.[0]?.text;
        // check if text contain next step
        // if (data?.partial && text.toLowerCase().includes("next step")) {
        //   console.log("Found 'next step'");
        //   console.log(text);
        // }

        if (chunk?.partial && text) {
          const cleanedText = text
            .replace(/^```json\s*/i, "")
            .replace(/\s*```$/, "");

          if (author in state.chatList[qPosition].response) {
            state.chatList[qPosition].response[author] += cleanedText;
          } else {
            state.chatList[qPosition].response = {};
            state.chatList[qPosition].response[author] = cleanedText;
          }
        }
      }

      if (author == "ArtifactLoader") {
        // remove the loader
        delete state.chatList[qPosition].response.VizCodeGeneratorAgent;
        const text = chunk?.content?.parts?.[0]?.text;
        // Match Markdown image syntax and extract the data URL
        const imageMarkdownMatch = text.match(/!\[.*?\]\((.*?)\)/);
        if (!imageMarkdownMatch) {
          console.warn("⚠️ No Markdown image found in input.");
          return;
        }
        const dataUrl = imageMarkdownMatch[1];
        // console.log(dataUrl);
        // // Extract the base64 content from the data URL
        const base64Match = dataUrl.match(
          /^data:image\/[a-zA-Z]+;base64,(.+)$/
        );
        if (!base64Match) {
          console.warn("⚠️ Invalid or missing base64 image data.");
          return;
        }
        const base64Image = base64Match[1];
        const imgTag = "![1](" + base64Image + ")";
        state.chatList[qPosition].response["ResponseSynthesizerAgent"] +=
          imgTag;
        return;
      }

      if (
        author == "PlannerAgent" ||
        author == "SqlGenerationAgent" ||
        author == "SqlExecutionAgent"
      ) {
        const response = state.chatList[qPosition].response;
        if (
          "ResponseSynthesizerAgent" in response ||
          "ArtifactLoader" in response ||
          "VizCodeGeneratorAgent" in response
        )
          return;

        if (author in state.chatList[qPosition].response) {
          // do nothing
        } else {
          state.chatList[qPosition].response = {};
          state.chatList[qPosition].response[author] = "";
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
        // console.log("fetchOptions - fulfilled - ", payload);
        state.isLoading = false;
        if (payload.error == "missing client_id") {
          state.isBlock = true;
        } else if (payload.error == "missing keys : product_id, category_id") {
          console.log(payload.error);
          state.folders = { populate: false, data: payload.options };
          state.missingProductIdOrCategoryId = true;
        } else {
          // if all good
          state.folders = { populate: false, data: payload.options };
          state.selectedFolders = payload.defaults;

          const question = payload.question;
          if (question != undefined && question != "") {
            state.tmpPrompt = question;
          }
        }
      })
      .addCase(fetchOptions.rejected, (state) => {
        // console.log("fetchOptions - rejected");
        state.isLoading = false;
      })
      // .addCase(testFunc.pending, (state) => {
      //   console.log("testFunc - pending");
      //   state.isLoading = true;
      // })
      // .addCase(testFunc.fulfilled, (state, { payload }) => {
      //   console.log("testFunc - fulfilled : ", payload);
      //   state.isLoading = false;
      // })
      // .addCase(testFunc.rejected, (state) => {
      //   console.log("testFunc - rejected");
      //   state.isLoading = false;
      // })
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

          if (state.tmpPrompt != null && state.tmpPrompt != "") {
            newQuestion(state, { prompt: state.tmpPrompt });
            state.tmpPrompt = null; // set back to null
          }
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
