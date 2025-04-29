import { useEffect } from "react";
import { Dashboard } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { sessionToken } from "./features/dashboard/dashboardSlice";
import useScreenWidth from "./utills/useScreenWidth";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import "react-tooltip/dist/react-tooltip.css";
import { NotSupported } from "./Components";

function App() {
  const screenWidth = useScreenWidth();
  const { session } = useSelector((store) => store.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    if (session == null) dispatch(sessionToken());
  }, []);

  return <>{screenWidth < 769 ? <NotSupported /> : <Dashboard />}</>;
}

export default App;
