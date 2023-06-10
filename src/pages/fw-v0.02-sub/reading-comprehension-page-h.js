import React from "react";
import { useState, useEffect } from "react";

import { FcInfo } from "react-icons/fc";
import "./reading-comprehension-page-h.css";
import lc from "../../storage_";

export default function ComprehensionPage({ fileHash }) {
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  useEffect(() => {
    console.log(getAllHistorywithUnifyTime(fileHash));
    setHistoryData(getAllHistorywithUnifyTime(fileHash));
  }, []);
  ///////////////////////////////
  function onSubmitClick(evt) {
    evt.preventDefault();
    let [readingLevel, question] = [
      1,
      evt.currentTarget.readingcomprehension.value,
    ];
    for (let radio in evt.currentTarget.rb)
      if (evt.currentTarget.rb[radio].checked) {
        readingLevel = radio;
        break;
      }

    setIsLoading(true);
    lc.textToComprehension(
      fileHash,
      evt.target.readingcomprehension.value,
      readingLevel + 1,
      (data) => {
        console.log(data);
        setHistoryData(getAllHistorywithUnifyTime(fileHash));
        // let modifiedData = data + "pychsatm";
        // const hasNumberedText = /\d+\./.test(data);
        // console.log("Has numbered text:", hasNumberedText);

        // if (hasNumberedText) {
        //   modifiedData = data.replace(/\d+\./g, "\n$&");
        //   console.log(modifiedData, "modifiedD");
        // }

        // setResponseData(modifiedData);
        setIsLoading(false);
      }
    );
  }
  function getAllHistorywithUnifyTime(fileHash) {
    const raw = lc.getFileDetail(fileHash, ["comprehension", "image", "text"]);
    const ret = [];
    for (let catalog_key in raw)
      for (let content in raw[catalog_key]) {
        const timestamp = new Date(
          raw[catalog_key][content].timestamp
        ).toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          // hour: "numeric",
          // minute: "numeric",
          // second: "numeric",
        });
        ret.push({
          ...raw[catalog_key][content],
          type: catalog_key,
          timestamp,
        });
      }
    ret.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() > 0
        ? -1
        : 1
    );
    return ret;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function onImgError(evt) {
    console.log("img error", evt.target);
    evt.target.src = evt.target.getAttribute("alt-src");
  }
  ///////////////////////////////
  return (
    <div className="reading-comprehension-container">
      <div className="comprehension-input-div">
        <form onSubmit={onSubmitClick}>
          <span className="reading-level-text">Select reading level</span>
          <div className="form-check">
            <label htmlFor="rb1">
              <input className="form-check-input" type="radio" name="rb" id="rb1"/>
              Easy
            </label>
            <label htmlFor="rb2">
              <input className="form-check-input" type="radio" name="rb" id="rb2"/>
              Medium
            </label>
            <label htmlFor="rb3">
              <input className="form-check-input" type="radio" name="rb" id="rb3" />
              Advanced
            </label>
            <FcInfo className="info-icon" />
          </div>

          <div className="comprehension-input-button">
            <input
              className="reading-comprehension-input"
              type="text"
              name="readingcomprehension"
              placeholder="what is this text about ?"
              id="read-comp-i"
            />
            {isLoading ? (
              <button className="btn btn-style">Loading</button>
            ) : (
              <button className="btn btn-style" type="submit">
                SEND
              </button>
            )}
          </div>
        </form>
      </div>
      {isLoading ? (
        <div className="history-in-comprehension-page-div lds">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <div className="history-in-comprehension-page-div">
          {historyData.map((el, idx) => (
            <div className="history-card" key={idx}>
              <li>
                <div className="history-card-tags">
                  <span
                    className="response-type"
                    style={{
                      color:
                        el.type === "comprehension"
                          ? "rgb(145 113 180)"
                          : "#2096f3",
                    }}
                  >
                    {el.type.toUpperCase()}
                  </span>
                  ⎮ <span className="date-text">DATE {el.timestamp}</span>
                </div>

                <span className="question-header">Q</span>

                <span className="user-question-text">{capitalizeFirstLetter(el.q)}</span>
              </li>
              {el.type === "image" ? (
                <img
                  src={el.data}
                  alt="Not Found"
                  alt-src="./Caplogo2.png"
                  onError={onImgError}
                />
              ) : (
                <li>
                  <span className="answer-header">response :</span>
                  <span className="response-text">{el.data}</span>
                </li>
              )}
              <li></li>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
