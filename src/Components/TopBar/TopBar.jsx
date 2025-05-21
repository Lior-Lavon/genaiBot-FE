import React from "react";
import Logo from "../../assets/presto_logo.png";
import LauncherCard from "../LauncherCard/LauncherCard";
import { IoIosRefresh } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { restartChat } from "../../features/dashboard/dashboardSlice";
import Spinner from "../Spinner/Spinner";
import { div } from "framer-motion/client";

const TopBar = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((store) => store.dashboard);

  const handleNewChat = () => {
    dispatch(restartChat());
  };

  return (
    <header className="h-18 bg-gray-100 px-4 shadow z-1000">
      <div className="w-full h-18 flex items-center justify-between">
        <img src={Logo} alt="" className="h-full object-contain p-2" />
        <div className="flex items-center gap-2">
          <LauncherCard />
          <div
            className="border-l-1 px-2"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Start new chat"
          >
            {isLoading ? (
              <div className="w-8 h-8">
                <Spinner />
              </div>
            ) : (
              <IoIosRefresh
                className="w-8 h-8 p-1 font-bold rounded-2xl cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out "
                onClick={handleNewChat}
              />
            )}
          </div>
        </div>
      </div>
      <Tooltip id="my-tooltip" />
    </header>
  );
};

export default TopBar;
