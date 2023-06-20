import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ReadingAssistance-h.css";
import storageFunctions from "../storage_";
import anime from "animejs";
import {extractTextAndImageFromPDF} from '../pdf-wrapper_';

import fe from "../fetch_";

const ReadingAssistance = ({ fileHash, triggerHistoryUpdate }) => {
  const [selection, setSelection] = useState("");
  let [isLoading, setIsLoading] = useState(true);
  // let [pdf_content, set_pdf_content] = useState([]);
  // const canvas_list = useRef([]);
  const render_container = useRef(null);

  ///////////////////////////////////
  useEffect(() => {
    if(fileHash !== undefined) {
      setIsLoading(true);
      render_container.current.innerHTML = "";
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
    <div className="bigcontainer" style={{ position: "relative", overflow: 'auto' }}>
      {isLoading ? <p>Loading</p> :""}
      <div ref={render_container}></div>
    </div>
  );
};

export default ReadingAssistance;

