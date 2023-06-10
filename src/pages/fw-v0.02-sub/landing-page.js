import React from "react";
import "./landing-page.css";
export default function LandingPage({ pop_frame }) {
  function onButtonClick(evt) {
    pop_frame(1);
  }
  function onGoLandingPageClick(evt) {
    pop_frame(0);
  }
  ///////////////////////////////////
  return (
    <div className="landing-page">
      <div className="cols-container">
        <div className="text-panel-div">
          <div className="title-div">
            <h1>Unlock knowledge. Upload, answer, explore.</h1>
          </div>
          <div className="subtitle-div">
            <div></div>
            <div>
              <h2>
                Discover the full story - let AI guide you through every page.
              </h2>
            </div>
            <div>
              <button className="btn btn-style-lg" onClick={onButtonClick}>
                Upload PDF
              </button>
            </div>
            <div>
              <p>User guide</p>
            </div>
          </div>
        </div>
      </div>
      <div className="min-status-col">
        <div>
          <div className="hp-ctn-howItWorks">
            <button
              className="btn btn-style btn-style-square"
              onClick={onGoLandingPageClick}
            >
              upload <br></br> PDF
            </button>
          </div>
          <div className="recents-box">
            <div> recent box 1</div>
            <div> recent box 2</div>
            <div> recent box 3</div>
            <div> recent box 4</div>
            <div> recent box 5</div>
            <div> recent box 6</div>
          </div>
        </div>
      </div>
    </div>
  );
}
