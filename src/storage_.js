import srv from './fetch_';
const [ fileTable, file_list_prefix ] = [ "files", "filehash" ];
function error_handle(error) {
  console.log(error);
}
function check_string(){
  for(let item of arguments) if(typeof item !== 'string'){
    console.log(item, ' not string');
    return false;
  }
  return true;
}
//////////////////////////////////////////////////
function uploadFile(files, callback){
  srv.upload_file(files, (data)=>{
    try {
      if(data.fileHash.length === 64) {
        let files_table = localStorage.getItem(fileTable);
        try {
          files_table = JSON.parse[files_table];
          files_table.push(data.fileHash);
          localStorage.setItem(fileTable, JSON.stringify(files_table));
        } catch (error) {
          localStorage.setItem(fileTable, JSON.stringify([data.fileHash]));
        }
        localStorage.setItem(`${file_list_prefix}-${data.fileHash}`, JSON.stringify(files.files[0]));
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

function deleteFile(fileHash){
  localStorage.removeItem(`${file_list_prefix}-${fileHash}`);
  deleteHistory('image', fileHash);
  deleteHistory('text', fileHash);
  deleteHistory('comprehension', fileHash);
}

function checkFile(fileHash){
  try {
    const files = getAllFiles();
    return files.includes(fileHash);
  } catch (error) {
    error_handle(error);
    return false;
  }
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

///export fuunction//////////////
const textToImage = (fileHash, question, callback)=>{
  if (check_string(fileHash, question) === false ) return false;
  const history = readImageHistory(fileHash);
  if(history[question]){
    callback(history[question].data);
    return;
  } 
  srv.read_text_to_image(question, (data)=>{
    setHistory("image", fileHash, question, data.image_url);
    callback(data.image_url);
  })
}
const readImageHistory = (fileHash)=>{
  if (check_string(fileHash) === false ) return false;
  return getHistory("image", fileHash);
}

const textToExplanation = (fileHash, question, callback)=>{
  if (check_string(fileHash, question) === false ) return false;
  const history = readTextHistory(fileHash);
  if(history[question]){
    callback(history[question].data);
    return;
  } 
  srv.read_text_to_explaination(question, (data)=>{
    setHistory("text", fileHash, question, data.data);
    callback(data.data);
  })
}
const readTextHistory = (fileHash)=>{
  if (check_string(fileHash) === false ) return false;
  return getHistory("text", fileHash);
}

const textToComprehension = (fileHash, question, callback)=>{
  if (check_string(fileHash, question) === false ) return false;
  const history = readComprehensionHistory(fileHash);
  if(history[question]){
    callback(history[question].data);
    return;
  } 
  srv.question_to_reading_comprehension(fileHash, question, (data)=>{
    setHistory("comprehension", fileHash, question, data.choices[0].message.content);
    callback(data.choices[0].message.content);
  })
}
const readComprehensionHistory = (fileHash)=>{
  if (check_string(fileHash) === false ) return false;
  return getHistory("comprehension", fileHash);
}
export default {
  uploadFile, getAllFiles, getFile,
  textToComprehension, readComprehensionHistory,
  textToExplanation, readTextHistory,
  textToImage, readImageHistory
}

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
