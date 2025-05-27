import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewQuestion,
  setMissingSelectedFoldersFlag,
} from "../../features/dashboard/dashboardSlice";
import ReactSwal from "../../utills/alert";

const Kickstarters = () => {
  const dispatch = useDispatch();
  const { folders, isStreaming, selectedFolders } = useSelector(
    (store) => store.dashboard
  );

  // useEffect(() => {
  //   console.log("isStreaming : ", isStreaming);
  // }, [isStreaming]);

  const cards = [
    { id: 1, prompt: "Positional attribute summary for my brands" },
    { id: 2, prompt: "YoY trends for my brands" },
    { id: 3, prompt: "Top 10 brands with best pulse score trend" },
    {
      id: 4,
      prompt:
        "Summarize my brand on key metrics and how are these metrics trending?",
    },
    { id: 5, prompt: "Do a SWOT analysis for my brand" },
    {
      id: 6,
      prompt:
        "Which 3 brands pose the biggest threat to my brand pulse position",
    },
    { id: 7, prompt: "Do a SWOT analysis for my competitor brand" },
  ];

  const handleKickStart = (id) => {
    if (selectedFolders == null) {
      dispatch(setMissingSelectedFoldersFlag(true));
    } else {
      const prompt = cards.find((el) => el.id === id).prompt;
      dispatch(addNewQuestion({ prompt }));
    }
  };

  return (
    <div className="w-full">
      <h2
        style={{ fontFamily: "Figtree" }}
        className="text-xl font-bold text-gray-800 mb-3"
      >
        Kickstarters
      </h2>
      <div className="flex flex-col gap-3">
        {cards.map((op) => (
          <div key={op.id}>
            <div
              className={`text-[0.7rem] text-left px-4 py-2 rounded-full font-medium shadow-sm border border-[#6ec2ca] transition-all duration-300 ${
                isStreaming
                  ? "cursor-not-allowed "
                  : "bg-transparent text-gray-800 cursor-pointer hover:bg-[#bcdde5] "
              }`}
              onClick={() => {
                if (!isStreaming) handleKickStart(op.id);
              }}
            >
              {op.prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kickstarters;
