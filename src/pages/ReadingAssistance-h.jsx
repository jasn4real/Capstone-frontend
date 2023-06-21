import React, { useState, useEffect, useRef } from "react";
import "./ReadingAssistance-h.css";
import storageFunctions from "../storage_";
import {extractTextAndImageFromPDF} from '../pdf-wrapper_';
import { FaPlus, FaMinus } from "react-icons/fa";
import fe from "../fetch_";

const ReadingAssistance = ({ fileHash, triggerHistoryUpdate, isLoading, setIsLoading }) => {
  const [selection, setSelection] = useState("");
  // let [isLoading, setIsLoading] = useState(true);
  const render_container = useRef(null);
  const popup_menu = useRef(null);
  const function_panel = useRef(null);
  let [goPage, setGoPage] = useState(0);
  let [totalPage, setTotalPage] = useState(0);
  let fontSize = 5;
  const fontSizeClassList = ["1","2","3","4","5","6","7","8","9"];
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
  function goPageOnChange(evt){
    setGoPage(evt.currentTarget.value)
  }
  function onTextEnlargeClick(evt){
    if(fontSize < fontSizeClassList.length) setFontSize(fontSize+=1);
  }
  function onTextShrinkClick(evt){
    if(fontSize > 1) setFontSize(fontSize-=1);
  }
  function setFontSize(size = "5"){
    for(let x of fontSizeClassList){
      render_container.current.classList.remove(`ra-text-size-${x}`);
    }
    render_container.current.classList.add(`ra-text-size-${size}`);
  }
  function gotoPageClick(evt){
    let ele = document.querySelector(`#anchor-page-number-${goPage}`);
    // ele.scrollIntoView()
    if(ele) ele.scrollIntoView();
  }
  ////file hash monitor///////////////////////////////
  useEffect(() => {
    if(fileHash !== undefined) {
      setIsLoading(true);
      const container = render_container.current;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      //check if pdf
      const meta = storageFunctions.getFileDetail(fileHash, ['metaData']);
      switch(meta.metaData.type){
        case "text/plain":
          fe.download_file(fileHash, (blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              const text = reader.result;
              render_txt_page(text);
              setGoPage(0);
              setIsLoading(false);
            };
            reader.onerror = () => {
              console.error('Error reading blob as text.');
            };
            reader.readAsText(blob);
            
          })
        break;
        case "application/pdf":
          extractTextAndImageFromPDF(fe.pdf_download_url_prefix + fileHash).then((pdf_content => {
            setTotalPage(pdf_content.length);
            setGoPage(0);
            render_pdf_page(pdf_content);
            setIsLoading(false);
          }))
        break;
        default : alert(`unsupport file type: ${meta.metaData.type}`);
      }
    }
    ///////////////////////////////////////
    function render_pdf_page(pdf_content){
      let elements_list = [];
      pdf_content.forEach((el, idx) => {
        elements_list.push(ce({tagName: "p", id: `anchor-page-number-${idx + 1}`, innerHTML: `page: ${idx + 1}`, class: "separator"}));
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
        for(let x of english_text_format(page_text).split("\n"))
        {
          elements_list.push(ce({tagName:"span", innerHTML: x}));
        }
      });
      render_container.current.append(...elements_list);
    }
    function render_txt_page(text){
      let elements_list = [];
      for(let x of english_text_format(text).split("\n"))
      {
        elements_list.push(ce({tagName:"span", innerHTML: x}));
      }
      render_container.current.append(...elements_list);
    }
    //////helper//////////////////////
    function english_text_format(text){
      return text.replace(/([.!?]['”’]?)(\s+|$)/g, '$1\n').replace(/\s+\n/g, '\n');
    }
    function ce(obj){
      let el = document.createElement(obj.tagName || "div");
      for(let x in obj)switch(x){
        case "tagName": break;
        case "innerText": case "innerHTML": el[x] = obj[x]; break;
        default: el.setAttribute(x, obj[x]);
      }
      return el;
    }
    /////////////////////////////////////////
  },[fileHash, setIsLoading])

  return (
    <>
    <div ref={function_panel} className="function_panel">
      <div onClick={onTextEnlargeClick}><FaPlus/></div>
      <div onClick={onTextShrinkClick}><FaMinus/></div>
      <div>
        <label> goto page
          <input type="number" min={0} max={totalPage} value={goPage} onChange={goPageOnChange}/>
          <div className="btn btn-style" onClick={gotoPageClick}> <span>Go</span> </div>
        </label>
      </div>
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
        <button className="btn btn-style" onClick={onTextToExplainationClick}>Expand on Text</button>
        <button className="btn btn-style" onClick={onTextToImageClick}>Text to Image</button>
      </div>
    </div>
    </>
  );
};
export default ReadingAssistance;

