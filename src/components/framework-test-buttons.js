import React from "react";

export default function FrameworkTestButtons ({switchFrame}){
  function onSwitchToLandingClick(){
    switchFrame('landing');
  }
  function onSwitchToReadingComprehensionClick(){
    switchFrame('reading-comprehenstion');
  }
  function onSwitchToReadingAssistanceClick(){
    switchFrame('reading-assistance');
  }
  ///////////////////////////////////////////////////
  return <div>
    <p><button onClick={onSwitchToLandingClick}>switch to landing page</button></p>
    <p><button onClick={onSwitchToReadingComprehensionClick}>switch to Reading comprehension page</button></p>
    <p><button onClick={onSwitchToReadingAssistanceClick}>switch to Reading assistance page</button></p>
  </div>
}