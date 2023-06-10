import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import lc from "../storage_";



function UploadModal() {
  const [showModal, setShowModal] = useState(false);
  const [recents, setRecents] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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

  return (
    <>
      <Button
        variant="primary"
        className="btn btn-style-lg"
        onClick={handleShow}
      >
        Upload PDF
      </Button>

      <Modal show={showModal} onHide={handleClose} id="exampleModal">
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="info" size="sm" disabled onClick={initiateUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <h3>Upload file</h3>
        <input id="files_input" type="file" />
        <Button onClick={initiateUpload}>Upload file</Button>
      </div>
    </>
  );
};

export default UploadModal;