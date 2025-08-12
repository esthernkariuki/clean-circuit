import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Sidebar } from "./Sharedcomponents/Sidebar";
import ViewMatched from "./ViewMatched";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/matched" element={<ViewMatched />} />    
          </Routes>
        </div>
      </div>
    </Router>
  );
}
