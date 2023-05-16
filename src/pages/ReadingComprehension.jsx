import React from "react";
import { useState } from "react";

import lc from "../storage_";
import Form from "react-bootstrap/Form";

export default function ReadingComprehension() {
  const [responseData, setResponseData] = useState(null);

  const handleReadingComprehensionSubmit = (evt) => {
    evt.preventDefault();
    const fileHash =
      "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef";
    lc.textToComprehension(
      fileHash,
      evt.target.readingcomprehenstion.value,
      (data) => {
        console.log(data);
        setResponseData(data);
      }
    );
  };

  return (
    <div className="container rc-content">
      <div className="container rc-text"></div>

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
      {responseData && <div>{responseData}</div>}
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
