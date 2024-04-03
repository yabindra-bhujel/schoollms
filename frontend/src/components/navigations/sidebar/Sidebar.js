import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../style/sidebar.css";
import { MdDashboard } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudentBold } from "react-icons/pi";
import { BsCalendarFill } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { RiLogoutCircleFill, RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from "react-icons/ri";
import { MdCastForEducation } from "react-icons/md";
import jwtDecode from "jwt-decode";
import instance from "../../../api/axios";
import { BsWechat } from "react-icons/bs";
import { SlNote } from "react-icons/sl";


const Sidebar = ({ toggleSidebar, sidebarWidth}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData.access;
  const decoded = jwtDecode(accessToken);
  const is_student = decoded.is_student;
  const is_teacher = decoded.is_teacher;
  const currentLocation = useLocation();
  

  const handleLogout = async () => {
    try {
      const endpoint = "/logout/";
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.refresh) {
        const response = await instance.post(endpoint, { "refresh": userData.refresh });
        if (response.status === 200) {
          localStorage.removeItem("userData");
          window.location.href = "/login";
        }
      }
    } catch (error) {
    }
  }

  return (
    <div>
        {/* side-bar */}
        <div className="sidebar" style={{ width: sidebarWidth ? "200px" : "70px" }}>
          <div className="sidebar-menu">
            <ul>
              <li>
                <div className="toggleBtn" onClick={toggleSidebar}>
                    {sidebarWidth ? <RiArrowLeftDoubleFill/>: <RiArrowRightDoubleFill/>}
                    <span></span>
                </div>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={currentLocation.pathname === "/" ? "active" : ""}>
                  <div className="menu-items">
                    <span className="icon">
                      <MdDashboard />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Dashboard</span>
                  </div>
                </NavLink>
              </li>

              {is_teacher && (
                <>
                  <li>
                    <NavLink
                      to="/student"
                      className={
                        currentLocation.pathname.startsWith("/student/") ||
                          currentLocation.pathname === "/student"
                          ? "active"
                          : ""
                      }>
                      <div className="menu-items">
                        <span className="icon">
                          <PiStudentBold />
                        </span>
                        <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Student</span>
                      </div>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/class"
                      className={
                        currentLocation.pathname.startsWith("/assignment/") ||
                          currentLocation.pathname.startsWith("/class/") ||
                          currentLocation.pathname.startsWith("/attendance") ||
                          currentLocation.pathname.startsWith("/exam") ||
                          currentLocation.pathname.startsWith("/survey") ||
                          currentLocation.pathname === "/class"
                          ? "active"
                          : ""
                      }
                    > <div className="menu-items">
                        <span>
                          <SiGoogleclassroom />
                        </span>
                        <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Class</span>
                      </div>
                    </NavLink>
                  </li>
                </>
              )}

              {is_student && (
                <>
                  <li>
                    <NavLink
                      to="/studentclass"
                      className={
                        currentLocation.pathname.startsWith("/studentclass/") ||
                          currentLocation.pathname === "/studentclass" ||
                          currentLocation.pathname.startsWith(
                            "/studentclassdetails/"
                          ) ||
                          currentLocation.pathname.startsWith(
                            "/studentassignment/"
                          ) ||
                          currentLocation.pathname.startsWith("/exam/")
                          ? "active"
                          : ""
                      }
                    ><div className="menu-items">
                        <span>
                          <PiStudentBold />
                        </span>
                        <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Class</span>
                      </div>
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/calender"
                  className={
                    currentLocation.pathname === "/calender" ? "active" : ""
                  }
                ><div className="menu-items">
                    <span>
                      <BsCalendarFill />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Calender</span>
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/notes"
                  className={
                    currentLocation.pathname === "/notes"
                      ? "active"
                      : "" || currentLocation.pathname.startsWith("/textediter/")
                        ? "active"
                        : ""
                  }
                ><div className="menu-items">
                    <span>
                      <SlNote />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Notes</span>
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/chat"
                  className={
                    currentLocation.pathname.startsWith("/chat") ||
                      currentLocation.pathname === "/chat"
                      ? "active"
                      : ""
                  }
                ><div className="menu-items">
                    <span>
                      <BsWechat />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Chat</span></div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/learningsection"
                  className={
                    currentLocation.pathname.startsWith("/codeediter") ||
                      currentLocation.pathname.startsWith("/video/") ||
                      currentLocation.pathname.startsWith("/article/") ||
                      currentLocation.pathname === "/learningsection"
                      ? "active"
                      : ""
                  }
                ><div className="menu-items">
                    <span>
                      <MdCastForEducation />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Learn More..</span></div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/setting"
                  className={
                    currentLocation.pathname === "/setting" ? "active" : ""
                  }
                ><div className="menu-items">
                    <span>
                      <AiFillSetting />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Setting</span>
                  </div>
                </NavLink>
              </li>

              <li>
                <a href="" >
                  <div className="menu-items" onClick={handleLogout}>
                    <span>
                      <RiLogoutCircleFill />
                    </span>
                    <span className="text" style={{ display: sidebarWidth ? "block" : "none" }}>Logout</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Sidebar;
