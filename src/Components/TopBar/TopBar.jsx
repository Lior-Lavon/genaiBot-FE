import React from "react";
import Logo from "../../assets/presto_logo.png";
import LauncherCard from "../LauncherCard/LauncherCard";
import { IoIosRefresh } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import headerBg from "../../assets/presto_header.png";
import {
  loadData,
  restartChat,
  setUserId,
} from "../../features/dashboard/dashboardSlice";
import Spinner from "../Spinner/Spinner";
import { div } from "framer-motion/client";
import {
  clearUserIdFromLocalStorage,
  setUserIdInLocalStorage,
} from "../../utills/localStorage";
import { v4 as uuidv4 } from "uuid";

const TopBar = () => {
  const dispatch = useDispatch();
  const { isLoading, selectedFolders } = useSelector(
    (store) => store.dashboard
  );

  const handleNewChat = () => {
    // clear the userId
    clearUserIdFromLocalStorage();

    // generate and store new userId
    const newUserId = uuidv4();
    setUserIdInLocalStorage(newUserId);

    // update the userId
    dispatch(setUserId(newUserId));

    // clear the history
    dispatch(restartChat());

    // request loadData with new userId
    dispatch(
      loadData({
        user_id: newUserId,
        client: selectedFolders.client,
        product: selectedFolders.product,
        category: selectedFolders.category,
      })
    );
  };

  return (
    <header className="h-16 bg-white shadow z-1000">
      <div
        className="w-full h-full flex items-center justify-between bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <img src={Logo} alt="" className="h-full object-contain p-2 ml-4" />
        <div className="flex items-center gap-2">
          <LauncherCard />
          <div
            className="border-l-1 border-l-white px-2"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Start new chat"
          >
            {isLoading ? (
              <div className="w-8 h-8 text-white">
                <Spinner />
              </div>
            ) : (
              <IoIosRefresh
                className="w-8 h-8 p-1 text-white font-bold rounded-2xl cursor-pointer hover:text-[#dff1f5] transition-all duration-300 ease-in-out "
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
