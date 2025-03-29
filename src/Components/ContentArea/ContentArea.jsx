import { useEffect, useRef, useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { useSelector } from "react-redux";

const ContentArea = () => {
  const currentRef = useRef(null);
  const { chatList } = useSelector((store) => store.dashboard);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (currentRef.current) {
        setWidth(currentRef.current.getBoundingClientRect().width);
      }
    }, 400);
  }, []);

  return (
    <div ref={currentRef} className="w-full h-full overflow-y-auto ">
      {chatList.map((chat) => {
        return <QuestionCard key={chat.id} chatItem={chat} initWidth={width} />;
      })}
    </div>
  );
};

export default ContentArea;
