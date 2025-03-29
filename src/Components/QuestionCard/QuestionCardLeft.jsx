import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Minus, RotateCw } from "lucide-react"; // Optional: icons
import {
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

const QuestionCardLeft = ({ chatItem, leftWidth }) => {
  const dispatch = useDispatch();
  const { id, prompt } = chatItem;

  const [isConnected, setIsConnected] = useState(false);
  const [response, setResponse] = useState("");
  const [streamComplete, setStreamComplete] = useState(false);

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
    wsRef.current.send(prompt);
  };

  useEffect(() => {
    if (answerRef.current) {
      const container = answerRef.current;
      const content = container.querySelector("div"); // the actual markdown content
      if (content && container.offsetWidth < content.scrollWidth) {
        const scaleRatio = container.offsetWidth / content.scrollWidth;

        setZoom(Math.max(scaleRatio * 0.95, MIN_ZOOM));
      }
    }

    // if (!streamComplete && outputRef.current) {
    //   outputRef.current.scrollTop = outputRef.current.scrollHeight;
    // }
  }, [response, streamComplete]);

  useEffect(() => {
    if (streamComplete) {
      // Stop the waiting indicator as soon as the first chunk arrives
      setIsWaiting(false);

      setTimeout(() => {
        dispatch(updateResponse({ id, response }));
        getAllImages();
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

  return (
    <div className="bg-gray-100" style={{ width: `${leftWidth}px` }}>
      {/* prompt */}
      <div className="w-full">
        <div className="w-full m-4 p-4 text-left rounded-2xl text-xl border-l-3 flex items-center justify-between ">
          {prompt}

          {isWaiting && (
            <div className={`mr-5`}>
              <Spinner />
            </div>
          )}
        </div>
      </div>

      <div className={`answer w-full ${response == "" ? "hidden" : ""}`}>
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
                          className={`rounded shadow max-w-full transition-opacity duration-300 ${
                            loading ? "opacity-0" : "opacity-100"
                          } ${isBase64 ? "border" : ""}`}
                          alt={props.alt || "Image"}
                        />
                      </div>
                    );
                  },
                  table: ({ node, ...props }) => (
                    <table className="border-collapse table-auto" {...props} />
                  ),
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
                    rowIndex++;
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
