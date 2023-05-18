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
//////////////////////////////////////////////////
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
          files_table.push(data.fileHash);
          localStorage.setItem(fileTable, JSON.stringify(files_table));
        } catch (error) {
          console.log(error);
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
    for(let x in fileObj){ ret[x] = fileObj[x] }
    return JSON.stringify(ret);
  }
}
function getFileMeta(fileHash, callback){
  srv.read_file_metadata(fileHash, (meta) => {
    //plug the meta data by to localstorage
    try {
      if(meta){
        let files_table = localStorage.getItem(fileTable);
        files_table = JSON.parse[files_table];
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

// function checkFile(fileHash){
//   try {
//     const files = getAllFiles();
//     return files.includes(fileHash);
//   } catch (error) {
//     error_handle(error);
//     return false;
//   }
// }
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
function setHistory(category, fileHash, q, data){
  const keyName = check_key_name(category, fileHash);
  if(!keyName) return false;
  try {
    let history = JSON.parse(localStorage.getItem(keyName));
    history[q] = {q, data, timestamp: new Date()}
    localStorage.setItem(keyName, JSON.stringify(history));
  } catch (error) {
    localStorage.setItem(keyName, JSON.stringify({[q]: {q, data, timestamp: new Date()}}));
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
///wrapped backend api//////////////
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
const textToImage = (fileHash, question, callback) => {
  if (check_string(fileHash, question) === false ) return false;
  const history = pull_history(fileHash, 'image', question);
  if(history !== false){
    callback(history);
    return;
  } 
  //////////////////////////////
  srv.read_text_to_image(question, (data) => {
    setHistory("image", fileHash, question, data.image_url);
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
    setHistory("text", fileHash, question, data.data);
    callback(data.data);
  })
}
const textToComprehension = (fileHash, question, level = '2', callback) => {
  if (check_string(fileHash, question) === false ) return false;
  const history = pull_history(fileHash, 'comprehension', `${question}-${level}`);
  if(history !== false){
    callback(history);
    return;
  } 
  //////////////////////////////
  srv.question_to_reading_comprehension(fileHash, question, level = '2', (data) => {
    setHistory("comprehension", fileHash, `${question}-${level}`, data.choices[0].message.content);
    callback(data.choices[0].message.content);
  })
}
const wrapper = {
  getAllFiles, getFileDetail, deleteFile,
  uploadFile, downloadFile, getFileMeta,
  textToComprehension,
  textToExplanation,
  textToImage
}
export default wrapper;

//////////////////////////////////////
// const existingBooks = JSON.parse(localStorage.getItem("books")) || [];

// //format book data
// const declareBooks = (metadata, data) => {
//   localStorage.setItem(
//     "books",
//     JSON.stringify([
//       { bookID: metadata.file_hash, book_data: metadata, results: data.result },
//     ])
//   );
//   localStorage.getItem("books");
// }

// //upload book 
// const upload = (metadata, data) => {
//   existingBooks.push({
//     bookID: metadata.file_hash,
//     book_data: metadata,
//     results: data.result,
//   });
//   localStorage.setItem("books", JSON.stringify(existingBooks));
// }

// //by id
// const getBookById = (id, metadata) => {
//   const existingBook = JSON.parse(localStorage.getItem("books")) || []; 

//   if (!existingBook) {
//     return null;
//   }
//   const book = existingBook.find((b) => b.bookID === metadata.file_hash);
//   if (!book) {
//     return null;
//   }
//   console.log(book.bookID, book);
//   return book;
// };
//    //set text to image
// const text_to_image = (bookID, question, data) => {
//   const book = getBookById(bookID);
//   if (!book) {
//     console.log(`Book with ID '${bookID}' not found in localStorage`);
//     return;
//   }
//   const books = JSON.parse(localStorage.getItem("books")) || [];
//   const updatedBooks = books.map((b) => {
//     if (b.bookID === bookID) {
//       return {...b, textImageHistory:[{questions: question, image_history: data.image_history, text_history: data.text_history}]}
//     } else {
//       return b;
//     }
//   });
//   localStorage.setItem("books", JSON.stringify(updatedBooks));
// }


// const text_comprehension = (bookID, question, data) => {
//   const book = getBookById(bookID);
//   if (!book) {
//     console.log(`Book with ID '${bookID}' not found in localStorage`);
//     return;
//   }
//   const books = JSON.parse(localStorage.getItem("books")) || [];
//   const updatedBooks = books.map((b) => {
//     if(b.bookID === data.file_hash) {
//       return {...b, textResponse:[{asked: question, textResponse: response}]}
//     }else {
//       return b
//     }
//   });
//   localStorage.setItem("books", JSON.stringify(updatedBooks))
// }
