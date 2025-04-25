import { useEffect, useRef, useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { slideContentToBottom } from "../../features/dashboard/dashboardSlice";

const ContentArea = () => {
  const dispatch = useDispatch();
  const currentRef = useRef(null);
  const { chatList, isLoading, slideToBottom } = useSelector(
    (store) => store.dashboard
  );

  const [width, setWidth] = useState(0);

  // Function to scroll to the bottom
  const handleAutoScroll = () => {
    if (currentRef.current) {
      currentRef.current.scrollTo({
        top: currentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // UseEffect for slideToBottom flag
  useEffect(() => {
    if (slideToBottom && currentRef.current) {
      handleAutoScroll();
      dispatch(slideContentToBottom(false)); // Reset slideToBottom flag
    }
  }, [slideToBottom]);

  // UseEffect to observe when new content is added or QuestionCards grow
  useEffect(() => {
    // We need a MutationObserver to monitor changes in content height
    const observer = new MutationObserver(() => {
      handleAutoScroll();
    });

    // Start observing the currentRef for any content changes
    if (currentRef.current) {
      observer.observe(currentRef.current, {
        childList: true, // Listen to changes to child elements
        subtree: true, // Listen to changes within the children
      });
    }

    // Cleanup observer when component unmounts or chatList changes
    return () => {
      if (currentRef.current) {
        observer.disconnect();
      }
    };
  }, [chatList]); // Run this effect every time the chatList changes (new message)

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div
        ref={currentRef}
        className="w-full h-full overflow-y-auto bg-white mt-5"
      >
        {chatList.map((chat, index) => {
          return (
            <QuestionCard key={chat.id} chatItem={chat} initWidth={width} />
          );
        })}
        <div className="w-full h-16"></div>
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
};

export default ContentArea;
