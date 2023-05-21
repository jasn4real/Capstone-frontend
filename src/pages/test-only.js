import React from "react";
import lc from '../storage_';

export default function TestOnly(){
  function onFileUpload(evt){
    evt.preventDefault();
    lc.uploadFile(evt.target.files, (data)=>{
      console.log(data);
      //example of data :{"result":"success","fileHash":"0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef","message":"Successfully uploaded"}
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
      //example of data: {"id":"chatcmpl-7IiHV41bKunojawwGQ6fNfYf9kW6k","object":"chat.completion","created":1684694477,"model":"gpt-3.5-turbo-0301","usage":{"prompt_tokens":2025,"completion_tokens":42,"total_tokens":2067},"choices":[{"message":{"role":"assistant","content":"The story is about an old fisherman named Santiago who has not caught a fish in 84 days. He goes out to sea and catches a giant marlin, but struggles to bring it back to shore."},"finish_reason":"stop","index":0}]}
    })
  }
  function printComprehenstionHistory(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, ['textToComprehenstion']));
    /*/example of getFileDetail: 
    {
        "textToComprehenstion": {
            "what is this story about?": {
                "q": "what is this story about?",
                "data": "The story is about an old fisherman named Santiago who has not caught a fish in 84 days. He goes out to sea and catches a giant marlin, but struggles to bring it back to shore.",
                "timestamp": "2023-05-14T12:01:10.294Z"
            },
            "what is this story about?-2": {
                "q": "what is this story about?-2",
                "data": "The story is about an old fisherman named Santiago who has not caught a fish in 84 days. He goes out to sea and catches a giant marlin, but struggles to bring it back to shore.",
                "timestamp": "2023-05-21T18:41:27.710Z"
            }
        }
    }
    */
  }
  ////////////////////////////////////////////
  function onTextToExplanation (evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.textToExplanation(fileHash, evt.target.texttoexplanation.value, (data)=>{
      console.log(data);
      //example of data: "Cute bunny" refers to a small, adorable rabbit.
    })
  }
  function printTextToExplanation(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, ['textToExplanation']));
    //example of getFileDetail:
    /*
      {
        "textToExplanation": {
          "cute bunny": {
            "q": "cute bunny",
            "data": "\"Cute bunny\" refers to a small, adorable rabbit.",
            "timestamp": "2023-05-21T18:58:14.502Z"
          }
        }
      }
    */
  }
  ////////////////////////////////////////////
  function OnTextToImage(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.textToImage(fileHash, evt.target.texttoimage.value, (data)=>{
      console.log(data);
      //example of data: https://oaidalleapiprodscus.blob.core.windows.net/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-aUeIYTkaCZSdbhxo052u14EH.png?st=2023-05-21T17%3A59%3A52Z&se=2023-05-21T19%3A59%3A52Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-21T00%3A58%3A02Z&ske=2023-05-22T00%3A58%3A02Z&sks=b&skv=2021-08-06&sig=1LhBHOnMMb/3UkdtQKJR50fetR/5VZaKDo9tF74a1g0%3D
    })
  }
  function printTextToImage(evt){
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    console.log(lc.getFileDetail(fileHash, ['textToImage']));
    /**
     * example of getFileDetail
     * {
    "textToImage": {
        "cute bunny": {
            "q": "cute bunny",
            "data": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-aUeIYTkaCZSdbhxo052u14EH.png?st=2023-05-21T17%3A59%3A52Z&se=2023-05-21T19%3A59%3A52Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-21T00%3A58%3A02Z&ske=2023-05-22T00%3A58%3A02Z&sks=b&skv=2021-08-06&sig=1LhBHOnMMb/3UkdtQKJR50fetR/5VZaKDo9tF74a1g0%3D",
            "timestamp": "2023-05-21T18:59:53.044Z"
        }
      }
    }
    */
  }

  ////////////////////////////////////////////
  function downloadFileClick(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.downloadFile(fileHash, (result)=>{
      if(result){
        console.log(result);
        //example of result: 
        /**
        Blob {size: 380238, type: 'application/octet-stream'}
        size
        : 
        380238
        type
        : 
        "application/octet-stream"
        [[Prototype]]
        : 
        Blob
         */
      }
    })
  }
  ////////////////////////////////////////////
  function getFileMetaClick(evt){
    evt.preventDefault();
    const fileHash = '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef';
    lc.getFileMeta(fileHash, (meta) => {
      console.log(meta);
      //example of meta: {"name":"oldmansea.pdf","type":"application/pdf","size":380238}
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
      ])
    );
    /**
     *example of getFileDetail {
    "metaData": {
        "name": "oldmansea.pdf",
        "lastModified": 1680656982986,
        "lastModifiedDate": "2023-04-05T01:09:42.986Z",
        "webkitRelativePath": "",
        "size": 380238,
        "type": "application/pdf"
    },
    "textToImage": {
        "cute bunny": {
            "q": "cute bunny",
            "data": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-aUeIYTkaCZSdbhxo052u14EH.png?st=2023-05-21T17%3A59%3A52Z&se=2023-05-21T19%3A59%3A52Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-21T00%3A58%3A02Z&ske=2023-05-22T00%3A58%3A02Z&sks=b&skv=2021-08-06&sig=1LhBHOnMMb/3UkdtQKJR50fetR/5VZaKDo9tF74a1g0%3D",
            "timestamp": "2023-05-21T18:59:53.044Z"
        }
    },
    "textToExplanation": {
        "cute bunny": {
            "q": "cute bunny",
            "data": "\"Cute bunny\" refers to a small, adorable rabbit.",
            "timestamp": "2023-05-21T18:58:14.502Z"
        }
    },
    "textToComprehenstion": {
        "what is this story about?-2": {
            "data": "The story is about an old fisherman named Santiago who has not caught a fish in 84 days. He goes out to sea and catches a giant marlin, but struggles to bring it back to shore.",
            "level": "2",
            "q": "what is this story about?",
            "timestamp": "2023-05-21T18:57:25.813Z"
        }
    }
}
     */
  }
  function getAllfiles(evt){
    let allFiles = lc.getAllFiles();
    allFiles = allFiles.map(el => lc.getFileDetail(el, ['metaData','textToImage']));
    console.log(allFiles);
    /*/example of allFiles: [
      "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef",
      "ca0fb10ada5af2f34aa8809e2c5be43b45ff2a04561a8aa388ddd514c7cc5c53",
      "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef"
    ]
    */
  }
  function deleteFile(fileHash){
    lc.deleteFile(fileHash);
    //
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