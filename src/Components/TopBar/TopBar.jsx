import React from "react";
import Logo from "../../assets/presto_logo.png";

const TopBar = () => {
  return (
    <header className="h-18 bg-gray-100 text-white flex items-center px-4 shadow z-1000">
      <img src={Logo} alt="" className="h-full object-contain p-2" />
    </header>
  );
};

export default TopBar;
