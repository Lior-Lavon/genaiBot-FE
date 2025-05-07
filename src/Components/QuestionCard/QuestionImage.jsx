import { memo, useEffect, useRef, useState } from "react";
import ReactSwal from "../../utills/alert";
import { useDispatch } from "react-redux";

const QuestionImage = memo(({ src, handleImageClick }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isBase64, setIsBase64] = useState(null);
  const [finalSrc, setFinalSrc] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    // setIsBase64(src?.startsWith("data:image"));
    // let finalSrc = src;
    // if (!finalSrc || finalSrc.trim() === "") {
    //   if (srcSet) {
    //     // Extract first URL from srcSet
    //     setFinalSrc(extractBase64Image(srcSet, 0));
    //   } else {
    //     console.warn("⚠️ Empty image src and no srcSet available.");
    //   }
    // }
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuVisible(true);
  };

  const handleClickOutside = () => {
    setMenuVisible(false);
  };

  // const handleCopyImage = async () => {
  //   try {
  //     const image = imageRef.current;
  //     const response = await fetch(image.src);
  //     const blob = await response.blob();

  //     await navigator.clipboard.write([
  //       new window.ClipboardItem({ [blob.type]: blob }),
  //     ]);
  //     ReactSwal.fire({
  //       icon: "success",
  //       title: "Heads up!",
  //       text: "Image copied to clipboard!",
  //     });
  //   } catch (error) {
  //     alert("Failed to copy image.");
  //     console.error(error);
  //   }
  //   setMenuVisible(false);
  // };

  const handleCopyImage = async () => {
    try {
      const img = imageRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Failed to create blob from canvas.");

        await navigator.clipboard.write([
          new window.ClipboardItem({ [blob.type]: blob }),
        ]);

        ReactSwal.fire({
          icon: "success",
          title: "Heads up!",
          text: "Image copied to clipboard!",
          willOpen: () => {
            const swalContainer = document.querySelector(".swal2-container");
            if (swalContainer) {
              swalContainer.style.zIndex = "99999";
            }
          },
        });
      }, "image/png");
    } catch (error) {
      alert("Failed to copy image.");
      console.error(error);
    }
  };
  const extractBase64Image = (bufferText, index) => {
    // This regex matches base64 image data URIs
    const base64Images = bufferText.match(
      /data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g
    );

    if (!base64Images || index < 0 || index >= base64Images.length) {
      throw new Error("Invalid index or no images found.");
    }

    return base64Images[index];
  };

  return (
    <div className="relative w-full my-4" onClick={handleClickOutside}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded border">
          <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
        </div>
      )}
      <img
        ref={imageRef}
        loading="lazy"
        decoding="async"
        // {...props}
        // src={finalSrc}
        src={src}
        onLoad={() => setLoading(false)}
        style={{ willChange: "opacity, transform" }}
        className={`rounded shadow max-w-full transition-opacity duration-300 cursor-pointer ${
          loading ? "opacity-0" : "opacity-100"
        } ${isBase64 ? "border" : ""}`}
        alt={"Image"}
        onClick={(e) => {
          if (!menuVisible) {
            handleImageClick(e);
          }
        }}
        onContextMenu={handleContextMenu}
      />
      {/* show context menu */}
      {menuVisible && (
        <ul className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 border border-gray-300 rounded shadow-md z-500 w-fit">
          <li
            onClick={handleCopyImage}
            className="px-4 py-2 bg-white hover:bg-gray-200 cursor-pointer"
          >
            📋 Copy image
          </li>
        </ul>
      )}
    </div>
  );
});

export default QuestionImage;
