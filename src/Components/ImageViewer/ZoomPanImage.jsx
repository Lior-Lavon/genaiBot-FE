import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import ReactSwal from "../../utills/alert";

const ZoomPanImage = forwardRef(({ src, alt }, ref) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

  const handleZoomIn = () => {
    const rect = containerRef.current.getBoundingClientRect();
    zoom(0.2, rect.width / 2, rect.height / 2);
  };

  const handleZoomOut = () => {
    const rect = containerRef.current.getBoundingClientRect();
    zoom(-0.2, rect.width / 2, rect.height / 2);
  };

  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleCopyImage = async () => {
    try {
      const img = imgRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Failed to create blob.");
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
    } catch (err) {
      alert("Failed to copy image.");
      console.error(err);
    }
  };

  useImperativeHandle(ref, () => ({
    ZoomIn: handleZoomIn,
    ZoomOut: handleZoomOut,
    Reset: handleReset,
    CopyImage: handleCopyImage,
  }));

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    zoom(
      e.deltaY > 0 ? -0.1 : 0.1,
      e.clientX - rect.left,
      e.clientY - rect.top
    );
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

  const handleMouseUp = () => setDragging(false);

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
      <img
        ref={imgRef}
        src={src}
        alt={alt || ""}
        className="select-none cursor-grab object-cover"
        onDoubleClick={(e) => {
          const rect = containerRef.current.getBoundingClientRect();
          zoom(0.5, e.clientX - rect.left, e.clientY - rect.top);
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
});

export default ZoomPanImage;
