import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store.js";
import { Provider } from "react-redux";
import { interceptor } from "../src/utills/customFetch.jsx";
import "@fontsource/figtree/400.css"; // Regular
import "@fontsource/figtree/700.css"; // Bold

// configure axios interceptor
interceptor(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
