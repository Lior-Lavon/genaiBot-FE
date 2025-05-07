import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewQuestion,
  setMissingSelectedFoldersFlag,
  setPromptView,
  testFunc,
} from "../../features/dashboard/dashboardSlice";
import myBg from "../../assets/pattern.png";
import ReactSwal from "../../utills/alert";
import { FaArrowUp } from "react-icons/fa6";
import { div } from "framer-motion/client";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

const PromptView = () => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("How is Tigi performing ?");
  const { isPromptView, selectedFolders, isStreaming, isLoading } = useSelector(
    (store) => store.dashboard
  );

  const handleOnChange = (e) => {
    setPrompt(e.target.value);
  };
  const handlePrompt = () => {
    dispatch(testFunc());
    if (selectedFolders == null) {
      dispatch(setMissingSelectedFoldersFlag(true));
    } else {
      if (!isStreaming && !isLoading) {
        dispatch(addNewQuestion({ prompt }));
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePrompt();
    }
  };

  return (
    <div className="w-full h-14 flex justify-center ">
      <div className="w-full max-w-[1000px] h-full flex items-center justify-between gap-4 p-2 bg-white rounded-2xl shadow-lg border border-gray-200">
        <input
          type="text"
          value={prompt}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          placeholder="Please ask Presto !"
          className="w-full border border-gray-100 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-0 focus:border-gray-300"
        />
        <button
          className={`w-11 h-9 flex items-center justify-center rounded-md text-white text-xl ${
            prompt == "" ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"
          }  shadow-lg cursor-pointer `}
          onClick={handlePrompt}
          disabled={prompt == ""}
        >
          {isStreaming || isLoading ? (
            <div className="w-4.5 h-4.5 bg-white rounded-sm"></div>
          ) : (
            <FaArrowUp />
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptView;
