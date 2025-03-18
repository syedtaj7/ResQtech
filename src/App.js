import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Relocation from "./pages/Relocation"; // Fix the import path
import CommunityHelp from "./pages/communityHelp";
import Mitigation from "./pages/Mitigation";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/relocation" element={<Relocation />} />
        <Route path="/community-help" element={<CommunityHelp />} />
        <Route path="/mitigation" element={<Mitigation />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;