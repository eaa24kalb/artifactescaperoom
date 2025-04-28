import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScreen from "./pages/StartScreen";
import Room1 from "./pages/Room1";
import Room2 from "./pages/Room2";

function App() {
  return (
    <Router basename="/artifactescaperoom">
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/room1" element={<Room1 />} />
        <Route path="/room2" element={<Room2 />} />
      </Routes>
    </Router>
  );
}

export default App;
