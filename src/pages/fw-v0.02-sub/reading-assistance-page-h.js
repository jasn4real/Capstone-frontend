import React, { useState, useEffect, useRef } from "react";
import "./reading-assistance-page-h.css";
import ComprehensionPage from "./reading-comprehension-page";
import { FcAbout } from "react-icons/fc";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import ReadingAssistance from "../ReadingAssistance";
import { getHistory } from "../../storage_";

export default function AssistancePage({pop_frame, fileHash}){

  const [readingAssistanceWidth, setReadingAssistanceWidth] = useState(50);

  function onLandingClick(){
    pop_frame(0);
  }
  function onComprehensionClick(){
    pop_frame(2);
  }
  function onEnlargeClick(){

  }
  function onShrinkClick(){

  }
  
  
  return (
    <div className="assistance-page">
      <div className="cols-container">
        <div className="reading-panel" style={{ flex: readingAssistanceWidth }}>
          <div className="text-reading-panel">
            <div className="popup-detail">
              <ReadingAssistance/> 
            </div>
          </div>
        </div>

        <div className="comprehension-panel">
        <ComprehensionPage fileHash={fileHash} />
      </div>
    </div>
  </div>
  );
}