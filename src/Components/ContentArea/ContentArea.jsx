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

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div ref={currentRef} className="w-full h-full overflow-y-auto bg-white">
        {chatList.map((chat) => {
          return (
            <QuestionCard key={chat.id} chatItem={chat} initWidth={width} />
          );
        })}
      </div>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 z-999 bg-transparent">
          <div className="w-[500px] h-[250px] bg-white rounded-2xl flex items-center justify-center ">
            <Spinner />
            <p>Loading ... </p>
          </div>
        </div>
      )}
    </div>
  );

  // return isLoading ? (
  //   <div className="w-full h-full flex items-center justify-center ">
  //     <div className="w-[500px] h-[250px] bg-white flex items-center justify-center">
  //       {console.log("isLoading")}
  //       <Spinner />
  //       <p>Loading ... </p>
  //     </div>
  //   </div>
  // ) : (
  //   <div ref={currentRef} className="w-full h-full overflow-y-auto bg-white">
  //     {chatList.map((chat) => {
  //       return <QuestionCard key={chat.id} chatItem={chat} initWidth={width} />;
  //     })}
  //   </div>
  // );
};

export default ContentArea;
