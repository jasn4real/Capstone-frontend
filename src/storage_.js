const API = process.env.REACT_APP_API_URL;
import srv from './fetch_';
const [ fileTable, file_list_prefix ] = [ "files", "filehash" ];
function error_handle(error) {
  console.log(error);
}

function uploadFile(files, callback){
  srv.upload_file(files, (files_, data)=>{
    try {
      if(data.fileHash.length === 64) {
        let files_table = localStorage.getItem(fileTable);
        if(!files_table){
          localStorage.setItem(fileTable, JSON.stringify([data.fileHash]));
        }else{
          files_table = JSON.parse[files_table];
          files_table.push(data.fileHash);
          localStorage.setItem(fileTable, JSON.stringify(files_table));
        }
        localStorage.setItem(`${file_list_prefix}-${data.fileHash}`, JSON.stringify(files.files[0]))
        callback(data);
      }else throw "upload failed";
    } catch (error) {
      error_handle(error);
      callback(false);
    }
  })
}

function getAllFiles(limit = undefined){
  let files_table = localStorage.getItem(fileTable);
  try {
    if(!files_table){
      return [];
    }else{
      let ret = JSON.parse(files_table);
      return limit ? ret.slice(0, limit) : ret;
    }
  } catch (error) {
    error_handle(error);
    return [];
  }
}

function getFile(fileHash){
  try {
    return JSON.parse(localStorage.getItem(`${file_list_prefix}-${fileHash}`));
  } catch (error) {
    error_handle(error);
    return false;
  }
}

export default {uploadFile, getAllFiles, getFile}