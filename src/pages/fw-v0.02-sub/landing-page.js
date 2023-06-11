import React, { useState } from "react";
import "./landing-page.css";
export default function LandingPage({ pop_frame }) {
  function onButtonClick(evt) {
    pop_frame(1);
  }
  function onGoLandingPageClick(evt) {
    pop_frame(0);
  }

  const [showOption, setShowOption] = useState(false);
  const [activeBoxIndex, setActiveBoxIndex] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(false)

  const recentBoxes = [
    "recent box 1",
    "recent box 2",
    "recent box 3",
    "recent box 4",
    "recent box 5",
    "recent box 6",
  ];

  const handleMouseEnter = (index) => {
    setActiveBoxIndex(index);
  };
  

  const handleMouseLeave = () => {
    setActiveBoxIndex(null);
  };
  

  const handleDeleteClick = (index) => {
    console.log("Deleting box at index:", index);
  };

  const handleConfirmDelete = (index) => {
    // Handle the confirmed delete action for the box at the specified index
    console.log("Confirm delete box at index:", index);
    // Perform your delete logic here

    // After deletion, reset the state
    // setDeleteIndex(null);
    setConfirmDelete(false);
  };
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
          {/* <div className="recents-box">
            {recentBoxes.map((box, index) => (
              <div
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {box}
                {activeBoxIndex === index && (
                  <button
                    className="delete-button"
                    // onClick={() => setConfirmDelete(true)}
                  >
                    ...
                  </button>
                )}
              </div>
            ))}
          </div> */}
      </div>
    </div>
    </div>
  );
}
