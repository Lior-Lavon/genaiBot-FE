import React, { useEffect, useState } from "react";
import ZoomPanImage from "./ZoomPanImage";
import { LogIn, X as ResetIcon } from "lucide-react";
import { removeImage } from "../../features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const ImgWidthFromScreen = 0.65;
  const [aspectRatio, setAspectRatio] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (imageSrc) {
        try {
          const { width, height } = await getImageDimensions(imageSrc);
          setAspectRatio(height / width);
        } catch (err) {
          console.error("Failed to load image", err);
        }
      }
    };
    load();
  }, [imageSrc]);

  const getHeight = () => {
    return Math.floor(window.innerWidth * ImgWidthFromScreen * aspectRatio);
  };

  const handleClose = () => {
    dispatch(removeImage());
  };

  if (!aspectRatio) return <div>Loading...</div>;

  return (
    <div className="w-full h-full fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="flex flex-col bg-white rounded-2xl">
        <div className="w-full flex items-center justify-end p-2 rounded-2xl">
          <ResetIcon className="w-8 h-8 cursor-pointer" onClick={handleClose} />
        </div>
        <div
          className="rounded-2xl mx-4 mb-4"
          style={{
            width: `${window.innerWidth * ImgWidthFromScreen}px`,
            height: `${getHeight()}px`,
          }}
        >
          <ZoomPanImage src={imageSrc} />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
