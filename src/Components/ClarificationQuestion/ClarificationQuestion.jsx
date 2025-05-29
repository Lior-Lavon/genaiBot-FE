import { useEffect, useRef, useState } from "react";
import ClarificationDropdown from "../ClarificationDropdown/ClarificationDropdown";
import ReactSwal from "../../utills/alert";

const ClarificationQuestion = ({ chatItem, handleClarificationResponse }) => {
  const [userSelection, setUserSelection] = useState({});

  const handleUserSelection = (questionKey, selectedOptions) => {
    setUserSelection((prev) => ({
      ...prev,
      [questionKey]: selectedOptions,
    }));
  };

  useEffect(() => {
    // console.log("userSelection : ", userSelection);
  }, [userSelection]);

  useEffect(() => {
    chatItem.clarifications.map((question) => {
      setUserSelection((prev) => ({
        ...prev,
        [question.question_key]: [],
      }));
    });
  }, [chatItem]);

  const submitClarificationAnswers = () => {
    const qAnswered = Object.values(userSelection).every(
      (value) => Array.isArray(value) && value.length > 0
    );
    if (!qAnswered) {
      ReactSwal.fire({
        icon: "info",
        title: "Action Needed",
        text: "Please provide at least one answer per question.",
        showConfirmButton: true,
      });
    } else {
      handleClarificationResponse(userSelection);
    }
  };

  return (
    <div className="w-full pb-10">
      {chatItem.clarifications.map((item, index) => {
        return (
          <div key={index} className="w-full flex flex-col gap-2 ml-4 my-6">
            {/* question text */}
            <p className="text-sm">{item.question_text}</p>

            {/* options */}
            <div>
              <ClarificationDropdown
                questionKey={item.question_key}
                options={item.options}
                handleUserSelection={handleUserSelection}
              />
            </div>
          </div>
        );
      })}
      {/* proceed */}
      <button
        className="text-sm bg-[#dff1f4] ml-4  py-1 px-4 text-gray-800 rounded-2xl shadow-md cursor-pointer hover:bg-[#9ad3d9] transition-all duration-400"
        onClick={submitClarificationAnswers}
      >
        Proceed
      </button>
    </div>
  );
};

export default ClarificationQuestion;
