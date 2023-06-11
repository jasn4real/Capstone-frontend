import React, { useState } from "react";
import "./reading-assistance-page.css";
import ComprehensionPage from "./reading-comprehension-page-h";
import ReadingAssistance from "../ReadingAssistance";

let triggerHistoryUpdate_callback ;
const setTriggerHistoryUpdate = ( func ) => {
  if(func) triggerHistoryUpdate_callback = func;
}
const triggerHistoryUpdate = (q) =>{
  if(triggerHistoryUpdate_callback) triggerHistoryUpdate_callback(q);
}
export default function AssistancePage({pop_frame, fileHash}){


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
        <div className="reading-panel" style={{ flex: "50px" }}>
          <div className="text-reading-panel">
            <div className="popup-detail">
              <ReadingAssistance fileHash={fileHash} triggerHistoryUpdate={triggerHistoryUpdate}/> 
            </div>
          </div>
        </div>

        <div className="comprehension-panel">
        <ComprehensionPage fh={fileHash} setTriggerHistoryUpdate={setTriggerHistoryUpdate} />
      </div>
    </div>
  </div>
  );
}