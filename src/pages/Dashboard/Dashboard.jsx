import React, { memo, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { useState } from "react";
import ReactSwal from "../../utills/alert";

// import BOT_Mapping from "../../cache/BOT_Mapping.csv?raw";
import parseCSVToStructure from "../../utills/filterCSVData.js";

import TopBar from "../../Components/TopBar/TopBar";
import {
  ContentArea,
  ImageViewer,
  LeftBar,
  PromptView,
} from "../../Components";
import {
  setRightDrawer,
  setLeftDrawer,
  addNewQuestion,
  initFilters,
  initFolders,
  fetchOptions,
  setMissingSelectedFoldersFlag,
} from "../../features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
// import getFiltersAdditionalInfo from "../../utills/getFiltersAdditionalInfo.js";

const Dashboard = memo(() => {
  const dispatch = useDispatch();
  const [inputParam, setInputParam] = useState(null);
  const {
    showImage,
    isLeftDrawer,
    folders,
    chatList,
    isBlock,
    missingProductIdOrCategoryId,
  } = useSelector((store) => store.dashboard);

  const [width, setWidth] = useState(0);
  const [showToggle, setShowToggle] = useState(false);

  const leftBarRef = useRef(null);

  const handleDrawer = () => {
    dispatch(setRightDrawer());
  };

  useEffect(() => {
    if (isBlock) {
      ReactSwal.fire({
        icon: "error",
        title: "Missing Client Info !",
        text: "Please launch the app with context.",
        showCloseButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    }
  }, [isBlock]);
  useEffect(() => {
    if (missingProductIdOrCategoryId) {
      ReactSwal.fire({
        icon: "info",
        title: "Action Needed",
        text: "Please select Genie-Product and Product-Category.",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(setMissingSelectedFoldersFlag(false));
        }
      });
    }
  }, [missingProductIdOrCategoryId]);

  useEffect(() => {
    calculateContentWidth();

    // read the input
    try {
      console.log("before reading ");

      const params = new URLSearchParams(window.location.search);
      const base64Str = params.get("startupParameter");
      console.log("base64Str :", base64Str);
      dispatch(fetchOptions(base64Str));

      //
      // if (base64Str != null) {
      //   const inputJson = decodeBase64ToJson(base64Str);
      //   if (inputJson != null || inputJson != "") {
      //     setInputParam(inputJson);
      //   }
      // }
    } catch (error) {
      console.error("Invalid url:", error);
      return null;
    }
  }, []);

  // useEffect(() => {
  //   if (botMapping != null && inputParam != null) {
  //     const filters = parseCSVToStructure(botMapping.data, {
  //       Customers_Id: inputParam.ClientID,
  //       Products_Id: inputParam.ProductID,
  //       Categories_Id: inputParam.CategoryID,
  //     });
  //     dispatch(initFilters({ filters }));

  //     // // get the input folders
  //     // const foldersInfo = getFiltersAdditionalInfo(
  //     //   { filters: filters },
  //     //   inputParam.ProductID,
  //     //   inputParam.CategoryID
  //     // );

  //     // set folders based on input param
  //     dispatch(
  //       initFolders({
  //         Customer_Folder: foldersInfo.Customer_Folder,
  //         Product_Folder: foldersInfo.Product_Folder,
  //         Category_Folder: foldersInfo.Category_Folder,
  //       })
  //     );
  //     // request the cache data
  //     setTimeout(() => {
  //       dispatch(loadData({}));
  //     }, 300);
  //     // post the question
  //     setTimeout(() => {
  //       dispatch(addNewQuestion({ prompt: inputParam.Question }));
  //     }, 600);
  //   }
  // }, [botMapping]);

  useEffect(() => {
    calculateContentWidth();
  }, [isLeftDrawer]);

  const calculateContentWidth = () => {
    setTimeout(() => {
      if (leftBarRef.current) {
        const leftRight = leftBarRef.current.getBoundingClientRect().right;
        const screenWidth = window.innerWidth;
        setWidth(screenWidth - leftRight);
      }
    }, 300);
  };

  // Watch isLeftDrawer and delay setting showToggle
  useEffect(() => {
    let timeout;
    if (!isLeftDrawer) {
      timeout = setTimeout(() => setShowToggle(true), 300);
    } else {
      setShowToggle(false);
    }

    return () => clearTimeout(timeout); // cleanup if state changes quickly
  }, [isLeftDrawer]);

  const decodeBase64ToJson = (base64Str) => {
    try {
      const decodedStr = atob(base64Str); // Decode Base64 to string
      const jsonObj = JSON.parse(decodedStr); // Parse string to JSON
      return jsonObj;
    } catch (error) {
      console.error("Invalid Base64 or JSON:", error);
      return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <TopBar />
      {/* Main Area */}
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
      leftBar transition-transform duration-300 h-[calc(100vh-72px)] shadow-[4px_0_10px_rgba(0,0,0,.1)]
      ${isLeftDrawer ? "translate-x-0" : "-translate-x-full"}
    `}
        >
          <LeftBar leftBarRef={leftBarRef} />
        </div>

        {/* Content Area */}
        <div
          className={`h-[calc(100vh-72px)] flex flex-col absolute top-[72px] transition-all duration-300 ${
            isLeftDrawer ? "left-[280px] w-[calc(100%-280px)]" : "left-0 w-full"
          }`}
        >
          {/* Toggle Button */}
          {showToggle && (
            <div
              className="w-10 cursor-pointer absolute left-0 top-0 z-50"
              onClick={() => dispatch(setLeftDrawer())}
            >
              <GoTriangleRight className="w-10 h-10 shadow-2xl transition-all duration-300 ease-in-out text-gray-700 hover:text-gray-900" />
            </div>
          )}

          {/* Main content */}
          <main className="contentArea w-full flex-1 overflow-y-auto relative bg-white">
            <ContentArea />
            {/* chatList.length */}
            <div
              className={`${
                chatList.length > 0
                  ? "w-full flex justify-center absolute bottom-5 "
                  : "w-full absolute top-0 left-0 h-full flex items-center justify-center"
              }`}
            >
              <div className="w-[90%] max-w-[950px] flex flex-col gap-4">
                {chatList.length == 0 && (
                  <p className="text-center text-2xl">How can I help you ?</p>
                )}
                <PromptView />
              </div>
            </div>
          </main>
        </div>
      </div>
      <AnimatePresence>
        {showImage.show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-2000"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ImageViewer imageSrc={showImage.src} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* {showImage?.show && <ImageViewer imageId={showImage?.id} />} */}
    </div>
  );
});

export default Dashboard;
