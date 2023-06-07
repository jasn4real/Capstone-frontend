import React, { useState, useEffect, useRef } from "react";
import "./reading-assistance-page.css";
import ComprehensionPage from "./reading-comprehension-page";
import { FcAbout } from "react-icons/fc";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import ReadingAssistance from "../ReadingAssistance";
import { getHistory } from '../../storage_';

export default function AssistancePage({ pop_frame }) {
  const [readingAssistanceWidth, setReadingAssistanceWidth] = useState(55);
  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
 

  useEffect(() => {
    const fetchHistoryData = async () => {
      const historyData = await fetchHistory();
      setHistoryData(historyData);
    };

    fetchHistoryData();
  }, []);

  const fetchHistory = async () => {
    // Fetch history data from storage or API
    // Return the history data
  };

 

  const toggleHistory = () => {
    setShowHistory((prevShowHistory) => !prevShowHistory);
  };

  const HistoryPanel = ({ historyData }) => {
    return (
      <div className="history-panel">
        <h2>History</h2>
        <ul>
          {historyData.map((item, index) => (
            <li key={index}>
              <p>{item.text}</p>
              <p>Action: {item.action}</p>
              <p>Result: {item.result}</p>
              <p>Timestamp: {item.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };



  return (
    <div className="assistance-page" >
      <div className="cols-container">
        <div className="reading-panel" style={{ flexBasis: `${readingAssistanceWidth}%` }}>
          <div className="text-reading-panel">
            <div className="popup-detail">
              <ReadingAssistance historyData={historyData} /> {/* Pass historyData as prop */}
            </div>
          </div>
          {showHistory && <HistoryPanel historyData={historyData} />} {/* Render the HistoryPanel when showHistory is true */}
        </div>

        <div className="comprehension-panel">
          <ComprehensionPage />
        </div>
      </div>
    </div>
  );
}
