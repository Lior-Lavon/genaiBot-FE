import { useEffect, useState } from "react";

const QuestionImage = ({ props, handleImageClick }) => {
  const [loading, setLoading] = useState(true);
  const [isBase64, setIsBase64] = useState(null);
  const [finalSrc, setFinalSrc] = useState(null);

  useEffect(() => {
    setIsBase64(props.src?.startsWith("data:image"));

    let finalSrc = props.src;
    if (!finalSrc || finalSrc.trim() === "") {
      if (props.srcSet) {
        // Extract first URL from srcSet
        setFinalSrc(extractBase64Image(props.srcSet, 0));
      } else {
        console.warn("⚠️ Empty image src and no srcSet available.");
      }
    }
  }, []);

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
    <div className="relative w-full my-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded border">
          <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
        </div>
      )}
      <img
        loading="lazy"
        decoding="async"
        {...props}
        src={finalSrc}
        onLoad={() => setLoading(false)}
        className={`rounded shadow max-w-full transition-opacity duration-300 cursor-pointer ${
          loading ? "opacity-0" : "opacity-100"
        } ${isBase64 ? "border" : ""}`}
        alt={props.alt || "Image"}
        onClick={handleImageClick}
      />
    </div>
  );
};

export default QuestionImage;
