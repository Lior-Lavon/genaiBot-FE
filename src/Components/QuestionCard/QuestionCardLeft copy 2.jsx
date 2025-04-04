import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Minus, RotateCw } from "lucide-react"; // Optional: icons
import {
  setImage,
  setRightDrawer,
  updateResponse,
  updateResponseImages,
} from "../../features/dashboard/dashboardSlice";
import { debounce } from "lodash";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { div } from "framer-motion/client";
import Spinner from "../Spinner/Spinner";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const QuestionCardLeft = ({ chatItem, leftWidth }) => {
  const dispatch = useDispatch();
  const { folders } = useSelector((store) => store.dashboard);

  const { id, prompt } = chatItem;

  const [isConnected, setIsConnected] = useState(false);
  const [response, setResponse] = useState("");
  const [streamComplete, setStreamComplete] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isWaiting, setIsWaiting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const answerRef = useRef(null);

  const url = import.meta.env.VITE_SERVER_CHAT_URL;

  const outputRef = useRef(null);
  const wsRef = useRef(null);

  let rowIndex = -1;
  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 2;

  const RowIndexContext = createContext();

  const handleDrawer = () => {
    // dispatch(setRightDrawer());
  };

  const connectWebSocket = (url) => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        // console.log("✅ WebSocket connected");
        resolve(ws); // connection established
      };

      ws.onmessage = (event) => {
        const text = event.data;

        // Stop rendering when pipeline ends
        if (text.includes("Pipeline run completed.")) {
          console.log("Pipeline run completed.");
          setStreamComplete(true);
          return;
        }

        // Skip metadata blocks
        const ignoreKeywords = [
          "CONTEXT REPHRASER",
          "MEMORY",
          "SELECTER",
          "ROUTER",
          "TOOL CONTEXT LLM",
        ];

        // If the text contains any system keywords, ignore it
        if (ignoreKeywords.some((keyword) => text.includes(keyword))) {
          return;
        }

        // Otherwise, keep streaming it
        setResponse((prev) => prev + text);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket connection closed");
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error", err);
        reject(err);
      };

      // Optional: handle onclose, etc.
    });
  };

  useEffect(() => {
    connectWebSocket(url)
      .then((ws) => {
        wsRef.current = ws;

        setIsConnected(true);
        setStreamComplete(false); // reset on reconnect
        console.log("Connected to WebSocket");
      })
      .catch((err) => {
        console.error("Failed to connect:", err);
      });
  }, []);

  useEffect(() => {
    if (isConnected) {
      handleSendPrompt();
    }
  }, [isConnected]);

  // send the prompt
  const handleSendPrompt = () => {
    if (!isConnected || !prompt)
      return alert("WebSocket must be connected and prompt provided");

    setResponse("");
    setStreamComplete(false);
    setIsWaiting(true);
    // wsRef.current.send(prompt);

    const promptWithFolders = { ...folders, Prompt: prompt };
    // console.log("promptWithFolders : ", promptWithFolders);
    wsRef.current.send(JSON.stringify(promptWithFolders));
  };

  useEffect(() => {
    const container = answerRef.current;
    if (!container) return;

    const contentEl = container.querySelector(".zoom-wrapper");
    if (!contentEl) return;

    let intervalId;

    const resize = () => {
      const scaledHeight = contentEl.getBoundingClientRect().height;
      container.style.height = `${scaledHeight + 40}px`; // extra space buffer
    };

    // ⏱️ 1. Resize periodically during streaming
    if (!streamComplete) {
      intervalId = setInterval(resize, 100);
    }

    // 📸 2. Resize on image load (even after streaming ends)
    const observer = new MutationObserver(() => {
      const imgs = contentEl.querySelectorAll("img");

      imgs.forEach((img) => {
        if (!img.dataset.resized) {
          img.addEventListener("load", resize);
          img.dataset.resized = "true"; // prevent double-listening
        }
      });
    });

    observer.observe(contentEl, {
      childList: true,
      subtree: true,
    });

    // Initial resize
    resize();

    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, [response, zoom, streamComplete]);

  useEffect(() => {
    if (streamComplete) {
      // Stop the waiting indicator as soon as the first chunk arrives
      setIsWaiting(false);

      setTimeout(() => {
        dispatch(updateResponse({ id, response }));
        // getAllImages();
        console.log("update markdown here");
      }, 1000);
    }
  }, [streamComplete]);

  const getAllImages = () => {
    if (answerRef.current) {
      const imgs = answerRef.current.querySelectorAll("img");
      const imgArray = Array.from(imgs);

      const imageList = [];
      // extract the blob from the images
      for (let i = 0; i < imgArray.length; i++) {
        const base64Data = imgArray[i].src;
        imageList.push({ id: i + 1, src: base64Data });
      }

      dispatch(updateResponseImages({ id, images: imageList }));
    }
  };

  const extractBase64Image = (bufferText, index) => {
    // This regex matches base64 image data URIs
    const base64Images = bufferText.match(
      /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g
    );

    if (!base64Images || index < 0 || index >= base64Images.length) {
      throw new Error("Invalid index or no images found.");
    }

    return base64Images[index];
  };

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

  return (
    <div className="bg-white" style={{ width: `${leftWidth}px` }}>
      {/* prompt */}
      <div className="w-full bg-white">
        <div className="w-full m-4 p-4 text-left rounded-2xl text-xl border-l-3 border-blue-500 flex items-center justify-between bg-[#eef2ff] ">
          {prompt}

          <div className={`flex gap-2 items-center mr-5`}>
            {isWaiting && <Spinner />}
            {streamComplete && (
              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="transition-transform duration-200"
                title={isCollapsed ? "Show Answer" : "Hide Answer"}
              >
                {isCollapsed ? (
                  <IoIosArrowDown className="w-8 h-8" />
                ) : (
                  <IoIosArrowUp className="w-8 h-8" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* <div className={`answer w-full ${response == "" ? "hidden" : ""}`}> */}
      <div
        className={`answer w-full overflow-hidden transition-all duration-500 ease-in-out ${
          response === "" || isCollapsed
            ? "max-h-0 opacity-0"
            : "max-h-[5000px] opacity-100"
        }`}
      >
        {/* seperation line */}
        <div className={`m-4 h-[.2rem] bg-gray-200 rounded-full`}></div>
        {/* answer */}
        <div className="relative">
          {/* Zoom Controls Wrapper */}
          <div className="sticky top-0 z-10 flex justify-end pr-4">
            <div className="inline-flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded shadow-md">
              <button
                onClick={handleZoomIn}
                className="bg-blue-500 text-white rounded px-2 py-1 shadow-sm hover:bg-blue-600"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-blue-500 text-white rounded px-2 py-1 shadow-sm hover:bg-blue-600"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={handleZoomReset}
                className="bg-blue-500 text-white rounded px-2 py-1 shadow-sm hover:bg-blue-600"
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>

          <div
            ref={answerRef}
            className="relative m-4 p-4 text-left rounded-tl-2xl rounded-bl-2xl text-lg border-l-2 overflow-x-auto overflow-hidden "
          >
            {/* Scaled content wrapper */}
            <div
              className="zoom-wrapper "
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: "100%",
                display: "inline-block",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img({ node, ...props }) {
                    const [loading, setLoading] = useState(true);
                    const isBase64 = props.src?.startsWith("data:image");
                    let finalSrc = props.src;
                    if (!finalSrc || finalSrc.trim() === "") {
                      if (props.srcSet) {
                        // Extract first URL from srcSet
                        finalSrc = extractBase64Image(props.srcSet, 0);
                      } else {
                        console.warn(
                          "⚠️ Empty image src and no srcSet available."
                        );
                      }
                    }
                    return (
                      <div className="relative w-full my-4">
                        {loading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded border">
                            <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
                          </div>
                        )}
                        <img
                          loading="lazy"
                          decoding="async"
                          {...props}
                          src={finalSrc}
                          onLoad={() => setLoading(false)}
                          className={`rounded shadow max-w-full transition-opacity duration-300 cursor-pointer ${
                            loading ? "opacity-0" : "opacity-100"
                          } ${isBase64 ? "border" : ""}`}
                          alt={props.alt || "Image"}
                          onClick={handleImageClick}
                        />
                      </div>
                    );
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
                      className="px-2 py-2 border-b border-blue-300 font-bold text-blue-700 text-sm"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="px-2 py-2 border-b border-blue-200 text-sm text-blue-800"
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
                      : "bg-[#d0ecea]";

                    return <tr className={bgColor} {...props} />;
                  },

                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl mt-4" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl mt-4" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xl mt-2" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-sm mt-1" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="mt-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-sm list-disc my-1 ml-2" {...props} />
                  ),
                }}
              >
                {response}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCardLeft;
