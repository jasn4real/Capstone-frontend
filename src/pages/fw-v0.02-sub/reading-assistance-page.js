import React, { useState } from "react";
import "./reading-assistance-page.css";
import ComprehensionPage from "./reading-comprehension-page-h";
import ReadingAssistance from "../ReadingAssistance";
<<<<<<< Updated upstream

let triggerHistoryUpdate_callback ;
const setTriggerHistoryUpdate = ( func ) => {
  if(func) triggerHistoryUpdate_callback = func;
}
const triggerHistoryUpdate = (q) =>{
  if(triggerHistoryUpdate_callback) triggerHistoryUpdate_callback(q);
}
export default function AssistancePage({pop_frame, fileHash}){

=======
import { getHistory } from "../../storage_";
import {
  highlighter,
  image,
  textplanation,
  yellowsun,
  bluemoon
} from '../../userwalkthrough/index'

export default function AssistancePage({ pop_frame, fileHash }) {
  const [readingAssistanceWidth, setReadingAssistanceWidth] = useState(50);
  const [isNightModeActive, setIsNightModeActive] = useState(false);
  
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
              <ReadingAssistance fileHash={fileHash} triggerHistoryUpdate={triggerHistoryUpdate}/> 
=======
              <ReadingAssistance />
>>>>>>> Stashed changes
            </div>
          </div>
          
        </div>

        <div className="comprehension-panel">
<<<<<<< Updated upstream
        <ComprehensionPage fh={fileHash} setTriggerHistoryUpdate={setTriggerHistoryUpdate} />
=======
          <ComprehensionPage fileHash={fileHash} />
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
}
