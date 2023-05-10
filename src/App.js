import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import Navigation from "./components/Navigation";

import srv from './fetch_';


srv.read_text_to_image("a bottle of water", (question, data)=>{
  localStorage.setItem("hash",{question: question, result: data });
});
()=>{
  localStorage.getItem("hash");//{question: question, result: data }
}


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
