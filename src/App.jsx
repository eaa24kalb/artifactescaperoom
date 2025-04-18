import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScreen from "./pages/StartScreen";
import Room1 from "./pages/Room1";

function App() {
  return (
    <Router basename="/artifactescaperoom">
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/room1" element={<Room1 />} />
      </Routes>
    </Router>
  );
}

export default App;
