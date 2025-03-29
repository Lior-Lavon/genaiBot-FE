import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewQuestion,
  setPromptView,
} from "../../features/dashboard/dashboardSlice";
import myBg from "../../assets/pattern.png";

const PromptView = () => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState("How is my brand performing ?");
  const { isPromptView } = useSelector((store) => store.dashboard);

  const handleOnChange = (e) => {
    setPrompt(e.target.value);
  };
  const handlePrompt = () => {
    dispatch(addNewQuestion({ prompt }));
    setTimeout(() => {
      dispatch(setPromptView());
    }, 300);
  };

  return (
    <div
      className={`h-full rounded-tr-2xl rounded-br-2xl bg-white flex overflow-hidden transition-all duration-500 ease-in-out shadow-xl ${
        isPromptView ? "translate-x-0" : "-translate-x-[98%]"
      }`}
    >
      <div className="w-full">
        <div className="h-full w-full flex items-center justify-between gap-4 p-4 bg-gray-100">
          <input
            type="text"
            value={prompt}
            onChange={handleOnChange}
            placeholder="Type here your question..."
            className="w-full border border-gray-300 rounded-md  px-4 py-2 bg-white"
          />
          <button
            className="border rounded-md px-4 py-1 text-white bg-gray-800 hover:bg-gray-900 shadow-lg cursor-pointer"
            onClick={handlePrompt}
          >
            Send
          </button>
        </div>
      </div>
      <div
        className="w-6 h-full rounded-tr-2xl rounded-br-2xl bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${myBg})`, backgroundColor: "red" }}
        onClick={() => {
          dispatch(setPromptView());
        }}
      ></div>
    </div>
  );
};

export default PromptView;
