import React from "react";
import Header from "../navigations/header/header";
import "./mobilemenu.scss";
import { FaHome, FaBook, FaCalendar, FaStickyNote, FaComments, FaCog } from "react-icons/fa";

const MobileMenu = () => {
  return (
    <div className="mobile-menu">
      <div className="mobile-menu-header">
        {/* <Header /> */}
      </div>

      <div className="mobile-menu-content">
        <div className="mobile-menu-item">
          <a href="#">
            <FaHome className="icon" />
            Dashboard
          </a>
        </div>
        <div className="mobile-menu-item">
          <a href="#">
            <FaBook className="icon" />
            Class
          </a>
        </div>
        <div className="mobile-menu-item">
          <a href="#">
            <FaCalendar className="icon" />
            Calendar
          </a>
        </div>
        <div className="mobile-menu-item">
          <a href="#">
            <FaStickyNote className="icon" />
            Notes
          </a>
        </div>
        <div className="mobile-menu-item">
          <a href="#">
            <FaComments className="icon" />
            Chat
          </a>
        </div>
        <div className="mobile-menu-item">
          <a href="#">
            <FaCog className="icon" />
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
