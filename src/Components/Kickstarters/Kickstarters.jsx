import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewQuestion,
  slideContentToBottom,
} from "../../features/dashboard/dashboardSlice";
import ReactSwal from "../../utills/alert";
import { div } from "framer-motion/client";

const Kickstarters = () => {
  const dispatch = useDispatch();
  const { folders } = useSelector((store) => store.dashboard);
  const cards = [
    {
      id: 1,
      prompt: "Positional attribute summary for my brands",
    },
    {
      id: 2,
      prompt: "YoY trends for my brands",
    },
    {
      id: 3,
      prompt: "Top 10 brands with best pulse score trend",
    },
    {
      id: 4,
      prompt:
        "Summarize my brand [MY_BRAND] on key metrics and how are these metrics trending?",
    },
    {
      id: 5,
      prompt: "Do a SWOT analysis for my brand [MY_BRAND]",
    },
    {
      id: 6,
      prompt:
        "My brand is [MY_BRAND]. Which 3 brands pose the biggest threat to my brand pulse position",
    },
    {
      id: 7,
      prompt: "Do a SWOT analysis for my competitor brand [COMPETITOR_BRAND]",
    },
  ];

  const handleKickStart = (id) => {
    if (folders == null) {
      ReactSwal.fire({
        icon: "warning",
        title: "Heads up!",
        text: "Please select a client, product and category from the sidebar before asking questions.",
      });
    } else {
      const prompt = cards.find((el) => el.id == id).prompt;
      dispatch(addNewQuestion({ prompt }));
      dispatch(slideContentToBottom(true));
    }
  };

  const getPromptText = (prompt) => {
    let ret = prompt
      .replace(/\[MY_BRAND\]/g, "")
      .replace(/\[COMPETITOR_BRAND\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // return ret.slice(0, 60);
    return ret;
  };

  return (
    <div className="w-full">
      {/* <div className="w-full h-[0.1rem] bg-gray-200 mb-2"></div> */}
      <h2 className="text-xl font-bold text-gray-800 mb-3">Kickstarters</h2>
      <div className="flex flex-col gap-3 ">
        {cards.map((op) => (
          <div key={op.id}>
            <div
              className="text-[0.7rem] text-left bg-indigo-50 hover:bg-indigo-100 text-gray-800 font-medium px-4 py-2 rounded-xl border-l-4 border-gray-800 shadow-sm cursor-pointer transition-all duration-400"
              onClick={() => handleKickStart(op.id)}
            >
              {getPromptText(op.prompt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kickstarters;
