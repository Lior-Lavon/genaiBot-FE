import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getThunk, postThunk } from "./dashboardThunk";
import extractAndReplaceWhatsNextSection from "../../utills/extractAndReplaceWhatsNextSection";
import extractResponse from "../../utills/extractResponse";
import extractClarificationResponse from "../../utills/extractClarificationResponse";
import highlightMarkdownTable from "../../utills/highlightMarkdownTable";

const markdownInput = `| Platform      | Avg Sentiment | Volume | Key Observation                                                                 |
| :------------ | :------------ | :----- | :------------------------------------------------------------------------------ |
| **Superdrug** | 52.7 ✨         | 10 📊   | Exceptionally high sentiment among platforms with data, though volume is relatively low.                  |
| **Boots**     | 32.9 👍         | 164 📈  | Strong positive sentiment with significant volume.                              |
| **Amazon UK** | 19.0 ⚖️         | 175 📊  | Moderate sentiment, highest volume among review platforms with data.                      |
| *Other*       | *No Data*     | *No Data* | Data not available for Tesco or Waitrose this month.                            |`;

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

      thunkAPI.dispatch({
        type: "dashboard/updateTimeStamp",
        payload: {
          time: Date.now(),
          qPosition,
        },
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      console.log("Connected ... ");
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          console.log("closing connection.");
          console.log("streamFinished called");
          thunkAPI.dispatch({
            type: "dashboard/streamFinished",
            payload: { qPosition },
          });
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
      questionType: "",
      images: [],
      clarifications: [],
      whatIsNext: "",
      dataQueryDescription: "",
      timeStamp: {
        start: 0,
        end: 0,
      },
    };
    tmpList.push(newPayload);
    state.chatList = tmpList;
    state.slideToBottom = true;
    state.isStreaming = true;
  }
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

      state.chatList[qPosition].timeStamp.end = Date.now();

      // const fullMarkdown = markdownInput;
      const fullMarkdown =
        state.chatList[qPosition].response["ResponseSynthesizerAgent"];

      if (fullMarkdown != undefined) {
        const updatedMarkdown = highlightMarkdownTable(fullMarkdown);
        // const updatedMarkdown = fullMarkdown;
        // console.log("updatedMarkdown : ", updatedMarkdown);

        state.chatList[qPosition].response["ResponseSynthesizerAgent"] =
          updatedMarkdown;
        console.log("finished updating table");
      }
      // remove the loader from the bottom
      delete state.chatList[qPosition].response["VizCodeGeneratorAgent"];

      state.chatList[qPosition].finished = true;
      state.isStreaming = false;
    },
    updateTimeStamp: (state, action) => {
      // console.log("updateTimeStamp : ", action.payload.time);
      const qPosition = action.payload.qPosition;
      const timeStamp = {
        start: action.payload.time,
        end: 0,
      };
      state.chatList[qPosition].timeStamp = timeStamp;
    },
    streamChunk: (state, action) => {
      // console.log("payload : ", action.payload);
      const chunk = action.payload.chunk;
      // console.log(chunk);
      const qPosition = action.payload.qPosition;
      // console.log("qPosition : ", qPosition);

      let author = chunk?.author;
      // console.log("author : ", author);

      if (
        author == "VizCodeGeneratorAgent" ||
        author == "VizDataCuratorAgent"
      ) {
        if ("ResponseSynthesizerAgent" in state.chatList[qPosition].response) {
          if (
            !("VizCodeGeneratorAgent" in state.chatList[qPosition].response)
          ) {
            // add loader if not exist
            state.chatList[qPosition].response["VizCodeGeneratorAgent"] =
              "[LOADER]";
          }
        }
        return;
      }

      if (author == "ResponseSynthesizerAgent") {
        const text = chunk?.content?.parts?.[0]?.text;

        if (chunk?.partial != undefined && text) {
          // get the interval updates
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
          // get the full text
          const { cleanedText, whatsNextSection } =
            extractAndReplaceWhatsNextSection(
              state.chatList[qPosition].response["ResponseSynthesizerAgent"]
            );

          // set the full darkdown response
          state.chatList[qPosition].response["ResponseSynthesizerAgent"] =
            cleanedText;

          // set only the buttons
          state.chatList[qPosition].whatIsNext = whatsNextSection;
        }
        return;
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
        // Extract the base64 content from the data URL
        const base64Match = dataUrl.match(
          /^data:image\/[a-zA-Z]+;base64,(.+)$/
        );
        if (!base64Match) {
          console.warn("⚠️ Invalid or missing base64 image data.");
          return;
        }
        const base64Image = base64Match[1];
        const imgSrc = "data:image/png;base64," + base64Image;
        // const imgTag = "![1](" + base64Image + ")";

        state.chatList[qPosition].images.push(imgSrc);
        return;
      }

      if (
        author == "PlannerAgent" ||
        author == "SqlGenerationAgent" ||
        author == "SqlExecutionAgent"
      ) {
        if (author == "PlannerAgent") {
          if (chunk?.partial == undefined) {
            // get the type
            const text = chunk?.content?.parts?.[0]?.text;
            if (text != undefined) {
              try {
                const cleanedText = text
                  .replace(/^```json\s*/i, "")
                  .replace(/\s*```$/, "");
                // console.log("cleanedText : ", cleanedText);
                const jsonObj = JSON.parse(cleanedText);
                // console.log("jsonObj : ", jsonObj);
                const type = jsonObj?.type;
                if (type != undefined) {
                  // console.log("type : ", type);
                  state.chatList[qPosition].questionType = type;
                  if (
                    type == "greeting" ||
                    type == "irrelevant" ||
                    type == "context_query"
                  ) {
                    const response = extractResponse(jsonObj);
                    state.chatList[qPosition].response = {};
                    state.chatList[qPosition].response[author] = response;
                  } else if (
                    type == "data_query" ||
                    type == "data_query_error"
                  ) {
                    state.chatList[qPosition].dataQueryDescription =
                      jsonObj?.response;
                  } else if (type == "clarification") {
                    const { clarifications, title } =
                      extractClarificationResponse(jsonObj);
                    state.chatList[qPosition].response = {};
                    state.chatList[qPosition].response[author] = title;
                    state.chatList[qPosition].clarifications = clarifications;
                  }
                } else {
                  console.log("type == undefined");
                }
              } catch (err) {
                console.log("err : ", err);
              }
            }
          } else {
            return;
          }
        }

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
          // state.myBrands = [...payload.global_options.my_brands_list];
          state.myBrands = [
            // ...payload.global_options.my_brands_list.slice(0, 4),
            ...payload.global_options.my_brands_list,
          ];
          state.competitorBrands = [
            // ...payload.global_options.competitor_brands_list.slice(0, 4),
            ...payload.global_options.competitor_brands_list,
            ,
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
  setUserId,
  initChunk,
  setMissingSelectedFoldersFlag,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
