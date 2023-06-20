import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import About from "./pages/About";
import Navigation from "./components/Navigation";
// import UserGuide from "./components/UserGuide";
// import Welcome from "./components/Welcome";

// import RecentsContainer from "./components/RecentsContainer";
import "./pages/fw-v0.02-sub/reading-assistance-page-h.css";
import "./pages/all-in-one-framework.css"
// import AllInOneFramework from "./pages/all-in-one-framework";
import Welcome from "./pages/fw-v0.02";
// import ReadingAssistance from "./pages/ReadingAssistance";
// import ReadingComprehension from "./pages/ReadingComprehension";
import TestOnly from "./pages/test-only";
import NavBar from "./components/NavBar";


// import srv from './fetch_';

export default function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <main>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/welcome" element={<Welcome />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Navigation />} />
            {/* <Route path="/assistance" element={<ReadingAssistance />} /> */}
            {/* <Route path="/comprehension" element={<ReadingComprehension />} /> */}
            {/* <Route path="/framework-testing" element={<AllInOneFramework />} /> */}
            <Route path="/" element={<Welcome />} />
            <Route path="/testing_fetch" element={<TestOnly />} />
            {/* <Route path="/userwalkthrough" element={<UserGuide />} /> */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}
