import React, { useEffect, useState } from "react";

const TextWithAnimatedDots = ({ text = "Loading" }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotArray = ["", ".", "..", "..."];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % dotArray.length;
      setDots(dotArray[index]);
    }, 500); // Update interval speed as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row gap-2">
      {text} <span className="inline-block w-6">{dots}</span>
    </div>
  );
};

export default TextWithAnimatedDots;
