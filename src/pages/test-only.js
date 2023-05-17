import React from "react";
import lc from '../storage_';

export default function TestOnly(){
  function onFileUpload(evt){
    evt.preventDefault();
    lc.uploadFile(evt.target.files, (data)=>{
      console.log(data);
      console.log(lc.getAllFiles());
    })
  }
  //below are examples of all api call/////////////////
  function onReadingComprehensionSubmit(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    //level are presented as "1","2","3","4","5" by default level = "2"
    lc.textToComprehension(fileHash, evt.target.readingcomprehenstion.value, '2', (data)=>{
      console.log(data);
    })
  }
  function printComprehenstionHistory(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, ['textToComprehenstion']));
  }
  ////////////////////////////////////////////
  function onTextToExplanation (evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.textToExplanation(fileHash, evt.target.texttoexplanation.value, (data)=>{
      console.log(data);
    })
  }
  function printTextToExplanation(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, ['textToExplanation']));
  }
  ////////////////////////////////////////////
  function OnTextToImage(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.textToImage(fileHash, evt.target.texttoimage.value, (data)=>{
      console.log(data);
    })
  }
  function printTextToImage(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, ['textToImage']));
  }

  ////////////////////////////////////////////
  function downloadFileClick(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.download_file(fileHash, (result)=>{
      if(result){
        console.log(result);
      }
    })
  }
  ////////////////////////////////////////////
  function getFileMetaClick(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.getFileMeta(fileHash, (meta) => {
      console.log(meta);
    })
  }
  ////////////////////////////////////////////
  function getFileDetailClick(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, 
      [
        'metaData',
        'textToImage',
        'textToExplanation',
        'textToComprehenstion',
      ]));
  }
  function getAllfiles(evt){
    let allFiles = lc.getAllFiles();
    allFiles = allFiles.map(el => lc.getFileDetail(el, ['metaData','textToImage']));
    console.log(allFiles);
  }
  ////////////////////////////////////////////
  return <div>
    <h1>test fetch</h1>
    <div>
      <h3>upload file</h3>
      <form onSubmit={onFileUpload}>
        <input name="files" type="file"/>
        <button>upload file</button>
      </form>
    </div>
    <div>
      <h3> specify Hash </h3>
      <p>0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef</p>
    </div>
    <div>
      <h3> Reading comprehension </h3>
      <div>
        <form onSubmit={onReadingComprehensionSubmit}>
          <input type="text" name="readingcomprehenstion" value={'what is this story about?'} readOnly/>
          <button>submit</button>
        </form>
        <button onClick={printComprehenstionHistory}>print comprehension history to console</button>
      </div>
    </div>
    <div>
      <h3> Text to Explanation </h3>
      <div>
        <form onSubmit={onTextToExplanation}>
          <input type="text" name="texttoexplanation" value={'cute bunny'} readOnly/>
          <button>submit</button>
        </form>
        <button onClick={printTextToExplanation}>print text to explanation history to console</button>
      </div>
    </div>
    <div>
      <h3> Text to Image </h3>
      <form onSubmit={OnTextToImage}>
        <input type="text" name="texttoimage" value={'cute bunny'} readOnly />
        <button>submit</button>
      </form>
      <button onClick={printTextToImage}>print text to image history to console</button>
    </div>
    <div>
      <h3> Download file by hash</h3>
      <form onSubmit={downloadFileClick}>
        <button>download</button>
      </form>
    </div>
    <div>
      <h3> read file meta by hash</h3>
      <form onSubmit={getFileMetaClick}>
        <button>get meta data</button>
      </form>
    </div>
    
    <div>
      <button onClick={getFileDetailClick}>get all detail from file Hash</button>
      <button onClick={getAllfiles}>get all files</button>
    </div>
  </div>
}