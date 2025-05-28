import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewQuestion,
  setMissingSelectedFoldersFlag,
  setPromptView,
} from "../../features/dashboard/dashboardSlice";
import ReactSwal from "../../utills/alert";
import { FaArrowUp } from "react-icons/fa6";
import { div } from "framer-motion/client";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoTriangle } from "react-icons/io5";

const PromptView = () => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("");
  const { isPromptView, selectedFolders, isStreaming, isLoading } = useSelector(
    (store) => store.dashboard
  );

  const handleOnChange = (e) => {
    setPrompt(e.target.value);
  };
  const handlePrompt = () => {
    if (selectedFolders == null) {
      dispatch(setMissingSelectedFoldersFlag(true));
    } else {
      if (!isStreaming && !isLoading) {
        dispatch(addNewQuestion({ prompt }));
      }
    }
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePrompt();
    }
  };

  return (
    <div className="w-full h-14 flex justify-center ">
      <div className="w-full max-w-[1000px] h-full flex items-center justify-between gap-4 p-2 bg-white rounded-full border border-[#5fbac4]">
        <input
          type="text"
          value={prompt}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          placeholder="Please ask Presto !"
          className="w-full rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-0"
        />
        <button
          className={`w-11 h-11 flex items-center justify-center text-white text-xl border border-[#f79b37] rounded-full bg-white ${
            prompt == "" ? "bg-gray-400" : "bg-gray-100 hover:bg-gray-100"
          }  ${
            isStreaming || isLoading ? "cursor-not-allowed" : "cursor-pointer"
          } `}
          onClick={handlePrompt}
          disabled={prompt == ""}
        >
          {isStreaming || isLoading ? (
            <div className="w-4.5 h-4.5 bg-[#353651] rounded-sm"></div>
          ) : (
            <IoTriangle className="text-[#353651]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptView;
