import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import Navigation from "./components/Navigation";

import RecentsContainer from "./components/RecentsContainer";

import AllInOneFramework from "./pages/all-in-one-framework";
import ReadingAssistance from "./pages/ReadingAssistance";
import ReadingComprehension from "./pages/ReadingComprehension";
import TestOnly from "./pages/test-only";


// import srv from './fetch_';


export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <RecentsContainer />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Navigation />} />
            <Route path="/assistance" element={<ReadingAssistance />} />
            <Route path="/comprehension" element={<ReadingComprehension />} />
            <Route path="/framework-testing" element={<AllInOneFramework />} />
            <Route path="/testing_fetch" element={<TestOnly />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
