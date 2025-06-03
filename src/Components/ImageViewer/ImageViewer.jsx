import React, { useEffect, useRef, useState } from "react";
import ZoomPanImage from "./ZoomPanImage";
import { LogIn, X as ResetIcon } from "lucide-react";
import { removeImage } from "../../features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import ImageViewerControl from "./ImageViewerControl";

const getImageDimensions = (imageSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

const ImageViewer = ({ imageSrc }) => {
  const dispatch = useDispatch();
  const ImgWidthFromScreen = 0.7;
  const [aspectRatio, setAspectRatio] = useState(null);
  const implRef = useRef();

  useEffect(() => {
    const load = async () => {
      if (imageSrc) {
        try {
          const { width, height } = await getImageDimensions(imageSrc);
          setAspectRatio(width / height);
        } catch (err) {
          console.error("Failed to load image.", err);
        }
      }
    };
    load();
  }, [imageSrc]);

  const calculateFrame = () => {
    let height = window.innerHeight * ImgWidthFromScreen;
    let width = height * aspectRatio;
    const frame = {
      width: `${width}px`,
      height: `${height}px`,
    };
    console.log("frame : ", frame);

    return frame;
  };

  const handleClose = () => {
    dispatch(removeImage());
  };

  if (!aspectRatio) return <div>Loading...</div>;

  const handleClick = ({ action }) => {
    if (!implRef.current) return;

    switch (action) {
      case "ZoomIn":
        implRef.current.ZoomIn();
        break;
      case "ZoomOut":
        implRef.current.ZoomOut();
        break;
      case "Reset":
        implRef.current.Reset();
        break;
      case "CopyImage":
        implRef.current.CopyImage();
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="flex mt-16 flex-col bg-white rounded-2xl">
        <div className="w-full flex flex-row items-center justify-between py-2 pl-6 pr-4 rounded-2xl ">
          <ImageViewerControl handleClick={handleClick} />
          {/* <ResetIcon
            className="w-8 h-full text-[#7AA8AC] cursor-pointer"
            onClick={handleClose}
          /> */}
          <button
            onClick={handleClose}
            className="p-2 bg-gray-100 text-[#7AA8AC] rounded transition-all duration-200 hover:bg-gray-200 cursor-pointer"
          >
            <ResetIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-2xl mx-4 mb-4" style={calculateFrame()}>
          <ZoomPanImage src={imageSrc} ref={implRef} />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
