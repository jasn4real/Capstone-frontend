import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import Navigation from "./components/Navigation";

import srv from './fetch_';


// const upload_ = (metadata)=>{
//   let books = localStorage.getItem("books");
//   books = books.push(metadata);
//   localStorage.setItem("books", books);
// }

// ()=>{
//   localStorage.setItem("books",[
//     {bookID: "book-{filehash}"},
//     {bookID: "book-{filehash}"}
//   ]);
// }

// ()=>{
//   const books = localStorage.getItem("books");
//   const book = localStorage.getItem(`book-${books[0].bookID}`);

// }

// srv.read_text_to_image("a bottle of water", (question, data)=>{

//   localStorage.setItem("book-{filehash}",{
//     image_histroy:[
//       {question: question, result: data }
//     ],
//     text_histroy:[

//     ],
//   });

// });
// ()=>{
//   localStorage.getItem("book-{filehash}");//{question: question, result: data }
// }


import ReadingAssistance from "./pages/ReadingAssistance";


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
