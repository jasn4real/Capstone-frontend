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


  srv.read_text_to_image("a bottole of water", (question, data) => {

  //set key of "hash" to local storage
  //stringigy the second argument to store the data object as string into local storage.
    localStorage.setItem("hash", JSON.stringify({question:question, result: data }));

     //JSON.parse is used to retrieve the data object from local storage to access.
     const storage_object = JSON.parse(localStorage.getItem("hash"))
     console.log(storage_object)
  })


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
