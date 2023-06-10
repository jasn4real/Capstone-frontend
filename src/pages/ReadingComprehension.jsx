import React from "react";
import { useState, useEffect } from "react";

import lc from "../storage_";
import "./ReadingComprehension.css";

import Form from "react-bootstrap/Form";

import { FcReading } from "react-icons/fc";
import { FcFolder } from "react-icons/fc";
import { FcBookmark } from "react-icons/fc";
import { FcInfo } from "react-icons/fc";
import { FcAbout } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
export default function ReadingComprehension() {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      const fileHash =
        "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef";
      const fileDetails = Object.values(
        lc.getFileDetail(fileHash, ["textToComprehenstion"])
          .textToComprehenstion
      );
      console.log(fileDetails);
      setHistoryData(fileDetails);
    };

    fetchHistoryData();
  }, []);

  useEffect(() => {
    console.log("historyData:", historyData);
  }, [historyData]);

  const handleReadingComprehensionSubmit = (evt) => {
    evt.preventDefault();
    const fileHash =
      "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef";
    setIsLoading(true);
    console.log(evt.target.readingcomprehension.value);
    lc.textToComprehension(
      fileHash,
      evt.target.readingcomprehension.value,
      "2",
      (data) => {
        console.log(data);
        let modifiedData = data + "pychsatm";
        const hasNumberedText = /\d+\./.test(data);
        console.log("Has numbered text:", hasNumberedText);

        if (hasNumberedText) {
          modifiedData = data.replace(/\d+\./g, "\n$&");
          console.log(modifiedData, "modifiedD");
        }

        setResponseData(modifiedData);
        setIsLoading(false);
      }
    );
  };

  return (
    <div>
      <div className="container content">
      <span className="reading-level-text">Select reading level</span>

        <div className="reading-level-radio">
          {/* <p class="gradient-text">Hello, world!</p> */}

          <FcInfo className="info-icon" />
          <div class="group">
            <input type="radio" name="rb" id="rb1" />
            <label for="rb1">Easy</label>
            <input type="radio" name="rb" id="rb2" />
            <label for="rb2">Medium</label>
            <input type="radio" name="rb" id="rb3" />
            <label for="rb3">Advanced</label>
          </div>
        </div>
        <Form
          className="rc-form-box"
          onSubmit={handleReadingComprehensionSubmit}
        >
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              name="readingcomprehension"
              placeholder="what is this text about ?"
            />
          </Form.Group>
          <button className="rc-submit-button" type="submit">
            SEND
          </button>
        </Form>
        {/*  */}
      </div>
      <div className="menu-container">
        <ul className="vertical-nav">
          <FcReading className="book-half" />
          <span className="history-column-text">
            {/* <FcBookmark className="book-half" /> */}
            {/* <FcFolder className="book-half" />
              <FcDocument className="book-half" /> */}
            History
          </span>
          <li>
            <ul>
              {historyData.length !== 0 ? (
                historyData.map((history, idx) => (
                  <li key={idx}>
                    <p>
                      <span className="question-history">Question:</span>
                      {history.q}
                    </p>
                    <p>
                      <span className="response-history">Response:</span>
                      {history.data.slice(0, 23)}
                    </p>
                  </li>
                ))
              ) : (
                <li>No history data available.</li>
              )}
            </ul>
          </li>
        </ul>
      </div>

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
            responseData && (
              <div className="rc-text">
                {" "}
                <p className="response-data">{responseData}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
