import React from "react";
import { useState } from "react";

import lc from "../storage_";
import "./ReadingComprehension.css";
import Form from "react-bootstrap/Form";

export default function ReadingComprehension() {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReadingComprehensionSubmit = (evt) => {
    evt.preventDefault();
    const fileHash =
      "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef";
    setIsLoading(true);
    lc.textToComprehension(
      fileHash,
      evt.target.readingcomprehenstion.value,
      "2",
      (data) => {
        console.log(data);
        setResponseData(data);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="container rc-content">
      <div className="container rc-text">
        {" "}
        {isLoading ? (
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          responseData && <div className="rc-text">{responseData}</div>
        )}
      </div>
      <Form className="rc-form-box" onSubmit={handleReadingComprehensionSubmit}>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="text"
            name="readingcomprehenstion"
            placeholder="Type..."
          />
        </Form.Group>
        <button className="rc-submit-button" type="submit">
          SEND
        </button>
      </Form>
      {/*  */}

      <div className="reading-level-radio">
        <span className="reading-level-text">Select reading level</span>
        <div class="group">
          <input type="radio" name="rb" id="rb1" />
          <label for="rb1">Foundational</label>
          <input type="radio" name="rb" id="rb2" />
          <label for="rb2">Proficient</label>
          <input type="radio" name="rb" id="rb3" />
          <label for="rb3">Advanced</label>
        </div>
      </div>
    </div>
  );
}
