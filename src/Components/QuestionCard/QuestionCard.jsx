import React, { useEffect, useRef, useState } from "react";
import QuestionCardLeft from "./QuestionCardLeft";
import QuestionCardRight from "./QuestionCardRight";
import { useSelector } from "react-redux";

const QuestionCard = ({ chatItem, initWidth }) => {
  const [width, setWidth] = useState(initWidth);
  const rightCardRef = useRef(null);
  const currentRef = useRef(null);

  const { isRightDrawerOpen } = useSelector((store) => store.dashboard);

  const { isLeftDrawer } = useSelector((store) => store.dashboard);

  useEffect(() => {
    calculateContentWidth(0);
  }, []);

  useEffect(() => {
    calculateContentWidth(0);
  }, [isRightDrawerOpen]);

  useEffect(() => {
    setTimeout(() => {
      calculateContentWidth();
    }, 320);
  }, [isLeftDrawer]);

  const calculateContentWidth = (delta) => {
    if (currentRef.current) {
      if (!isRightDrawerOpen) {
        setWidth(currentRef.current.getBoundingClientRect().width);
      } else {
        setWidth(currentRef.current.getBoundingClientRect().width - 160);
      }
    }
  };

  return (
    <div ref={currentRef} className="w-full flex bg-white">
      <QuestionCardLeft chatItem={chatItem} leftWidth={width} />
      <QuestionCardRight chatItem={chatItem} ref={rightCardRef} />
    </div>
  );
};

export default QuestionCard;
