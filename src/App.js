import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import About from "./pages/About";
import Navigation from "./components/Navigation";
import RecentsContainer from "./components/RecentsContainer";

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
          </Routes>
        </main>
      </Router>
    </div>
  );
}
