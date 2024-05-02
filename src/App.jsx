import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./routes/Home";
import Profile from "./routes/Profile";

function App() {
  return (
    <div className="bg-slate-800">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
