import React from "react";
import { useState, useEffect } from "react";

import lc from "../storage_";
import "./ReadingComprehension.css";

import Form from "react-bootstrap/Form";
import { BsBookHalf } from "react-icons/bs";
import { FcReading } from "react-icons/fc";
import {FcFolder} from "react-icons/fc"
import {FcBookmark} from "react-icons/fc"


export default function ReadingComprehension() {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      const fileHash =
        "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef";
      const fileDetails = await lc.getFileDetail(fileHash, [
        "textToComprehenstion",
      ]);
      setHistoryData(fileDetails.textToComprehenstion);
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

  console.log(historyData.length);

  return (
    <div>
      <div className="container content">
        <div className="reading-level-radio">
          <span className="reading-level-text">Select reading level</span>

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
              name="readingcomprehenstion"
              placeholder="what is this text about ?"
            />
          </Form.Group>
          <button className="rc-submit-button" type="submit">
            SEND
          </button>
        </Form>
        {/*  */}
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
            responseData && <div className="rc-text">{responseData}</div>
          )}
        </div>
        <div className="menu-container">
          <ul className="vertical-nav">
            
          <span className="history-column-text">
                <FcReading className="book-half" />
               <FcBookmark className="book-half"/>
               <FcFolder className="book-half" />
          
                History
              </span>
            <li>
              <ul>
                {historyData &&
                Array.isArray(historyData) &&
                historyData.length !== 0 ? (
                  historyData.map((history) => (
                    <li key={history.q}>
                      <p>{history.q}</p>
                    </li>
                  ))
                ) : (
                  <li>No history data available.</li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
