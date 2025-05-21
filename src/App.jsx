import { useEffect } from "react";
import { Dashboard } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import useScreenWidth from "./utills/useScreenWidth";
import { v4 as uuidv4 } from "uuid";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import "react-tooltip/dist/react-tooltip.css";
import {
  MultiSelectDropdown,
  NotSupported,
  TextWithAnimatedDots,
} from "./Components";
import {
  getUserIdFromLocalStorage,
  setUserIdInLocalStorage,
} from "./utills/localStorage";
import { setUserId } from "./features/dashboard/dashboardSlice";

function App() {
  const screenWidth = useScreenWidth();
  const dispatch = useDispatch();

  let userId = getUserIdFromLocalStorage();
  if (userId == null) {
    userId = uuidv4();
    setUserIdInLocalStorage(userId);
  }
  dispatch(setUserId(userId));

  return <>{screenWidth < 768 ? <NotSupported /> : <Dashboard />}</>;
}

export default App;
