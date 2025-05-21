import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "../../features/dashboard/dashboardSlice";
import { div } from "framer-motion/client";

const QuestionCardRight = ({ chatItem, ref }) => {
  const dispatch = useDispatch();

  const { isRightDrawerOpen } = useSelector((store) => store.dashboard);

  useEffect(() => {}, [isRightDrawerOpen]);

  const handleImageClick = (e) => {
    const imgId = e.target.id;
    dispatch(setImage({ show: true, id: parseInt(imgId) }));
  };

  return (
    <div
      ref={ref}
      className={`mx-1 transition-all duration-300 ease-in-out bg-blue-400 ${
        isRightDrawerOpen ? "w-40" : "w-0"
      }`}
    >
      <div className="w-full h-full">
        <div className="p-2 flex flex-col gap-3">
          {chatItem?.images.map((imgItem) => {
            return (
              <img
                key={imgItem.id}
                id={imgItem.id}
                src={imgItem.src}
                alt=""
                className="cursor-pointer border rounded-sm shadow-lg transition-transform duration-200 transform hover:scale-105"
                onClick={handleImageClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionCardRight;
