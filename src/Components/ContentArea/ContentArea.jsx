import { useEffect, useRef, useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { slideContentToBottom } from "../../features/dashboard/dashboardSlice";

const ContentArea = () => {
  const dispatch = useDispatch();
  const currentRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const { chatList, isLoading, slideToBottom } = useSelector(
    (store) => store.dashboard
  );

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (currentRef.current) {
        setWidth(currentRef.current.getBoundingClientRect().width);
      }
    }, 400);

    const el = currentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setAutoScroll(isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const el = currentRef.current;
      if (el && autoScroll) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 400);

    return () => clearInterval(interval);
  }, [autoScroll]); // ← important!

  useEffect(() => {
    if (slideToBottom == true) {
      currentRef.current.scrollTo({
        top: currentRef.current.scrollHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        dispatch(slideContentToBottom(false));
      }, 600);
    }
  }, [slideToBottom]);

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
