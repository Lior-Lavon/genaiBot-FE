import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import ChatLoader from "../ChatLoader/ChatLoader";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Minus, RotateCw } from "lucide-react"; // Optional: icons
import handleCapture from "../../utills/handleCapture";
import getPromptTime from "../../utills/getPromptTime";
import {
  addNewQuestion,
  initChunk,
  setImage,
  startChat,
  // startChat,
  updateResponseImages,
} from "../../features/dashboard/dashboardSlice";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Spinner from "../Spinner/Spinner";
import { div } from "framer-motion/client";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import QuestionImage from "./QuestionImage";
import AnimatedIconText from "../AnimatedIconText/AnimatedIconText";
import TextWithAnimatedDots from "../TextWithAnimatedDots/TextWithAnimatedDots";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import { Copy, FileText } from "lucide-react";
import { Tooltip } from "react-tooltip";
import SelectBrand from "../SelectBrand/SelectBrand";
import ClarificationQuestion from "../ClarificationQuestion/ClarificationQuestion";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import VisualsLoader from "../VisualsLoader/VisualsLoader";

const QuestionCardLeft = ({ chatItem, leftWidth }) => {
  // console.log("chatItem : ", chatItem);
  const dispatch = useDispatch();
  const {
    selectedFolders,
    user_id,
    session_id,
    myBrands,
    competitorBrands,
    authorKeys,
    isLoading,
    isStreaming,
  } = useSelector((store) => store.dashboard);

  const schemaWithDataUrls = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      img: [
        ...(defaultSchema.attributes?.img || []),
        ["src", /^data:image\/(png|jpeg|jpg|gif|webp);base64,/], // Allow base64 data URLs for common image types
      ],
      div: [
        ...(defaultSchema.attributes?.td || []),
        "style", // ✅ Allow style attribute on <div>
      ],
      span: [
        ...(defaultSchema.attributes?.td || []),
        "style", // ✅ Allow style attribute on <span>
      ],
      td: [
        ...(defaultSchema.attributes?.td || []),
        "style", // ✅ Allow style attribute on <td>
      ],
      tr: [
        ...(defaultSchema.attributes?.tr || []),
        "style", // Optional: Allow style on <tr> if needed
      ],
    },
  };

  // const schemaWithDataUrls = {
  //   ...defaultSchema,
  //   tagNames: [
  //     ...(defaultSchema.tagNames || []),
  //     "table",
  //     "thead",
  //     "tbody",
  //     "tr",
  //     "th",
  //     "td",
  //     "div",
  //   ],
  //   attributes: {
  //     ...defaultSchema.attributes,
  //     div: ["style", "className"],
  //     table: ["className", "style"],
  //     thead: ["className", "style"],
  //     tbody: ["className", "style"],
  //     tr: ["className", "style"],
  //     span: [...(defaultSchema.attributes?.span ?? []), "style"],
  //     th: ["className", "style"],
  //     td: ["className", "style"],
  //     img: [
  //       ...(defaultSchema.attributes?.img || []),
  //       ["src", /^data:image\/(png|jpeg|jpg|gif|webp);base64,/],
  //     ],
  //   },
  // };

  const { id, prompt } = chatItem;

  const [visiblePrompt, setVisiblePrompt] = useState(prompt); // this is the prompt that will be visible
  const [selectedBrands, setSelectedBrands] = useState(null);

  const [response, setResponse] = useState({});
  const [streamComplete, setStreamComplete] = useState(false);
  const [showBrandFlow, setShowBrandFlow] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isWaiting, setIsWaiting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const answerRef = useRef(null);

  let rowIndex = -1;
  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 2;

  const RowIndexContext = createContext();

  const handleDrawer = () => {
    // dispatch(setRightDrawer());
  };

  useEffect(() => {
    setResponse(chatItem.response);
  }, [chatItem]);

  useEffect(() => {
    if (chatItem.finished == false) {
      if (
        prompt.toLowerCase().includes("my brand") ||
        prompt.toLowerCase().includes("competitor brand")
      ) {
        const brands = [];
        if (prompt.toLowerCase().includes("my brand")) {
          myBrands.map((name) => {
            brands.push({ name, selected: false });
          });
        } else {
          competitorBrands.map((name) => {
            brands.push({ name, selected: false });
          });
        }
        setSelectedBrands(brands);

        // check for MY_BRAND question
        setTimeout(() => {
          setShowBrandFlow("loader");
        }, 1000);
      } else {
        // My starting point
        dispatch(initChunk(id - 1));
        connect(prompt);
      }
    }
  }, []);

  const handleWhatNextPrompt = (inputPrompt) => {
    if (!isLoading && !isStreaming) {
      dispatch(addNewQuestion({ prompt: inputPrompt }));
    }
  };

  const connect = async (prompt) => {
    dispatch(
      startChat({
        qPosition: id - 1,
        user_id: user_id,
        session_id: session_id,
        client: selectedFolders.client,
        product: selectedFolders.product,
        category: selectedFolders.category,
        question: prompt,
      })
    );
  };

  useEffect(() => {
    if (showBrandFlow == "loader") {
      setTimeout(() => {
        // console.log("Prompt : ", prompt);
        // Do a SWOT analysis for my brand [MY_BRAND]
        // Do a SWOT analysis for my competitor brand [COMPETITOR_BRAND]
        if (prompt.toLowerCase().includes("my brand"))
          setShowBrandFlow("my-brand-question");
        else if (prompt.toLowerCase().includes("competitor brand"))
          setShowBrandFlow("competitor-brand-question");
      }, 2000);
    }
  }, [showBrandFlow]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleZoomReset = () => {
    setZoom(0.95);
  };

  const handleImageClick = (e) => {
    const pImg = e.target;
    const imgBase64Data = pImg.src;
    dispatch(setImage({ show: true, src: imgBase64Data }));
  };

  // // handle clicks on brands
  // const handleMyBrandSelect = (item) => {
  //   item.selected = !item.selected;
  //   const tmpArr = selectedMyBrands.map((elm) =>
  //     elm.name === item.name ? item : elm
  //   );

  //   setSelectedMyBrands(tmpArr);
  // };
  // const handleCompetitorsBrandSelect = (item) => {
  //   item.selected = !item.selected;
  //   const tmpArr = selectedCompetitorBrands.map((elm) =>
  //     elm.name === item.name ? item : elm
  //   );

  //   setSelectedCompetitorBrands(tmpArr);
  // };

  // submit prompt with my-brands
  const submitBrandSelection = () => {
    let newPrompt = "";
    // if (showBrandFlow == "my-brand-question") {
    if (selectedBrands.some((brand) => brand.selected === true)) {
      const brands = `${selectedBrands
        .filter((brand) => brand.selected)
        .map((brand) => brand.name)
        .join(", ")}`;

      if (showBrandFlow == "my-brand-question") {
        newPrompt = chatItem.prompt.replace("my brand", `${brands}`);
      } else if (showBrandFlow == "competitor-brand-question") {
        newPrompt = chatItem.prompt.replace("my competitor brand", `${brands}`);
      }
    }

    if (newPrompt != "") {
      dispatch(initChunk(id - 1));

      setShowBrandFlow("");
      // dispatch(updateQuestionPrompt({ id: chatItem.id, prompt: newPrompt }));
      setVisiblePrompt(newPrompt);
      connect(newPrompt);
    }
  };

  const formatText = (text) => {
    try {
      // Try parsing the string as JSON
      const parsed = JSON.parse(text);
      return <pre>{JSON.stringify(parsed, null, 2)}</pre>; // Pretty-print JSON
    } catch (e) {
      return <div>{text}</div>; // Plain text
    }
  };

  // JustASec: { label: "Just a sec...", persistent: false },
  // PlannerAgent: { label: "Thinking ...", persistent: false },
  // SqlGenerationAgent: { label: "Thinking ...", persistent: false },
  // SqlExecutionAgent: { label: "Thinking ...", persistent: false },
  // ResponseSynthesizerAgent: { label: "", persistent: true },
  // VizCodeGeneratorAgent: { label: "", persistent: true },

  const getTitle = (agent, text) => {
    if (agent == "SqlExecutionAgent" || agent == "SqlGenerationAgent") {
      return chatItem?.dataQueryDescription;
    }
    return authorKeys[agent]?.label;
  };

  const getUniqueKey = () => {
    const key = uuidv4();
    return key;
  };

  const testHtml = `<div style="background-color: red; padding: 20px;">Hello</div>`;

  const handleClarificationResponse = (obj) => {
    // format the inputPrompt
    let inputPrompt = "Here are my selected options for asked clarifications :";

    inputPrompt +=
      "\n" +
      Object.entries(obj)
        .map(([key, values]) => `• ${key} : ${values.join(", ")}`)
        .join("\n");

    console.log(inputPrompt);

    dispatch(addNewQuestion({ prompt: inputPrompt }));
  };

  return (
    <div className="bg-white" style={{ width: `${leftWidth}px` }}>
      {/* prompt */}
      <div className="w-full bg-white">
        <div className="w-full mx-4 px-4 py-2 text-left rounded-2xl border-l-3 border-[#bcdde5] flex items-center justify-between bg-[#dceef1] ">
          {/* <div className="text-base text-gray-800 tracking-wide">{`${visiblePrompt}`}</div> */}
          <pre className="text-base text-gray-800 whitespace-pre-wrap font-sans">{`${visiblePrompt}`}</pre>

          <div className="flex items-center gap-2">
            {chatItem.finished &&
              !isCollapsed &&
              chatItem?.questionType === "data_query" && (
                <div className="inline-flex gap-2 p-2 rounded backdrop-blur-sm">
                  <button
                    onClick={() => handleCapture(answerRef, "clipboard")}
                    className="bg-[#eef2ff] text-black rounded px-2 py-1 shadow-xl hover:bg-[#dbe1ff] cursor-pointer"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleCapture(answerRef, "pdf")}
                    className="bg-[#eef2ff] text-black rounded px-2 py-1 shadow-xl hover:bg-[#dbe1ff] cursor-pointer"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              )}

            {response && (
              <div
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="text-2xl text-black mr-5 cursor-pointer transition-all duration-400 shadow-xl"
              >
                {isCollapsed ? (
                  <TbTriangleInvertedFilled size={16} />
                ) : (
                  <TbTriangleFilled size={16} />
                )}
              </div>
            )}
          </div>
        </div>
        {/* {chatItem.timeStamp.start != 0 && chatItem.timeStamp.end != 0 && (
          <span className="ml-5 text-[10px]">
            {`Total: ${getPromptTime(chatItem.timeStamp)}`}
          </span>
        )} */}
      </div>
      {showBrandFlow != "" &&
        (showBrandFlow == "loader" ? (
          <div className="w-full flex justify-end ">
            <ChatLoader />
          </div>
        ) : (
          (showBrandFlow == "my-brand-question" ||
            showBrandFlow == "competitor-brand-question") && (
            <div className="w-full ml-4 pl-4 mt-2 flex flex-col justify-start gap-2 bg-transparent">
              <SelectBrand
                title={
                  showBrandFlow == "my-brand-question"
                    ? "Please select your brands :"
                    : "Please select competitor brands :"
                }
                options={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                submitBrandSelection={submitBrandSelection}
              />
            </div>
          )
        ))}

      <div
        className={`answer w-full overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[10000px] opacity-100"
        } ${Object.keys(response).length === 0 ? "hidden" : ""}`}
      >
        {/* answer */}
        <div className="relative">
          <div
            ref={answerRef}
            className="relative m-4 p-4 text-left rounded-tl-2xl rounded-bl-2xl text-lg overflow-x-auto overflow-hidden"
          >
            <div
              className="zoom-wrapper "
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: "100%",
                display: "inline-block",
              }}
            >
              {Object.entries(response).map(([agent, text]) =>
                agent == "JustASec" ||
                agent == "Presto_iGenie_Conditional_Orchestrator" ||
                // agent == "PlannerAgent" ||
                agent == "SqlGenerationAgent" ||
                agent == "SqlExecutionAgent" ? (
                  <div key={agent} className="w-full">
                    <AnimatedIconText text={getTitle(agent, text)} />
                  </div>
                ) : agent == "VizCodeGeneratorAgent" ? (
                  <div
                    key={getUniqueKey()}
                    className="w-full m-4 flex items-center justify-start"
                  >
                    <VisualsLoader />
                  </div>
                ) : (
                  <div key={agent}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      // rehypePlugins={[]}
                      rehypePlugins={[
                        rehypeRaw,
                        [rehypeSanitize, schemaWithDataUrls],
                      ]}
                      components={{
                        a({ node, ...props }) {
                          // Check if the link is a button format: `[Button Text]()`
                          const isButton =
                            props.href === "" || props.href === undefined; // Match empty URL for buttons
                          if (isButton) {
                            const label = node.children[0].value || "Button"; // Use the link text as button label
                            return (
                              <button
                                className={`px-3 py-1.5 my-1 bg-[#DFF1F4] text-black text-[0.8rem] text-left font-medium rounded-md shadow-sm ${
                                  isLoading || isStreaming
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer hover:bg-[#bcdde5] hover:shadow-md transition-all duration-300"
                                }`}
                                onClick={() => handleWhatNextPrompt(label)}
                              >
                                {label}
                              </button>
                            );
                          }
                          return <a {...props} />; // Default handling for regular links
                        },
                        table: ({ node, ...props }) => {
                          const rowIndexRef = { current: -1 }; // Reset for each table
                          return (
                            <RowIndexContext.Provider value={rowIndexRef}>
                              <table
                                className="ml-4 mt-8 border-collapse table-auto"
                                {...props}
                              />
                            </RowIndexContext.Provider>
                          );
                        },
                        thead: ({ node, ...props }) => (
                          <thead className="bg-[#00000] text-left" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="px-2 py-2 border-b bg-[#dff1f5] border-[#addadf] font-bold text-[#1e2939] text-sm"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => {
                          return (
                            <td
                              className="px-2 py-2 border-b border-[#c1d6fa] text-sm text-[#364153]"
                              {...props}
                            />
                          );
                        },
                        tr: ({ node, ...props }) => {
                          const rowIndexRef = useContext(RowIndexContext);
                          if (!rowIndexRef) return <tr {...props} />; // fallback
                          rowIndexRef.current += 1;
                          const rowIndex = rowIndexRef.current;
                          const isHeader = rowIndex === 0;
                          const bgColor = isHeader
                            ? ""
                            : rowIndex % 2 === 0
                            ? "bg-[#00000]"
                            : "bg-[#f3f4f6]";
                          return <tr className={bgColor} {...props} />;
                        },
                        h1: ({ node, ...props }) => (
                          <h1 className="text-3xl text-[#ba577d]" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-3xl my-6 text-[#ba577d]"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-xl my-8 ml-4 text-[#498d49]"
                            {...props}
                          />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4 className="text-xl my-4 ml-4" {...props} />
                        ),
                        h5: ({ node, ...props }) => (
                          <h4 className="text-lg my-4" {...props} />
                        ),
                        p({ node, children, ...props }) {
                          // Unwrap <p> if it's only wrapping an <img>
                          const firstChild = node.children[0];
                          if (
                            node.children.length === 1 &&
                            firstChild.type === "element" &&
                            firstChild.tagName === "img"
                          ) {
                            return <>{children}</>;
                          }
                          return (
                            <p className="text-sm my-2 ml-4" {...props}>
                              {children}
                            </p>
                          );
                        },
                        ul: ({ node, ...props }) => (
                          <ul className="mt-4 ml-6" {...props} />
                        ),
                        hr: ({ node, ...props }) => (
                          <hr className="mt-4" {...props} />
                        ),

                        li: ({ node, ...props }) => (
                          <li
                            className="text-sm list-disc py-1 ml-6"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {text}
                      {/* {`# Markdown heading\n\n${testHtml}`} */}
                    </ReactMarkdown>

                    {/* place images at the bottom*/}
                    {chatItem.images.length > 0 && (
                      <div className="w-full">
                        <h3 className="text-xl my-8 ml-4 text-[#498d49]">
                          Visuals 📊
                        </h3>

                        <div
                          className={`image-container m-4 flex items-center ${
                            chatItem.images.length <= 2
                              ? "justify-left"
                              : "justify-evenly"
                          } flex-wrap`}
                        >
                          {chatItem.images.map((src, idx) => (
                            <QuestionImage
                              key={idx}
                              src={src}
                              handleImageClick={handleImageClick}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* place the what is next here */}
                    {chatItem.whatIsNext != "" && chatItem.finished && (
                      <div className="w-full">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          // rehypePlugins={[]}
                          rehypePlugins={[
                            rehypeRaw,
                            [rehypeSanitize, schemaWithDataUrls],
                          ]}
                          components={{
                            a({ node, ...props }) {
                              // Check if the link is a button format: `[Button Text]()`
                              const isButton =
                                props.href === "" || props.href === undefined; // Match empty URL for buttons
                              if (isButton) {
                                const label =
                                  node.children[0].value || "Button"; // Use the link text as button label
                                return (
                                  <button
                                    className={`px-3 py-1.5 my-1 bg-[#DFF1F4] text-black text-[0.8rem] text-left font-medium rounded-full   ${
                                      isLoading || isStreaming
                                        ? "cursor-not-allowed"
                                        : "border border-[#6ec2ca] cursor-pointer shadow-sm hover:bg-[#bcdde5] hover:shadow-md transition-all duration-300"
                                    }`}
                                    onClick={() => handleWhatNextPrompt(label)}
                                  >
                                    {label}
                                  </button>
                                );
                              }
                              return <a {...props} />; // Default handling for regular links
                            },
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-3xl my-6 text-[#ba577d]"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-xl my-8 ml-4 text-[#498d49]"
                                {...props}
                              />
                            ),
                            p({ node, children, ...props }) {
                              // Unwrap <p> if it's only wrapping an <img>
                              const firstChild = node.children[0];
                              if (
                                node.children.length === 1 &&
                                firstChild.type === "element" &&
                                firstChild.tagName === "img"
                              ) {
                                return <>{children}</>;
                              }
                              return (
                                <p className="text-sm my-2 ml-4" {...props}>
                                  {children}
                                </p>
                              );
                            },
                          }}
                        >
                          {chatItem.whatIsNext}
                        </ReactMarkdown>
                      </div>
                    )}

                    {chatItem.clarifications.length > 0 && (
                      <ClarificationQuestion
                        chatItem={chatItem}
                        handleClarificationResponse={
                          handleClarificationResponse
                        }
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCardLeft;
