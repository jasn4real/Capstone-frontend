import React from "react";
import { useState, useEffect } from "react";

import { FcInfo } from "react-icons/fc";
import './reading-comprehension-page-h.css';
import lc from "../../storage_";

export default function ComprehensionPage({fileHash}){
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  useEffect(() => {
    setHistoryData(getAllHistorywithUnifyTime(fileHash));
  }, [])
  ///////////////////////////////
  function onSubmitClick(evt){
    evt.preventDefault();
    let [readingLevel, question] = [1, evt.currentTarget.readingcomprehension.value];
    for(let radio in evt.currentTarget.rb) if(evt.currentTarget.rb[radio].checked){
      readingLevel = radio;
      break;
    }
    
    setIsLoading(true);
    lc.textToComprehension(
      fileHash,
      evt.target.readingcomprehension.value,
      (readingLevel + 1),
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
  function getAllHistorywithUnifyTime(fileHash){
    const raw = lc.getFileDetail(fileHash, ["comprehension", "image", "text"]);
    const ret = [];
    for(let catalog_key in raw) for(let content in raw[catalog_key]){
      ret.push({...raw[catalog_key][content], "type": catalog_key});
    }
    ret.sort((a, b)=> (new Date(a.timestamp).getTime()-new Date(b.timestamp).getTime())>0 ? -1 : 1);
    return ret;
  }
  function onImgError(evt){
    console.log('img error', evt.target)
    evt.target.src = evt.target.getAttribute('alt-src');
  }
  ///////////////////////////////
  return <div>
    <div className="comprehension-input-div">
      <form onSubmit={onSubmitClick}>
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
          <input 
            type="text" 
            name="readingcomprehension" 
            placeholder="what is this text about ?" 
          /> 
          {isLoading 
            ?<button className="btn btn-style">Loading</button>
            :<button className="btn btn-style" type="submit">SEND</button>
          }

        </div>
      </form>
    </div>
    <div className="history-in-comprehension-page-div">
      {historyData.map((el, idx)=><div className="history-card" key={idx}>
        <li><span>question :</span><span>{el.q}</span></li>
        {el.type==="image" 
        ? <img src={el.data} alt="Not Found" alt-src='./Caplogo2.png' onError={onImgError}/>

        : <li><span>answer :</span><span>{el.data}</span></li>
        }
        <li><span>{el.timestamp}</span></li>
      </div>)}
      
    </div>
  </div>
}