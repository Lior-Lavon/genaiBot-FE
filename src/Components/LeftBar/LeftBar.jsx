import React from "react";
import LauncherCard from "../LauncherCard/LauncherCard";
import Kickstarters from "../Kickstarters/Kickstarters";
import { useSelector } from "react-redux";

const LeftBar = ({ leftBarRef }) => {
  const { isLeftDrawer } = useSelector((store) => store.dashboard);
  return (
    <aside
      className={`bg-gray-100 transition-all duration-300 ease-in-out h-full ${
        isLeftDrawer ? "w-80" : "w-0"
      } overflow-hidden `}
      ref={leftBarRef}
    >
      <div className="h-full p-4 flex flex-col items-center justify-between">
        <LauncherCard />
        <Kickstarters />
      </div>
    </aside>
  );
};

export default LeftBar;
