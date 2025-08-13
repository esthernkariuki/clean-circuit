import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./Sharedcomponents/Sidebar";
import ProductList from "./Products";
import "./App.css";

export default function App() {

  return (

    <Router>
      <div className="app-layout">
        <Sidebar />
         <div className="main-content">
        <ProductList/>
      </div>
      </div>
    </Router>
    
  );
}