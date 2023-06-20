import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../pages/fw-v0.02-sub/landing-page.css";
import lc from "../storage_";
import fe from "../fetch_";
import UserGuide from "./UserGuide";

// import TutorialModal from "../TutorialModal/index";

import { FcFullTrash } from "react-icons/fc";
function LandingPage({
  pop_frame,
  setCurrentFileHash,
  fileHash,
}) {

  const [recents, setRecents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    update_recents();
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
        evt.target.value = "";
        setIsLoading(false);
        if (data === false) return;
        update_recents();
        pop_frame(1);

        if (data.fileHash) setCurrentFileHash(data.fileHash);
      });
    }
  }
  function update_recents(){
    let ret = [];
    for(let el of lc.getAllFiles()){
      let pdf_info = lc.getFileDetail(el, ["metaData", "textToImage", "textToExplanation", "textToComprehension"]);
      if(pdf_info['metaData'] === null) continue; 
      ret.push({...pdf_info, fileHash: el});
    }
    setRecents(ret);
  }
  function change_file_click(evt){
    const recent_idx = evt.currentTarget.getAttribute("recent_idx");
    setCurrentFileHash(recents[recent_idx].fileHash);
  }
  function delete_file_click(evt){
    evt.currentTarget.classList.add("confirm-pop");
  }
  function on_mouse_leave_confirm_delete(evt){
    evt.currentTarget.classList.remove("confirm-pop");
  }
  function on_confirm_delete(evt){
    const recent_idx = evt.currentTarget.getAttribute("recent_idx");
    if(fileHash === recents[recent_idx].fileHash) pop_frame(0); 
    lc.deleteFile(recents[recent_idx].fileHash);
    update_recents();
  }

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
              {/* <div>
                <p>User guide</p>
              </div> */}
            </div>
          </Col>
        </Row>
        <UserGuide style={{position: "absolute"}} />
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
            <div className="hp-ctn-howItWorks">
              <Button
                className="btn-style btn-style-square"
                onClick={onGoLandingPageClick}
              >
                Go Back & <br></br>
                upload PDF
              </Button>
            </div>
          </Col>
        </Row>
        <Row style={{overflowY: "scroll"}}>
            <Col>
              <div className="recents-box">
                {recents.map((recent, idx) => {
                  return (
                    <div
                      key={idx}
                      style={{backgroundImage:`url(${fe.pdf_thumbnail_url(recent.fileHash)})`,backgroundSize:"cover"}}
                      className={`recent-card ${recent.fileHash === fileHash ? "current-document-in-recent" : ""}`}
                    >
                      <div>
                        <div recent_idx={idx} onClick={change_file_click}>
                          <p>{recent.metaData.name}</p>
                        </div>
                        <div className="recent-box-del-btn" recent_idx={idx} onClick={delete_file_click} onMouseLeave={on_mouse_leave_confirm_delete}>
                          <div><FcFullTrash className="trash-icon" /></div>
                          <div recent_idx={idx} onClick={on_confirm_delete}><span>Confirm Delete</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
