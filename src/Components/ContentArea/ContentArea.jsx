import { useEffect, useRef, useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

const ContentArea = () => {
  const currentRef = useRef(null);
  const { chatList, isLoading } = useSelector((store) => store.dashboard);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (currentRef.current) {
        setWidth(currentRef.current.getBoundingClientRect().width);
      }
    }, 400);
  }, []);

  return isLoading ? (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="w-[500px] h-[250px] bg-white flex items-center justify-center">
        {console.log("isLoading")}
        <Spinner />
        <p>Loading ... </p>
      </div>
    </div>
  ) : (
    <div ref={currentRef} className="w-full h-full overflow-y-auto bg-white">
      {chatList.map((chat) => {
        return <QuestionCard key={chat.id} chatItem={chat} initWidth={width} />;
      })}
    </div>
  );
};

export default ContentArea;
