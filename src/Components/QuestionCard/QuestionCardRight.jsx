import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "../../features/dashboard/dashboardSlice";

const QuestionCardRight = () => {
  const dispatch = useDispatch();

  const { isDrawerOpen, imageList } = useSelector((store) => store.dashboard);

  const handleImageClick = (e) => {
    const imgId = e.target.id;
    dispatch(setImage({ show: true, id: parseInt(imgId) }));
  };
  return (
    <div
      className={`mx-1 transition-all duration-300 ease-in-out ${
        isDrawerOpen ? "w-40" : "w-0"
      }`}
    >
      <div className="w-full h-full flex flex-col gap-2">
        {imageList.map((imgItem) => {
          return (
            <img
              key={imgItem.id}
              id={imgItem.id}
              src={imgItem.src}
              alt=""
              className="cursor-pointer border p-2 rounded-sm shadow-lg transition-transform duration-300 transform hover:scale-105"
              onClick={handleImageClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCardRight;
