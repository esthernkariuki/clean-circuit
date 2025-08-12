import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./Sharedcomponents/Sidebar";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/matched" replace />} />
            <Route path="/matched" element={<ViewMatched />} />    
          </Routes>
        </div>
      </div>
    </Router>
  );
}
