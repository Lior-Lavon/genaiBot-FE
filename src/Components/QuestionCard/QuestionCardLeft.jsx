import React from "react";
import { useDispatch } from "react-redux";
import { setDrawer } from "../../features/dashboard/dashboardSlice";

const QuestionCardLeft = () => {
  const dispatch = useDispatch();

  const handleDrawer = () => {
    dispatch(setDrawer());
  };

  return (
    <div className="m-1 flex-1 bg-red-300" onClick={handleDrawer}>
      QuestionCardLeft
    </div>
  );
};

export default QuestionCardLeft;
