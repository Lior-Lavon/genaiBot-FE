import React from "react";
import Logo from "../../assets/presto_logo.png";
import LauncherCard from "../LauncherCard/LauncherCard";

const TopBar = () => {
  return (
    <header className="h-18 bg-gray-100 px-4 shadow z-1000">
      <div className="w-full h-18 flex items-center justify-between">
        <img src={Logo} alt="" className="h-full object-contain p-2" />
        <LauncherCard />
      </div>
    </header>
  );
};

export default TopBar;
