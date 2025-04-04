import React from "react";
import Kickstarters from "../Kickstarters/Kickstarters";
import { useDispatch, useSelector } from "react-redux";
import { GoTriangleLeft } from "react-icons/go";
import { setLeftDrawer } from "../../features/dashboard/dashboardSlice";

const LeftBar = ({ leftBarRef }) => {
  const dispatch = useDispatch();
  const { isLeftDrawer } = useSelector((store) => store.dashboard);
  return (
    <aside
      className={`w-80 bg-gray-100 transition-all duration-300 ease-in-out h-full
      } overflow-hidden `}
      ref={leftBarRef}
    >
      <div
        className="w-full flex justify-end cursor-pointer "
        onClick={() => dispatch(setLeftDrawer())}
      >
        <GoTriangleLeft className="w-10 h-10 shadow-2xl transition-all duration-300 ease-in-out text-gray-700 hover:text-gray-900" />
      </div>

      <div className="h-[calc(100%-2.5rem)] p-4 flex flex-col items-center justify-between">
        {/* <LauncherCard /> */}
        <Kickstarters />
      </div>
    </aside>
  );
};

export default LeftBar;
