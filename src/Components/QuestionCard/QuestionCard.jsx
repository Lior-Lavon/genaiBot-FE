import React from "react";
import QuestionCardLeft from "./QuestionCardLeft";
import QuestionCardRight from "./QuestionCardRight";

const QuestionCard = ({ chatItem }) => {
  return (
    <div className="w-full flex">
      <QuestionCardLeft chatItem={chatItem} />
      <QuestionCardRight />
    </div>
  );
};

export default QuestionCard;
