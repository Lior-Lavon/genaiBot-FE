import React from "react";
import QuestionCardLeft from "./QuestionCardLeft";
import QuestionCardRight from "./QuestionCardRight";

const QuestionCard = () => {
  return (
    <div className="w-full h-[250px] flex">
      <QuestionCardLeft />
      <QuestionCardRight />
    </div>
  );
};

export default QuestionCard;
