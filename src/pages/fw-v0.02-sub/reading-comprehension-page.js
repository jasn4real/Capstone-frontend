import React from "react";
import { FcInfo } from "react-icons/fc";
import './reading-comprehension-page.css';

export default function ComprehensionPage(){
  
  return <div className="comprehensionp-panel">
    <div className="comprehension-input-div">
      <form>
        <span className="reading-level-text">Select reading level</span>
        <div className="form-check">
          <label>
            <input className="form-check-input" type="radio" name="rb" /> 
            Easy
          </label>
          <label >
            <input className="form-check-input" type="radio" name="rb" />
            Medium
          </label>
          <label >
            <input className="form-check-input" type="radio" name="rb" />
            Advanced
          </label>
          <FcInfo className="info-icon" />
        </div>
        <div className="comprehension-input-button">
          <input type="text" name="readingcomprehension" placeholder="what is this text about ?" /> 
          <button className="rc-submit-button" type="submit">
            SEND
          </button>

        </div>
      </form>
    </div>
    <div className="history-in-comprehension-page-div">
      
    </div>
  </div>
}