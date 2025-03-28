import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const QuestionCardLeft = ({ chatItem }) => {
  const dispatch = useDispatch();
  const { id, prompt } = chatItem;

  const [isConnected, setIsConnected] = useState(false);
  const [response, setResponse] = useState("");
  const [streamComplete, setStreamComplete] = useState(false);
  // const [isWaiting, setIsWaiting] = useState(false);

  const url = import.meta.env.VITE_SERVER_CHAT_URL;

  const outputRef = useRef(null);
  const wsRef = useRef(null);
  const markdownRef = useRef(null);

  let rowIndex = -1;

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

        // Stop the waiting indicator as soon as the first chunk arrives
        // setIsWaiting(false);

        // Stop rendering when pipeline ends
        if (text.includes("Pipeline run completed.")) {
          console.log("Pipeline run completed.");
          setStreamComplete(true);
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
    // setIsWaiting(true); // ✅ show loader
    wsRef.current.send(prompt);
  };

  useEffect(() => {
    if (!streamComplete && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [response, streamComplete]);

  useEffect(() => {
    if (streamComplete) {
      setTimeout(() => {
        dispatch(updateResponse({ id, response }));
        getAllImages();
        console.log("update markdown here");
      }, 1000);
    }
  }, [streamComplete]);

  const getAllImages = () => {
    if (markdownRef.current) {
      const imgs = markdownRef.current.querySelectorAll("img");
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

  return (
    <div className="m-1 flex-1 bg-gray-100 rounded-xl">
      {/* prompt */}
      <div className="w-full">
        <div className="w-full m-4 p-4 text-left rounded-2xl text-xl border-l-3 border-blue-400 ">
          {prompt}
        </div>
      </div>

      <div className="m-4 h-[.2rem] bg-gray-200 rounded-full"></div>

      {/* answer */}
      <div className="answer w-full">
        <div
          ref={markdownRef}
          className="m-4 p-4 text-left rounded-2xl text-lg border-l-2"
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
                    console.warn("⚠️ Empty image src and no srcSet available.");
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
                <table
                  className="w-full border-collapse table-auto"
                  {...props}
                />
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-[#00000] text-left" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="px-2 py-2 border-b border-blue-300 font-bold text-blue-700 text-sm whitespace-nowrap"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="px-2 py-2 border-b border-blue-200 text-sm text-blue-800 whitespace-nowrap"
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
            }}
          >
            {response}
          </ReactMarkdown>

          {/* <pre className="whitespace-pre-wrap font-mono text-sm text-black">
            {response}
          </pre> */}
        </div>
      </div>
    </div>
  );
};

export default QuestionCardLeft;
