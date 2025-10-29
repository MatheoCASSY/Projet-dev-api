import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GameDetail from "./pages/GameDetail";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/store" element={<Home />} />
        <Route path="/game/:id" element={<GameDetail />} />
      </Routes>
    </Router>
  );
}