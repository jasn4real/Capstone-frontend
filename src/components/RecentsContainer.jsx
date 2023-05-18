import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import lc from "../storage_";

const RecentsContainer = () => {
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    let allFiles = lc.getAllFiles();
    allFiles = allFiles.map((el) =>
      lc.getFileDetail(el, ["metaData", "textToImage"])
    );
    setRecents(allFiles);
    console.log(allFiles);
  }, []);

  function initiateUpload(evt) {
    // document.querySelector("#files_input").click();
    lc.uploadFile(document.querySelector("#files_input"), (data) => {
      let allFiles = lc.getAllFiles();
      allFiles = allFiles.map((el) =>
        lc.getFileDetail(el, ["metaData", "textToImage"])
      );
      setRecents(allFiles);
      console.log(allFiles);
    });
  }

  return (
    <div className="recents-container">
      {recents.map((recent) => (
        <div className="card" key={recent.id}>
          <img src={recent.image} alt={recent.title} />
          <div className="card-body">
            <h5 className="card-title">{recent.metaData.name}</h5>
            <p className="card-text">{recent.description}</p>
          </div>
        </div>
      ))}
      <div>
        <h3>Upload file</h3>
        {/* <form onSubmit={onFileUpload}> */}
        <input
          id="files_input"
          type="file"
        //   onChange={onFileUpload}
        //   style={{ display: "none" }}
        />
        <Button onClick={initiateUpload}>Upload file</Button>
        {/* </form> */}
      </div>
    </div>
  );
};

export default RecentsContainer;
