import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
// import { Spinner } from "react-bootstrap";
// import UploadModal from "./UploadModal";
import "../pages/fw-v0.02-sub/landing-page.css";
import lc from "../storage_";

import { FcFullTrash } from "react-icons/fc";
function LandingPage({ pop_frame, setCurrentFileHash }) {

  const [recents, setRecents] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeBoxIndex, setActiveBoxIndex] = useState(null);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
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
    allFiles = allFiles.map((el) =>
      lc.getFileDetail(el, ["metaData", "textToImage"])
    );
    setRecents(allFiles);
    console.log(allFiles);
  }, []);
  function onGoLandingPageClick(evt) {
    pop_frame(0);
  }

  function UploadButtonClick(evt) {
    document.querySelector("#files_input").click();
  }

  function toggleFileSelection(file) {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(
        selectedFiles.filter((selectedFile) => selectedFile !== file)
      );
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  }

  function OnUploadInputChange(evt) {
    if (evt.target.files[0]) {
      setIsLoading(true); //start animation loading

      lc.uploadFile(evt.target, (data) => {
        let allFiles = lc.getAllFiles();
        allFiles = allFiles.map((el) =>
          lc.getFileDetail(el, ["metaData", "textToImage"])
        );
        setRecents(allFiles);
        pop_frame(1);
        setIsLoading(false); // Stop loading animation
        if(data.fileHash) setCurrentFileHash(data.fileHash);
        evt.target.value = "";
      });
    }
    console.log(evt.target.files);
  }

  function deleteFile(index) {
    // if (selectedFiles.length > 0) {
    //   selectedFiles.forEach((file) => lc.deleteFile(file.id));
    //   const updatedRecents = recents.filter(
    //     (file) => !selectedFiles.includes(file)
    //   );
    //   setRecents(updatedRecents);
    //   setSelectedFiles([]);
    //   setShowModal(false);
    // }
    lc.deleteFile(recents[index].id);
    const updatedRecents = [...recents];
    updatedRecents.splice(index, 1);
    setRecents(updatedRecents);
    const updatedConfirmDeletionArray = [...confirmDeletionArray];
    updatedConfirmDeletionArray.splice(index, 1);
    setConfirmDeletionArray(updatedConfirmDeletionArray);
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
                {recents.map((recent, idx) => (
                  <div
                    // className={`card ${
                    //   selectedFiles.includes(recent) ? "selected" : ""
                    // }`}
                    key={idx}
                    onMouseEnter={() => handleMouseEnter(idx)}
                    onMouseLeave={() => handleMouseLeave(idx)}
                  >
                    <span className="file-name">{recent.metaData.name}</span>
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
                        className="confirm-deletion-button"
                        onClick={() => deleteFile(idx)}
                      >
                        Delete
                      </button>
                    )}
                    {/* <>
                      <span className="file-index-number">{idx}</span>
                       </> */}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
