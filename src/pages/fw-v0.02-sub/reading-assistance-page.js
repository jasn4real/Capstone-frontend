import React, { useState } from "react";
// import "./reading-assistance-page.css";
import ComprehensionPage from "./reading-comprehension-page-h";
import ReadingAssistance from "../ReadingAssistance";// -h possible

let triggerHistoryUpdate_callback ;
const setTriggerHistoryUpdate = ( func ) => {
  if(func) triggerHistoryUpdate_callback = func;
}
const triggerHistoryUpdate = (q) =>{
  console.log("tr")
  if(triggerHistoryUpdate_callback) triggerHistoryUpdate_callback(q);
}

export default function AssistancePage({ pop_frame, fileHash }) {
  const [isNightModeActive, setIsNightModeActive] = useState(false);
  let [isLoading, setIsLoading] = useState(false);


  function onLandingClick() {
    pop_frame(0);
  }

  function onComprehensionClick() {
    pop_frame(2);
  }

  function onEnlargeClick() {}

  function onShrinkClick() {}

  function toggleNightMode() {
    setIsNightModeActive((prevNightMode) => !prevNightMode);
  }

  return (
    <div
      className="assistance-page"
      style={{
        backgroundColor: isNightModeActive ? "black" : "white",
        color: isNightModeActive ? "white" : "black",
      }}
    >
      <div className="cols-container">
        <div className="reading-panel" style={{ flex: "50px" }}>
          <div className="text-reading-panel">
            <div className="popup-detail">
              <ReadingAssistance 
                fileHash={fileHash} 
                triggerHistoryUpdate={triggerHistoryUpdate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              /> 
            </div>
          </div>
        </div>

        <div className="comprehension-panel">

        <ComprehensionPage 
          fh={fileHash} 
          setTriggerHistoryUpdate={setTriggerHistoryUpdate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        </div>
      </div>
    </div> // Missing in the original code
  );
}
