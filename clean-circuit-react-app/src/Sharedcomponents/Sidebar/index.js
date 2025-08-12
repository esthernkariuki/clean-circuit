import React, { useState } from "react";
import { FaHome, FaList, FaShoppingCart, FaTags } from "react-icons/fa";
import "./style.css";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <button className="hamburger-btn" aria-label="Toggle Sidebar" onClick={toggleSidebar} > &#9776;</button>
      <div className={`dashboard-container`}>
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-logo-row">
            <img src="images/logo.png" alt="RenewIt Logo" className="sidebar-logo" />
            <span className="sidebar-title">
              <span style={{ fontWeight: 700, fontStyle: "italic" }}>
                RenewIt
              </span>
            </span>
          </div>
          <nav>
            <ul>
              <li className="active">
                <FaHome /> Home</li>
              <li><FaList />My Request</li>
              <li> <FaTags /> Browse Offers </li>
              <li><FaShoppingCart /> My product </li>
            </ul>
          </nav>
        </aside>
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} data-testid="sidebar-overlay"></div>}
    </>
  );
}

export const ProfileIcon = () => (
  <div className="profile-icon">
    <i className="fas fa-user"></i>
  </div>
);
