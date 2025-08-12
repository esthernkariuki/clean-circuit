import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./Sharedcomponents/Sidebar";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
      </div>
    </Router>
  );
}
