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
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("closing connection.");
          break;
        }

        // console.log("processing ... ");
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        if (chunk.startsWith('data: {"invocation_id')) {
          continue;
        }

        // const parts = chunk.split(/(?=data: )/);
        const parts = buffer.split(/(?=data: )/);
        buffer = ""; // clear buffer to refill with remaining if needed
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim();
          if (!part.startsWith("data:")) continue;

          const jsonString = part.replace(/^data:\s*/, "").trim();

          // Try parsing the JSON safely
          try {
            const jsonObj = JSON.parse(jsonString);

            if (jsonObj.type === "done") {
              console.log("streamFinished called");

              thunkAPI.dispatch({
                type: "dashboard/streamFinished",
                payload: { qPosition },
              });
              break;
            }

            thunkAPI.dispatch({
              type: "dashboard/streamChunk",
              payload: {
                qPosition,
                chunk: jsonObj,
              },
            });
          } catch (err) {
            // If parsing fails, likely due to incomplete JSON => save to buffer
            buffer = part;
            break;
          }
        }
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
      finished: false,
      id: tmpList.length + 1,
      response: {},
      images: [],
    };
    tmpList.push(newPayload);
    state.chatList = tmpList;
    state.slideToBottom = true;
  }
};

const extractAndReplaceWhatsNextSection = (text) => {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const headerRegex = /^#{0,6}\s*what's next\b.*$/i;
  const bulletLines = [];

  let headerIdx = -1;
  let startIdx = -1;
  let endIdx = -1;

  // Step 1: Find "What's Next?" header
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (headerRegex.test(line)) {
      headerIdx = i;
      // console.log(`Found "What's Next" header at line ${i}: "${lines[i]}"`);
      break;
    }
  }

  if (headerIdx === -1) {
    return text;
  }

  // Step 2: Skip blank lines and optional subheader
  let i = headerIdx + 1;
  while (i < lines.length && lines[i].trim() === "") {
    // console.log(`Skipping empty line at ${i}`);
    i++;
  }

  if (i < lines.length && !/^[•\-*]/.test(lines[i].trim())) {
    console
      .log
      // `Skipping potential subheader or non-bullet at ${i}: "${lines[i]}"`
      ();
    i++;
  }

  // Step 3: Detect bullet points (including • character)
  const bulletRegex = /^[•\-*]\s+/;

  startIdx = i;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      endIdx = i;
      continue;
    }

    if (!bulletRegex.test(line)) {
      endIdx = i;
      break;
    }

    let newLine = line.replace(/\*/g, "").trimStart();
    bulletLines.push(newLine);
  }

  if (bulletLines.length === 0) {
    return text;
  } else {
    endIdx = startIdx + bulletLines.length + 1;
  }

  // Step 4: Create markdown buttons
  const buttonMarkdown = bulletLines
    .map((line) => {
      const label = line.length > 120 ? line.slice(0, 120) + "..." : line;
      return `\n [${label}]()`;
    })
    .join("");

  // Step 5: Replace bullets in original text
  const newLines = [
    ...lines.slice(0, startIdx),
    buttonMarkdown,
    ...lines.slice(endIdx),
  ];

  const result = newLines.join("\n");

  return result;
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setRightDrawer: (state) => {
      state.isRightDrawerOpen = !state.isRightDrawerOpen;
    },
    blockApp: (state, { payload }) => {
      state.isBlock = payload;
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
      if (state.chatList[qPosition].finished == false)
        state.chatList[qPosition].response["JustASec"] = "";
    },
    streamFinished: (state, action) => {
      console.log("streamFinished");
      const qPosition = action.payload.qPosition;
      state.chatList[qPosition].finished = true;
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
        } else {
          // once we received all the information for ResponseSynthesizerAgent, update the what's next
          const responseWithButtons = extractAndReplaceWhatsNextSection(
            state.chatList[qPosition].response["ResponseSynthesizerAgent"]
          );
          state.chatList[qPosition].response["ResponseSynthesizerAgent"] =
            responseWithButtons;
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
          "\n" + imgTag;
        return;
      }

      if (
        author == "PlannerAgent" ||
        author == "SqlGenerationAgent" ||
        author == "SqlExecutionAgent"
      ) {
        if (chunk?.partial == undefined && author == "PlannerAgent") {
          // get the type
          const text = chunk?.content?.parts?.[0]?.text;
          try {
            const cleanedText = text
              .replace(/^```json\s*/i, "")
              .replace(/\s*```$/, "");

            const jsonObj = JSON.parse(cleanedText);
            console.log("jsonObj : ", jsonObj);
            const type = jsonObj?.type;
            if (type != undefined) console.log("type: ", type);
          } catch (err) {
            console.log("err : ", err);
          }
        }

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
  blockApp,
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
