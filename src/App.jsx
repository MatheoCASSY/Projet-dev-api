import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RawgStore from "./pages/RawgStore";
import GameDetail from "./pages/GameDetail";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Home />} />
        <Route path="/store" element={<RawgStore />} />
        <Route path="/game/:id" element={<GameDetail />} />
      </Routes>
    </Router>
  );
}