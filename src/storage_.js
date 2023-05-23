import srv from './fetch_';
const [ fileTable, file_list_prefix ] = [ "files", "filehash" ];
function error_handle(error) {
  console.log(error);
}
function check_string(){
  for(let item of arguments) if(typeof item !== 'string'){
    error_handle(item, ' not string');
    return false;
  }
  return true;
}
////all history///////////////////////
function check_key_name(category, fileHash){
  let keyName = ""
  switch(category){
    case "image":
      keyName = `${file_list_prefix}-${fileHash}-image-history`;
    break;
    case "text":
      keyName = `${file_list_prefix}-${fileHash}-text-history`;
    break;
    case "comprehension":
      keyName = `${file_list_prefix}-${fileHash}-comprehension-history`;
    break;
    default:
      return false;
  }
  return keyName;
}
function setHistory(category, fileHash, subKeyName, data){
  const keyName = check_key_name(category, fileHash);
  if(!keyName) return false;
  const item = {...data, timestamp: new Date()};
  try {
    let history = JSON.parse(localStorage.getItem(keyName));
    history[subKeyName] = item;
    localStorage.setItem(keyName, JSON.stringify(history));
  } catch (error) {
    localStorage.setItem(keyName, JSON.stringify({[subKeyName]: item}));
  }
}
function getHistory(category, fileHash){
  if(typeof fileHash !== 'string') return false;
  const keyName = check_key_name(category, fileHash);
  try {
    const history = JSON.parse(localStorage.getItem(keyName))
    return !history ? {} : history;
  } catch (error) {
    error_handle(error);
    return {};
  }
}
function deleteHistory(category, fileHash){
  const keyName = check_key_name(category, fileHash);
  localStorage.removeItem(keyName);
}
function pull_history(fileHash, category, question){
  const history = getFileDetail(fileHash, [category]);
  try{
    if(history[category][question]){
      return history[category][question].data;
    }
    return false;
  }catch(error){
    return false;
  }
}
///file related///////////////////////////////////////////////
function downloadFile(fileHash, callback){
  srv.download_file(fileHash, (result) => {
    callback(result);
  })
}
function uploadFile(files, callback){
  srv.upload_file(files, (data)=>{
    try {
      if(data.fileHash.length === 64) {
        let files_table = localStorage.getItem(fileTable);
        try {
          files_table = JSON.parse(files_table);
          if(!files_table.includes(data.fileHash)){
            files_table.push(data.fileHash);
          }
          localStorage.setItem(fileTable, JSON.stringify(files_table));
        } catch (error) {
          error_handle(error);
          localStorage.setItem(fileTable, JSON.stringify([data.fileHash]));
        }
        localStorage.setItem(`${file_list_prefix}-${data.fileHash}`, fileObjToString(files.files[0]));
        callback(data);
      }else throw new Error("upload failed");
    } catch (error) {
      error_handle(error);
      callback(false);
    }
  })
  function fileObjToString(fileObj){
    const ret = {};
    for(let x in fileObj) ret[x] = fileObj[x];
    return JSON.stringify(ret);
  }
}
function getFileMeta(fileHash, callback){
  srv.read_file_metadata(fileHash, (meta) => {
    //plug the meta data by to localstorage
    try {
      if(meta){
        let files_table = localStorage.getItem(fileTable);
        files_table = JSON.parse(files_table);
        if(!files_table.includes(fileHash)){
          //if file_table not have this record
          files_table.push(fileHash);
        }
        const file_key_name = `${file_list_prefix}-${fileHash}`;
        if(!localStorage.getItem(file_key_name)){
          //if file record not exist
          localStorage.setItem(file_key_name, JSON.stringify(meta));
        }
        callback(meta);
      }
      else{
        throw "get file meta api return false";
      }
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

function getFileDetail(fileHash, history_category = ['metaData']){
  const ret = {};
  if (check_string(fileHash) === false ) return false;
  for(let x of history_category){
    try {
      switch(x){
        case "metaData":
          ret[x] = JSON.parse(localStorage.getItem(`${file_list_prefix}-${fileHash}`));
        break;
        case "comprehension": case "image": case "text":
          ret[x] = getHistory(x, fileHash);
        break;
        case "textToExplanation":
          ret['textToExplanation'] = getHistory('text', fileHash);
        break;
        case "textToImage":
          ret['textToImage'] = getHistory('image', fileHash);
        break;
        case "textToComprehenstion":
          ret['textToComprehenstion'] = getHistory('comprehension', fileHash);
        break;
        default:
          error_handle('not recognize in get file detail:' + x);
      }
    } catch (error) {
      error_handle(error);
      continue;
    }
  }
  return ret;
}

function deleteFile(fileHash){
  localStorage.removeItem(`${file_list_prefix}-${fileHash}`);
  deleteHistory('image', fileHash);
  deleteHistory('text', fileHash);
  deleteHistory('comprehension', fileHash);
}


///wrapped backend api//////////////
const textToImage = (fileHash, question, callback) => {
  if (check_string(fileHash, question) === false ) return false;
  const history = pull_history(fileHash, 'image', question);
  if(history !== false){
    callback(history);
    return;
  } 
  //////////////////////////////
  srv.read_text_to_image(question, (data) => {
    setHistory("image", fileHash, question, {q: question, data :data.image_url});
    callback(data.image_url);
  })
}
const textToExplanation = (fileHash, question, callback) => {
  if (check_string(fileHash, question) === false ) return false;
  const history = pull_history(fileHash, 'text', question);
  if(history !== false){
    callback(history);
    return;
  } 
  //////////////////////////////
  srv.read_text_to_explaination(question, (data)=>{
    setHistory("text", fileHash, question, {q: question, data: data.data});
    callback(data.data);
  })
}
const textToComprehension = (fileHash, question, level = '2', callback) => {
  if (check_string(fileHash, question) === false ) return false;
  const subKeyName = `${question}-${level}`;
  const history = pull_history(fileHash, 'comprehension', subKeyName);
  if(history !== false){
    callback(history);
    return;
  } 
  //////////////////////////////
  srv.question_to_reading_comprehension(fileHash, question, level = '2', (data) => {
    setHistory(
      "comprehension", 
      fileHash, 
      subKeyName, 
      {data: data.choices[0].message.content, level:data.level || level, q: question}
    );
    callback(data.choices[0].message.content);
  })
}
/////////////////////////////////////////////////
const wrapper = {
  getAllFiles, getFileDetail, deleteFile,
  uploadFile, downloadFile, getFileMeta,
  textToComprehension,
  textToExplanation,
  textToImage
}
export default wrapper;
