import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import UploadModal from "./UploadModal";
import "../pages/fw-v0.02-sub/landing-page.css";
import lc from "../storage_";

function LandingPage({ pop_frame }) {
  const [recents, setRecents] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  function onGoLandingPageClick(evt) {
    pop_frame(0);
  }

  function UploadButtonClick(evt) {
    document.querySelector("#files_input").click()
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
    if(evt.target.files[0]) {
      //loading animation and inactivates all buttons
      lc.uploadFile(evt.target, (data) => {
        let allFiles = lc.getAllFiles();
        allFiles = allFiles.map((el) =>
          lc.getFileDetail(el, ["metaData", "textToImage"])
        );
        setRecents(allFiles);
        console.log(allFiles);
        pop_frame(1);
        //loading animation ends here
      });
    }
    console.log(evt.target.files);
  }

  function deleteFile() {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => lc.deleteFile(file.id));
      const updatedRecents = recents.filter(
        (file) => !selectedFiles.includes(file)
      );
      setRecents(updatedRecents);
      setSelectedFiles([]);
      setShowModal(false);
    }
  }

  return (
    <div className="landing-page">
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
                    onClick={() => toggleFileSelection(recent)}
                  >
                    {/* <img src={recent.image} alt={recent.title} /> */}
                    <div className="card-body">
                      <h5 className="card-title">{recent.metaData.name}</h5>
                      <p className="card-text">{recent.description}</p>
                    </div>
                  </div>
                ))}
                <div className="delete-files-container">
                  <Button
                    onClick={() => setShowModal(true)}
                    disabled={selectedFiles.length === 0}
                  >
                    Delete Files
                  </Button>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Files</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete the selected{" "}
                    {selectedFiles.length} files?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteFile}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
