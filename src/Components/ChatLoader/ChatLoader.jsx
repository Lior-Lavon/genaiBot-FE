import { useEffect } from "react";

const ChatLoader = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes dotMove {
        0% { background-color: white; }
        33% { background-color: gray; }
        66% { background-color: gray; }
        100% { background-color: white; }
      }
      
      .animate-dot-1 {
        animation: dotMove 1.5s infinite;
      }
      
      .animate-dot-2 {
        animation: dotMove 1.5s 0.5s infinite;
      }
      
      .animate-dot-3 {
        animation: dotMove 1.5s 1s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="w-full flex justify-end py-4">
      <div className="w-16 h-8 bg-gray-900 flex justify-center items-center rounded-2xl mx-2">
        <div className="flex">
          <div className="w-2 h-2 bg-white rounded-full mx-1 animate-dot-1"></div>
          <div className="w-2 h-2 bg-gray-700 rounded-full mx-1 animate-dot-2"></div>
          <div className="w-2 h-2 bg-gray-700 rounded-full mx-1 animate-dot-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatLoader;
