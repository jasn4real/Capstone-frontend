import React, { useEffect, useState } from "react";
import './fw-v0.02.css';
import LandingPage from "../components/Landing-page";
import AssistancePage from "./fw-v0.02-sub/reading-assistance-page";


let frames = undefined;
export default function Welcome(){
  const [currentFileHash, setCurrentFileHash] = useState(undefined);
  useEffect(() => {
    frames = {
      landing_frame: document.querySelector(".landing-frame"),
      assistance_frame: document.querySelector(".assistance-frame"),
      comprehension_frame: document.querySelector(".comprehension-frame"),
    };
  }, []);
  /////////////////////////////////////
  function pop_frame(frame_index) {
    const aSign = "page-active";
    try {
      Object.values(frames).forEach((el, idx) => {
        if (idx === Number(frame_index)) {
          el.classList.add(aSign);
        } else el.classList.remove(aSign);
      });
    } catch (error) {
      console.log(error);
    }
  }
  //////////////////////////////////////
  return (
    <div className="main-containter">
      <div className="landing-frame page-active">
        <LandingPage pop_frame={pop_frame} fileHash={currentFileHash} setCurrentFileHash={setCurrentFileHash} />
      </div>
      <div className="assistance-frame">
        <AssistancePage pop_frame={pop_frame} fileHash={currentFileHash} />
      </div>
      <div className="comprehension-frame">
        Please rotate your device horizontally to utilize this app optimally.
      </div>
    </div>
  );
}
