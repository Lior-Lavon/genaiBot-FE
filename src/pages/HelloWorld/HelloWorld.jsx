import React from "react";

const HelloWorld = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <p>{import.meta.env.VITE_SERVER_CHAT_URL}</p>
      <p>{import.meta.env.VITE_API_BASE_URL}</p>
    </div>
  );
};

export default HelloWorld;
