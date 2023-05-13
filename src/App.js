import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import Navigation from "./components/Navigation";
import ReadingAssistance from "./pages/ReadingAssistance";

// import srv from './fetch_';

const existingBooks = JSON.parse(localStorage.getItem("books")) || [];

//format book data
const declareBooks = (metadata, data) => {
  localStorage.setItem(
    "books",
    JSON.stringify([
      { bookID: metadata.file_hash, book_data: metadata, results: data.result },
    ])
  );
  localStorage.getItem("books");
}

//upload book 
 const upload = (metadata, data) => {
  existingBooks.push({
    bookID: metadata.file_hash,
    book_data: metadata,
    results: data.result,
  });
  localStorage.setItem("books", JSON.stringify(existingBooks));
}

//by id
const getBookById = (id, metadata) => {
  const existingBook = JSON.parse(localStorage.getItem("books")) || []; 

  if (!existingBook) {
    return null;
  }
  const book = existingBook.find((b) => b.bookID === metadata.file_hash);
  if (!book) {
    return null;
  }
  console.log(book.bookID, book);
  return book;
};
 

  srv.read_text_to_explanation((question, data) => {

    //retrieve existing hash table or empty {}
    const storedData = JSON.parse(localStorage.getItem("hash")) || {};

    //assign a new key/pair to the object
   
        Object.assign(storedData, {asked: question}, {textR:data})

    //store the updated object back to local storage
    localStorage.setItem("hash",JSON.stringify(storedData));
   console.log(storedData)
    
  })


export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Navigation />} />
            <Route path="/assistance" element={<ReadingAssistance />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
