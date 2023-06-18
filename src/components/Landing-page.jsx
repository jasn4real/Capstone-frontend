import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";

import "../pages/fw-v0.02-sub/landing-page.css";

import lc from "../storage_";
import fe from "../fetch_";

import TutorialModal from "../TutorialModal/index";

import { FcFullTrash } from "react-icons/fc";
function LandingPage({
  pop_frame,
  setCurrentFileHash,
  setResponseData,
  responseData,
}) {
  const [activeBoxIndex, setActiveBoxIndex] = useState(null); //takes the index of the file when mouse over occurs

  const [recents, setRecents] = useState([]);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [confirmDeletionArray, setConfirmDeletionArray] = useState(
    Array(recents.length).fill(false)
  );

  const handleConfirmDelete = (index) => {
    const updatedConfirmDeletionArray = [...confirmDeletionArray];
    updatedConfirmDeletionArray[index] = !updatedConfirmDeletionArray[index];
    setConfirmDeletionArray(updatedConfirmDeletionArray);
  };

  useEffect(() => {
    let allFiles = lc.getAllFiles();
    allFiles = allFiles.map((el) => ({
      ...lc.getFileDetail(el, ["metaData", "textToImage"]),
      fileHash: el,
    }));
    setRecents(allFiles);
    console.log(allFiles);
  }, []);

  function onGoLandingPageClick(evt) {
    pop_frame(0);
  }

  function UploadButtonClick(evt) {
    document.querySelector("#files_input").click();
  }

  function OnUploadInputChange(evt) {
    if (evt.target.files[0]) {
      setIsLoading(true); //start animation loading

      lc.uploadFile(evt.target, (data) => {
        console.log(data);
        evt.target.value = "";
        setIsLoading(false);
        if (data === false) return;

        let allFiles = lc.getAllFiles();
        allFiles = allFiles.map((el) => ({
          ...lc.getFileDetail(el, ["metaData", "textToImage"]),
          fileHash: el,
        }));
        setRecents(allFiles);
        pop_frame(1);

        if (data.fileHash) setCurrentFileHash(data.fileHash);
        // evt.target.value = "";
        // setIsLoading(false); // Stop loading animation
      });
    }
    console.log(evt.target.files);
  }

  function deleteFile(index) {
    lc.deleteFile(recents[index].fileHash); // Assuming lc.deleteHistory is the correct function to delete the file

    const updatedRecents = [...recents];
    updatedRecents.splice(index, 1);
    setRecents(updatedRecents);
    const updatedConfirmDeletionArray = [...confirmDeletionArray];
    updatedConfirmDeletionArray.splice(index, 1);
    setConfirmDeletionArray(updatedConfirmDeletionArray);
    setCurrentFileHash(undefined);
    pop_frame(0);
  }

  const handleMouseEnter = (idx) => {
    console.log("mosue entered", idx);
    setActiveBoxIndex(idx);
  };

  const handleMouseLeave = (idx) => {
    console.log("mouse left");
    setActiveBoxIndex(null);
    const updatedConfirmDeletionArray = [...confirmDeletionArray];
    updatedConfirmDeletionArray[idx] = false;
    setConfirmDeletionArray(updatedConfirmDeletionArray);
  };

  const cleanFileName = (fileName) => {
    const cleanedName = fileName.replace(/[^a-zA-Z]/g, "");

    return cleanedName;
  };

  return (
    <div className={`landing-page ${isLoading ? "blurry" : ""}`}>
      <Container className="cols-container">
        <Row className="text-panel-div">
          <Col>
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
                <Button
                  variant="primary"
                  className="btn btn-style-lg"
                  onClick={UploadButtonClick}
                >
                  Upload PDF
                </Button>

                <input
                  id="files_input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={OnUploadInputChange}
                />
              </div>
              <div>
                <p>User guide</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {isLoading && (
        <div className={`loader-container ${isLoading ? "loading" : ""}`}>
          <div className="loader">
            <span>B</span>
            <span>I</span>
            <span>N</span>
            <span>A</span>
            <span>R</span>
            <span>Y</span>
            <span>&nbsp;</span>
            <span>M</span>
            <span>I</span>
            <span>N</span>
            <span>D</span>
            <span>...</span>
          </div>
        </div>
      )}

      <Container className="min-status-col">
        <Row>
          <Col>
            <div>
              <div className="hp-ctn-howItWorks">
                <Button
                  className="btn-style btn-style-square"
                  onClick={onGoLandingPageClick}
                >
                  upload <br /> PDF
                </Button>
              </div>
              <div className="recents-box">
                {recents.map((recent, idx) => {
                  if (!recent || !recent.metaData) {
                    return null;
                  }

                  const cleanedName = cleanFileName(recent.metaData.name);

                  return (
                    <div
                      key={idx}
                      style={{backgroundImage:`url(${fe.pdf_thumbnail_url(recent.fileHash)})`,backgroundSize:"cover"}}
                      onMouseEnter={() => handleMouseEnter(idx)}
                      onMouseLeave={() => handleMouseLeave(idx)}
                    >
                      {cleanedName && (
                        <span className="file-name">{cleanedName}</span>
                      )}
                      {activeBoxIndex === idx && (
                        <button
                          className="delete-button"
                          onClick={() => handleConfirmDelete(idx)}
                        >
                          <FcFullTrash className="trash-icon" />
                        </button>
                      )}
                      {confirmDeletionArray[idx] && (
                        <button
                          id="recent"
                          className="confirm-deletion-button"
                          onClick={() => deleteFile(idx)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
