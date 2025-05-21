import React from "react";

const NotSupported = () => {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="w-[90%] max-w-[500px]">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Device Not Supported
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, this app is not supported on your device resolution. Please
            try again on a larger device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotSupported;
