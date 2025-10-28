import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BootstrapPage from "./pages/BootstrapPage";
import TailwindPage from "./pages/TailwindPage";
import RawgStore from "./pages/RawgStore";

export default function App() {
  return (
    <Router>
      <nav className="p-3 bg-light d-flex justify-content-around">
        <Link to="/">Bootstrap</Link>
        <Link to="/tailwind">Tailwind</Link>
        <Link to="/store">Boutique</Link>
      </nav>
      <Routes>
        <Route path="/" element={<BootstrapPage />} />
        <Route path="/tailwind" element={<TailwindPage />} />
        <Route path="/store" element={<RawgStore />} />
      </Routes>
    </Router>
  );
}