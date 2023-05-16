import React from "react";
import './all-in-one-framework.css';
import FrameworkTestButtons from'../components/framework-test-buttons';

export default function AllInOneFramework(){
  /////////////////////////////////////////////////////////
  function get_elements(){
    const horizontal_splitter = document.querySelector(".horizontal-splitter");
    const [landing_div, landing_next] = [horizontal_splitter.previousElementSibling, horizontal_splitter.nextElementSibling];
    //////////////////
    const vertical_splitter = document.querySelector(".vertical-splitter");
    const [comprehenstion_div, assistance_div] = [vertical_splitter.previousElementSibling, vertical_splitter.nextElementSibling];
    //////////////////////////////////
    const ret = {horizontal_splitter, landing_div, landing_next, vertical_splitter, comprehenstion_div, assistance_div};
    return ret;
  }
  function switchFrame(target){
    const els = get_elements();
    switch(target){
      case "reading-comprehenstion": // switch to rc page
        els.landing_div.classList.add("hidden");
        els.landing_next.classList.remove("hidden");
        els.comprehenstion_div.classList.remove('hidden');
        els.assistance_div.classList.add("hidden");
      break;
      case "reading-assistance": // switch to ra page
        els.landing_div.classList.add("hidden");
        els.landing_next.classList.remove("hidden");
        els.comprehenstion_div.classList.add('hidden');
        els.assistance_div.classList.remove("hidden");
      break;
      default: // switch to landing page
        els.landing_div.classList.remove("hidden");
        els.landing_next.classList.add("hidden");
    }
  }
  //splitter click event////////////////////////////////////
  function horizontal_splitter_click(){
    const els = get_elements();
    if(els.landing_div.clientHeight === 0){
      els.landing_div.classList.remove("hidden");
      els.landing_next.classList.add("hidden");
    }else{
      els.landing_div.classList.add("hidden");
      els.landing_next.classList.remove("hidden");
    }
  }
  function vertical_splitter(){
    const els = get_elements();
    if(els.comprehenstion_div.clientWidth === 0){
      els.comprehenstion_div.classList.remove("hidden");
      els.assistance_div.classList.add("hidden");
    }else{
      els.comprehenstion_div.classList.add("hidden");
      els.assistance_div.classList.remove("hidden");
    }
  }
  ////components of splitter///////////////////////////////
  return <div className="main-frame-div" >
    <div className="landing-div">
      <div>this is <h1>landing page</h1>, put content in this div</div>
      <FrameworkTestButtons switchFrame={switchFrame}/>
    </div>
    <div className="horizontal-splitter" onClick={horizontal_splitter_click}><p>|</p></div>
    <div className="reading-div hidden">
      <div className="reading-comprehenstion-div">
        <div>this is <h2>reading comprehenstion page</h2>, put content in this div</div>
        <FrameworkTestButtons switchFrame={switchFrame}/>
      </div>
      <div className="vertical-splitter" onClick={vertical_splitter}><p>{'-'}</p></div>
      <div className="reading-assistance-div hidden">
        <div>this is <h2>reading assistance page</h2>, put content in this div</div>
        <FrameworkTestButtons switchFrame={switchFrame}/>
      </div>
    </div>
  </div>
}