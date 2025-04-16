import { useEffect } from "react";
import { Dashboard } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { sessionToken } from "./features/dashboard/dashboardSlice";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function App() {
  const { session } = useSelector((store) => store.dashboard);
  console.log("session : ", session);

  const dispatch = useDispatch();

  useEffect(() => {
    if (session == null) dispatch(sessionToken());
  }, []);

  return (
    <>
      <Dashboard />
      {/* <HelloWorld /> */}
    </>
  );
}

export default App;
