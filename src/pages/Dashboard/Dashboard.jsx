import React, { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { useState } from "react";

import TopBar from "../../Components/TopBar/TopBar";
import { ContentArea, ImageViewer, LeftBar } from "../../Components";
import {
  setDrawer,
  setLeftDrawer,
} from "../../features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { showImage, isLeftDrawer } = useSelector((store) => store.dashboard);
  const [width, setWidth] = useState(0);

  const leftBarRef = useRef(null);

  const handleDrawer = () => {
    dispatch(setDrawer());
  };

  useEffect(() => {
    calculateContentWidth();
  }, []);
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

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <TopBar />

      {/* Main Area */}
      <div className="flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`h-[calc(100vh-72px)]`}>
          <LeftBar leftBarRef={leftBarRef} />
        </div>

        <div className="h-full flex flex-col " style={{ width: `${width}px` }}>
          <div className="w-full flex justify-between py-4 ">
            <button onClick={() => dispatch(setLeftDrawer())} size="sm">
              <Menu className="w-8 h-8 mr-2" />
            </button>
            <button onClick={() => handleDrawer()} size="sm">
              <Menu className="w-8 h-8 mr-2" />
            </button>
          </div>

          <main className="w-full flex-1 overflow-y-auto">
            <ContentArea />
          </main>
        </div>
      </div>

      {/*  */}
      <AnimatePresence>
        {showImage?.show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
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
              <ImageViewer imageId={showImage?.id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/*  */}

      {/* {showImage?.show && <ImageViewer imageId={showImage?.id} />} */}
    </div>
  );
};

export default Dashboard;
