import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ReadingAssistance-h.css";
import storageFunctions from "../storage_";
// import anime from "animejs";
import {extractTextAndImageFromPDF} from '../pdf-wrapper_';
import fe from "../fetch_";

const ReadingAssistance = ({ fileHash, triggerHistoryUpdate, isLoading, setIsLoading }) => {
  const [selection, setSelection] = useState("");
  // let [isLoading, setIsLoading] = useState(true);
  const render_container = useRef(null);
  const popup_menu = useRef(null);
  const function_panel = useRef(null);
  ////events/////////////////////////////////////////
  function handleTextSelection(evt){
    //set timeout prevent stick key
    setTimeout(function() {
      const selectedText = window.getSelection().toString();
      setSelection(selectedText);
      if (selectedText.trim() !== ""){
        popup_menu.current.classList.add('popup-on-call');
        popup_menu.current.style.left = `${evt.clientX}px`;
        popup_menu.current.style.top = `${evt.clientY}px`;
      }
    }, 100); // 100 milliseconds = 0.1 seconds
    
  }
  function handleUnselection(evt){
    popup_menu.current.classList.remove('popup-on-call');
  }
  function onTextToExplainationClick(evt){
    setIsLoading(true);
    storageFunctions.textToExplanation(fileHash, selection, (data) => {
      console.log(data);
      setIsLoading(false);
      if(data){
        triggerHistoryUpdate(selection);
      }

    });
  }
  function onTextToImageClick(evt){
    setIsLoading(true);
    storageFunctions.textToImage(fileHash, selection, (data) => {
      setIsLoading(false);
      console.log(data);
      triggerHistoryUpdate(selection);
    })
  }
  ////file hash monitor///////////////////////////////
  useEffect(() => {
    if(fileHash !== undefined) {
      setIsLoading(true);
      const container = render_container.current;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      extractTextAndImageFromPDF(fe.pdf_download_url_prefix + fileHash).then((pdf_content => {
        render_page(pdf_content);
        setIsLoading(false);
      }))
    }
    ///////////////////////////////////////
    function render_page(pdf_content){
      let elements_list = [];
      pdf_content.forEach((el, idx) => {
        elements_list.push(ce({tagName: "p", innerHTML: `page: ${idx + 1}`, class: "separator"}));
        //rendering images
        for(let img of el.imgs){
          let canvas = ce({tagName: "canvas"});
          elements_list.push(canvas);
          createImageBitmap(img.bitmap).then((ret)=>{
            canvas.width = ret.width;
            canvas.height = ret.height;
            canvas.getContext('2d').drawImage(ret, 0, 0);
          })
        }
        //rendering text
        let page_text = "";
        for(let text of el['text']['items']){
          page_text += text.str;
          if(text.hasEOL) page_text += " ";
        }
        const formattedText = page_text.replace(/([.!?]['”’]?)(\s+|$)/g, '$1<br>').replace(/\s+\n/g, '<br>');

        elements_list.push(ce({tagName:"span", innerHTML: formattedText}));
        
      });
      render_container.current.append(...elements_list);
      /////////////////////////////////////////
      function ce(obj){
        let el = document.createElement(obj.tagName || "div");
        for(let x in obj)switch(x){
          case "tagName": break;
          case "innerText": case "innerHTML": el[x] = obj[x]; break;
          default: el.setAttribute(x, obj[x]);
        }
        return el;
      }
    }
  },[fileHash])

  return (
    <>
    <div ref={function_panel} className="function_panel">
      <button>+</button>
      <button>-</button>
    </div>
    <div className="bigcontainer">
      
      {
        isLoading ? 
        <p>Loading</p> : 
        <h3>{fileHash? storageFunctions.getFileDetail(fileHash,['metaData'])["metaData"]['name']: ""}</h3>
      }
      <div ref={render_container} 
        onMouseUp={handleTextSelection} 
        onKeyUp={handleTextSelection}
        onMouseDown={handleUnselection}
        onKeyDown={handleUnselection}
      >
      </div>
      <div ref={popup_menu} className="ra-popup-menu-box">
        <button className="btn btn-style" onClick={onTextToExplainationClick}>Text to Explanation</button>
        <button className="btn btn-style" onClick={onTextToImageClick}>Text to Image</button>
      </div>
      
    </div>
    </>
    
  );
};

export default ReadingAssistance;

