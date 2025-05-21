import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactSwal from "../../utills/alert";
import ChatLoader from "../ChatLoader/ChatLoader";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Minus, RotateCw } from "lucide-react"; // Optional: icons
import handleCapture from "../../utills/handleCapture";
import getPromptTime from "../../utills/getPromptTime";
import {
  addNewQuestion,
  initChunk,
  setImage,
  setStreamingStatus,
  startChat,
  // startChat,
  updateResponseImages,
} from "../../features/dashboard/dashboardSlice";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Spinner from "../Spinner/Spinner";
import { div } from "framer-motion/client";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import QuestionImage from "./QuestionImage";
import AnimatedIconText from "../AnimatedIconText/AnimatedIconText";
import TextWithAnimatedDots from "../TextWithAnimatedDots/TextWithAnimatedDots";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import html2canvas from "html2canvas";
import { Copy, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import { Tooltip } from "react-tooltip";

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
  } = useSelector((store) => store.dashboard);

  const schemaWithDataUrls = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      img: [
        ...(defaultSchema.attributes?.img || []),
        ["src", /^data:image\/(png|jpeg|jpg|gif|webp);base64,/], // Allow base64 data URLs for common image types
      ],
    },
  };

  const { id, prompt } = chatItem;

  const [visiblePrompt, setVisiblePrompt] = useState(prompt); // this is the prompt that will be visible
  const [selectedMyBrands, setSelectedMyBrands] = useState(null);
  const [selectedCompetitorBrands, setSelectedCompetitorBrands] =
    useState(null);

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
    const brands = [];
    myBrands.map((name) => {
      brands.push({ name, selected: false });
    });
    setSelectedMyBrands(brands);
  }, [myBrands]);

  useEffect(() => {
    const brands = [];
    competitorBrands.map((name) => {
      brands.push({ name, selected: false });
    });
    setSelectedCompetitorBrands(brands);
  }, [competitorBrands]);

  useEffect(() => {
    setResponse(chatItem.response);
  }, [chatItem]);

  useEffect(() => {
    if (chatItem.finished == false) {
      if (
        prompt.toLowerCase().includes("my brand") ||
        prompt.toLowerCase().includes("competitor brand")
      ) {
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
    dispatch(addNewQuestion({ prompt: inputPrompt }));
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

  // handle clicks on brands
  const handleMyBrandSelect = (item) => {
    item.selected = !item.selected;
    const tmpArr = selectedMyBrands.map((elm) =>
      elm.name === item.name ? item : elm
    );

    setSelectedMyBrands(tmpArr);
  };
  const handleCompetitorsBrandSelect = (item) => {
    item.selected = !item.selected;
    const tmpArr = selectedCompetitorBrands.map((elm) =>
      elm.name === item.name ? item : elm
    );

    setSelectedCompetitorBrands(tmpArr);
  };

  // submit prompt with my-brands
  const submitBrandSelectPrompt = () => {
    let newPrompt = "";
    if (showBrandFlow == "my-brand-question") {
      if (selectedMyBrands.some((brand) => brand.selected === true)) {
        const brands = `${selectedMyBrands
          .filter((brand) => brand.selected)
          .map((brand) => brand.name)
          .join(", ")}`;

        newPrompt = chatItem.prompt.replace("my brand", `${brands}`);
      }
    } else if (showBrandFlow == "competitor-brand-question") {
      if (selectedCompetitorBrands.some((brand) => brand.selected === true)) {
        const brands = `${selectedCompetitorBrands
          .filter((brand) => brand.selected)
          .map((brand) => brand.name)
          .join(", ")}`;

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

  const getTitle = (agent) => {
    if (agent == "SqlExecutionAgent") {
      return "Fetching: " + visiblePrompt;
    }
    return authorKeys[agent]?.label;
  };

  const getUniqueKey = () => {
    const key = uuidv4();
    return key;
  };

  return (
    <div className="bg-white" style={{ width: `${leftWidth}px` }}>
      {/* prompt */}
      <div className="w-full bg-white">
        <div className="w-full mx-4 px-4 py-2 text-left rounded-2xl border-l-3 border-[#5fbbc5] flex items-center justify-between bg-[#FFFABF] ">
          {/* <div className="w-full flex flex-col text-base font-semibold">{`${visiblePrompt}`}</div> */}
          <div className="text-lg text-gray-800 tracking-wide">{`${visiblePrompt}`}</div>

          <div className="flex items-center gap-2">
            {chatItem.finished && !isCollapsed && (
              <div>
                <div className="inline-flex gap-2 p-2 rounded backdrop-blur-sm bg-amber-100">
                  <button
                    onClick={() => handleCapture("clipboard")}
                    className="bg-[#eef2ff] text-black rounded px-2 py-1 shadow-xl hover:bg-[#dbe1ff] cursor-pointer"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleCapture("pdf")}
                    className="bg-[#eef2ff] text-black rounded px-2 py-1 shadow-xl hover:bg-[#dbe1ff] cursor-pointer"
                  >
                    <FileText size={16} />
                  </button>
                </div>
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
        {chatItem.timeStamp.start != 0 && chatItem.timeStamp.end != 0 && (
          <span className="ml-5 text-[10px]">
            {`Total: ${getPromptTime(chatItem.timeStamp)}`}
          </span>
        )}
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
              <div
                className={`mt-2 w-full flex justify-right gap-2 items-center `}
              >
                <p className="w-fit py-1">
                  {showBrandFlow == "my-brand-question"
                    ? "Please select your brands :"
                    : "Please select competitor brands :"}
                </p>
                {/* options */}
                {showBrandFlow == "my-brand-question" && (
                  <div className="flex items-center gap-2 ">
                    {selectedMyBrands?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={`text-sm w-fit px-2 py-1 rounded-2xl cursor-pointer transition-colors duration-300 ${
                            item.selected
                              ? "bg-[#5fbbc5] text-black"
                              : "bg-black text-white"
                          }`}
                          onClick={() => handleMyBrandSelect(item)}
                        >
                          {item.name}
                        </div>
                      );
                    })}
                  </div>
                )}
                {showBrandFlow === "competitor-brand-question" &&
                  (selectedCompetitorBrands.length <= 5 ? (
                    <div className="flex items-center gap-2">
                      {selectedCompetitorBrands?.map((item, index) => (
                        <div
                          key={index}
                          className={`text-sm w-fit px-2 py-1 rounded-2xl cursor-pointer transition-colors duration-300 ${
                            item.selected
                              ? "bg-[#5fbbc5] text-black"
                              : "bg-black text-white"
                          }`}
                          onClick={() => handleCompetitorsBrandSelect(item)}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-[500px]">
                      <MultiSelectDropdown
                        op={selectedCompetitorBrands}
                        setSelectedCompetitorBrands={
                          setSelectedCompetitorBrands
                        }
                      />
                    </div>
                  ))}

                {/* proceed */}
                <button
                  className="bg-indigo-50 mt-1 py-1 px-4 text-blue-900 rounded-2xl shadow-sm cursor-pointer hover:bg-indigo-100 transition-all duration-400 mb-2"
                  onClick={submitBrandSelectPrompt}
                >
                  Proceed
                </button>
              </div>
            </div>
          )
        ))}

      <div
        className={`answer w-full overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[10000px] opacity-100"
        } ${Object.keys(response).length === 0 ? "hidden" : ""}`}
      >
        {/* seperation line */}
        {/* <div
          className={`mx-4 mt-2 mb-2 h-[.2rem] bg-gray-200 rounded-full`}
        ></div> */}
        {/* answer */}
        <div className="relative">
          <div
            ref={answerRef}
            className="relative m-4 p-4 text-left rounded-tl-2xl rounded-bl-2xl text-lg border-l-2 overflow-x-auto overflow-hidden"
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
                // agent == "PlannerAgent" ||
                agent == "SqlGenerationAgent" ||
                agent == "SqlExecutionAgent" ? (
                  <div key={agent} className="aaa">
                    <AnimatedIconText text={getTitle(agent)} />
                  </div>
                ) : agent == "VizCodeGeneratorAgent" ? (
                  <div
                    key={getUniqueKey()}
                    className="w-full flex items-center justify-start"
                  >
                    <ChatLoader />
                  </div>
                ) : (
                  <div key={agent}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      // rehypePlugins={[]}
                      rehypePlugins={[[rehypeSanitize, schemaWithDataUrls]]}
                      components={{
                        // img({ node, ...props }) {
                        //   let src = props.src || "";
                        //   if (!src.startsWith("data:image")) {
                        //     src = "data:image/png;base64," + src;
                        //   }

                        //   return null; // don't render the image here
                        // },
                        a({ node, ...props }) {
                          // Check if the link is a button format: `[Button Text]()`
                          const isButton =
                            props.href === "" || props.href === undefined; // Match empty URL for buttons
                          if (isButton) {
                            const label = node.children[0].value || "Button"; // Use the link text as button label
                            return (
                              <button
                                className="px-3 py-1.5 my-1 bg-[#eef2ff] text-black text-[0.8rem] text-left font-medium rounded-md shadow-lg hover:bg-[#e0e7ff] hover:shadow-md transition-all duration-200 cursor-pointer "
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
                                className="border-collapse table-auto"
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
                            className="px-2 py-2 border-b bg-[#d0ecea] border-[#6ba3f6] font-bold text-[#1e2939] text-sm"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            className="px-2 py-2 border-b border-[#c1d6fa] text-sm text-[#364153]"
                            {...props}
                          />
                        ),
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
                          <h1 className="text-2xl" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-2xl my-10" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-xl my-8" {...props} />
                        ),
                        h4: ({ node, ...props }) => (
                          <h4 className="text-xl my-6" {...props} />
                        ),
                        h5: ({ node, ...props }) => (
                          <h4 className="text-lg my-6" {...props} />
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
                            <p className="text-sm my-1" {...props}>
                              {children}
                            </p>
                          );
                        },
                        ul: ({ node, ...props }) => (
                          <ul className="mt-1" {...props} />
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
                    </ReactMarkdown>

                    {/* place images at the bottom*/}
                    {chatItem.images.length > 0 && (
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
