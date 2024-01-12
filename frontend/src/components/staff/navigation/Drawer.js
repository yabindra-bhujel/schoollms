import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./style/sidebar.css";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";


const AdminSideBar = () =>{
    const location = useLocation();

    

    return(
        <div>
          <div className="admin-nav-bar">
            <h1>
            LMS administration
            </h1>

            <div className="nav-bar-menu">
              <div className="welcome">
                <p>Welcome Admin</p>
              </div>

              <div className="chnage-password">
                <p>Change Password</p>
              </div>

              <div className="logout">
                <IoMdLogOut  size={30}/>
              </div>



            </div>
          </div>
          <div className="admin-sidebar">
            <div className="menu-item">
              <ul>
                <li>
                  <Link to="/admin/student"
                    className={
                      location.pathname === "/admin/student" ||
                      location.pathname === "/admin/student/add" ||
                      location.pathname === "/admin/student/edit"? "active" : ""
                    }
                  >
                  <PiStudentFill size={20} />
                    <span>Student</span>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/teacher"
                    className={
                      location.pathname === "/admin/teacher" ||
                      location.pathname === "/admin/teacher/add" ||
                      location.pathname === "/admin/teacher/edit"? "active" : ""
                    }
                  >
                    <GiTeacher size={20} />
                    <span>Teacher</span>

                  </Link>
                </li>


                <li>
                  <Link to="/admin/user"
                    className={
                      location.pathname === "/admin/user" ||
                      location.pathname === "/admin/user/add" ||
                      location.pathname === "/admin/user/edit"? "active" : ""
                    }
                  >
                  <FaRegUserCircle size={20} />
                    <span>User</span>
                  </Link>
                </li>

                <hr/>


                <li>
                  <Link to="">
                  <RiLogoutCircleLine size={20} />
                    <span>Logout</span>
                  </Link>
                </li>


              </ul>
            </div>
          </div>
            
        </div>
    )
}

export default AdminSideBar;