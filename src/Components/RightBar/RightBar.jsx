import React from "react";
import Img1 from "../../assets/img-1.png";
import Img2 from "../../assets/img-2.png";

const RightBar = ({ rightOpen }) => {
  return (
    <aside
      className={`bg-gray-100 transition-all duration-300 ease-in-out h-full ${
        rightOpen ? "w-50" : "w-0"
      } overflow-hidden`}
    >
      <div className="h-full p-4 flex flex-col gap-4 mt-36">
        <img
          src={Img1}
          alt=""
          className="cursor-pointer border rounded-sm shadow-lg transition-transform duration-300 transform hover:scale-105"
        />
        <img
          src={Img2}
          alt=""
          className="cursor-pointer border rounded-sm shadow-lg transition-transform duration-300 transform hover:scale-105"
        />
      </div>
    </aside>
  );
};

export default RightBar;
