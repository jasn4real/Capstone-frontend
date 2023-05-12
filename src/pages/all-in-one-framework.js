import React from "react";
import './all-in-one-framework.css';

export default function AllInOneFramework(){
  
  
  //splitter click event/////////////////////////////////////////////////////
  function horizontal_splitter_click(){
    const splitter = document.querySelector(".horizontal-splitter");
    const [landing_div, landing_next] = [splitter.previousElementSibling, splitter.nextElementSibling];
    if(landing_div.clientHeight === 0){
      landing_div.classList.remove("hidden");
      landing_next.classList.add("hidden");
    }else{
      landing_div.classList.add("hidden");
      landing_next.classList.remove("hidden");
    }
  }
  function vertical_splitter(){
    const splitter = document.querySelector(".vertical-splitter");
    const [comprehenstion_div, assistance_div] = [splitter.previousElementSibling, splitter.nextElementSibling];
    if(comprehenstion_div.clientWidth === 0){
      comprehenstion_div.classList.remove("hidden");
      assistance_div.classList.add("hidden");
    }else{
      comprehenstion_div.classList.add("hidden");
      assistance_div.classList.remove("hidden");
    }
  }
  ////components of splitter///////////////////////////////////////////////////
  return <div className="main-frame-div" >
    <div className="landing-div">
      <div><h1>this is landing page, put content in this div</h1></div>
    </div>
    <div className="horizontal-splitter" onClick={horizontal_splitter_click}><p>|</p></div>
    <div className="reading-div hidden">
      <div className="reading-comprehenstion-div">this is reading comprehenstion, put content in this div</div>
      <div className="vertical-splitter" onClick={vertical_splitter}><p>{'-'}</p></div>
      <div className="reading-assistance-div hidden">this is reading assistance, put content in this div</div>
    </div>
  </div>
}