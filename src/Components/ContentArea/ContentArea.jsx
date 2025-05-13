import { memo, useEffect, useRef, useState } from "react";
import QuestionCard from "../QuestionCard/QuestionCard";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { slideContentToBottom } from "../../features/dashboard/dashboardSlice";

const ContentArea = memo(() => {
  const dispatch = useDispatch();
  const currentRef = useRef(null);
  const slideToBottomRef = useRef(false);
  const { chatList, slideToBottom } = useSelector((store) => store.dashboard);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    slideToBottomRef.current = slideToBottom;
  }, [slideToBottom]);

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
        {chatList.length > 0 && <div className="w-full h-22"></div>}
      </div>
    </div>
  );
});

export default ContentArea;
