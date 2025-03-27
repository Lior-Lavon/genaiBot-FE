import React from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { useSelector } from "react-redux";

const ContentArea = () => {
  const { chatList } = useSelector((store) => store.dashboard);

  return (
    <div className="text-center px-2 overflow-y-auto">
      {chatList.map((chat) => {
        return <QuestionCard key={chat.id} chatItem={chat} />;
      })}
    </div>
  );
};

export default ContentArea;
