import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Weather from "./Weather";
import Forecast from "./Forecast";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";




function App() {
  return (
    <div className="app-container h-100 w-100">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/forecast" element={<Forecast />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;