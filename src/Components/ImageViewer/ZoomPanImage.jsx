import React, { useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, X as ResetIcon } from "lucide-react";
import { FaRegCopy } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import ReactSwal from "../../utills/alert";

const ZoomPanImage = ({ src, alt }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleWheel = (e) => {
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    zoom(e.deltaY > 0 ? -0.1 : 0.1, offsetX, offsetY);
  };

  const zoom = (delta, cx, cy) => {
    const newScale = clamp(scale + delta, 0.5, 5);
    const scaleRatio = newScale / scale;

    const newTranslate = {
      x: cx - scaleRatio * (cx - translate.x),
      y: cy - scaleRatio * (cy - translate.y),
    };

    setScale(newScale);
    setTranslate(newTranslate);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleZoomIn = () => {
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoom(0.2, cx, cy);
  };

  const handleZoomOut = () => {
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoom(-0.2, cx, cy);
  };

  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  // const handleCopyImage = async () => {
  //   try {
  //     const image = imgRef.current;
  //     const response = await fetch(image.src);
  //     const blob = await response.blob();

  //     await navigator.clipboard.write([
  //       new window.ClipboardItem({ [blob.type]: blob }),
  //     ]);
  //     ReactSwal.fire({
  //       icon: "success",
  //       title: "Heads up!",
  //       text: "Image copied to clipboard! !!",
  //       willOpen: () => {
  //         const swalContainer = document.querySelector(".swal2-container");
  //         if (swalContainer) {
  //           swalContainer.style.zIndex = "99999"; // or higher than your modal
  //         }
  //       },
  //     });
  //   } catch (error) {
  //     alert("Failed to copy image.");
  //     console.error(error);
  //   }
  // };

  const handleCopyImage = async () => {
    try {
      const img = imgRef.current;
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

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative border rounded-xl"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2 bg-white bg-opacity-80 p-2 rounded shadow">
        <div className="absolute top-2 right-2 z-10 flex gap-2 bg-white bg-opacity-80 p-2 rounded shadow">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            <ResetIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyImage}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            <FaRegCopy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt || ""}
        className="select-none cursor-grab object-cover"
        onDoubleClick={(e) => {
          const rect = containerRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          zoom(0.5, clickX, clickY); // Zoom in 0.5x on double-click
        }}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "top left",
          transition: dragging ? "none" : "transform 0.1s ease-out",
        }}
        draggable={false}
      />
    </div>
  );
};

export default ZoomPanImage;
