import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import lc from "../storage_";
import "../RecentsContainer.css";

const RecentsContainer = () => {
  const [recents, setRecents] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let allFiles = lc.getAllFiles();
    allFiles = allFiles.map((el) =>
      lc.getFileDetail(el, ["metaData", "textToImage"])
    );
    setRecents(allFiles);
    console.log(allFiles);
  }, []);

  function initiateUpload(evt) {
    lc.uploadFile(document.querySelector("#files_input"), (data) => {
      let allFiles = lc.getAllFiles();
      allFiles = allFiles.map((el) =>
        lc.getFileDetail(el, ["metaData", "textToImage"])
      );
      setRecents(allFiles);
      console.log(allFiles);
      document.querySelector("#files_input").value = "";
    });
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
    <div className="recents-container">
      <div className="delete-files-container">
        <Button
          onClick={() => setShowModal(true)}
          disabled={selectedFiles.length === 0}
        >
          Delete Files
        </Button>
      </div>

      {recents.map((recent, idx) => (
        <div
          className={`card ${selectedFiles.includes(recent) ? "selected" : ""}`}
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

      <div>
        <h3>Upload file</h3>
        <input id="files_input" type="file" />
        <Button onClick={initiateUpload}>Upload file</Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the selected {selectedFiles.length} files?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteFile}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecentsContainer;

