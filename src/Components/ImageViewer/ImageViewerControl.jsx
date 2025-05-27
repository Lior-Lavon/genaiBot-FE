import { ZoomIn, ZoomOut, X as ResetIcon } from "lucide-react";
import { FaRegCopy } from "react-icons/fa";

const ImageViewerControl = ({ handleClick }) => {
  return (
    <div className="flex flex-row gap-2 bg-opacity-80 rounded shadow">
      <button
        onClick={() => handleClick({ action: "ZoomIn" })}
        className="p-2 bg-gray-100 text-[#7AA8AC] rounded transition-all duration-300 hover:bg-gray-200 cursor-pointer"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleClick({ action: "ZoomOut" })}
        className="p-2 bg-gray-100 text-[#7AA8AC] rounded transition-all duration-300 hover:bg-gray-200 cursor-pointer"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleClick({ action: "Reset" })}
        className="p-2 bg-gray-100 text-[#7AA8AC] rounded transition-all duration-300 hover:bg-gray-200 cursor-pointer"
      >
        <ResetIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleClick({ action: "CopyImage" })}
        className="p-2 bg-gray-100 text-[#7AA8AC] rounded transition-all duration-300 hover:bg-gray-200 cursor-pointer"
      >
        <FaRegCopy className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ImageViewerControl;
