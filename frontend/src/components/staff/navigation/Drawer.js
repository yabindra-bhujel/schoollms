import React, { useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "./style/sidebar.css";
import { GiTeacher } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { RiCalendarTodoLine } from "react-icons/ri";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar } from '@mui/material';




const AdminSideBar = () =>{
    const location = useLocation();
    const [passwordChange, setPasswordChange] = useState(false);
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");


    const handlePasswordChange = () => {
        setPasswordChange(true);
    }

    const handlePasswordChangeClose = () => {

        setPasswordChange(false);
    }

    const handlePasswordChangeSubmit = async () => {
        if (password.newPassword !== password.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }
        // const response = await ChangePassword("admin", password);
        // console.log(response);
        // if (response.status === 200) {
        //     setSnackbar(true);
        //     setSnackbarMessage("Password Changed Successfully");
        //     setPasswordChange(false);
        // }
    }

    const handlePasswordChangeCancel = () => {
        setPasswordChange(false);
    }


    const handleChange = (event) => {
        setPassword({
            ...password,
            [event.target.name]: event.target.value
        });
    }


    

    return(
        <div>
            <Dialog
                open={passwordChange}
                onClose={handlePasswordChangeClose}
            >

                <DialogTitle>
                    Change Password
                </DialogTitle>

                <DialogContent>
                    <div className="password-change-form">
                        <div className="password-change-input">
                            <label>Old Password</label>
                            <input

                                type="password"
                                name="oldPassword"
                                value={password.oldPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="password-change-input">
                            <label>New Password</label>
                            <input

                                type="password"
                                name="newPassword"
                                value={password.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="password-change-input">
                            <label>Confirm Password</label>
                            <input

                                type="password"
                                name="confirmPassword"
                                value={password.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </DialogContent>


                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePasswordChangeSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"

                        onClick={handlePasswordChangeCancel}
                    >

                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>




          <div className="admin-nav-bar">
            <h1>
            LMS administration
            </h1>

            <div className="nav-bar-menu">
              <div className="welcome">
                <p>Welcome Admin</p>
              </div>

              <div className="chnage-password">
                <p
                  onClick={handlePasswordChange}
                >Change Password</p>
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

                <li>
                  <Link to="/admin/department"

                    className={
                      location.pathname === "/admin/department" ||
                      location.pathname === "/admin/department/add" ||
                      location.pathname === "/admin/department/edit"? "active" : ""
                    }
                  >
                    <FaBookOpen size={20} />
                    <span>Department</span>

                  </Link>
                </li>


                <li>
                  <Link to="/admin/course"
                    className={
                      location.pathname === "/admin/course" ||
                      location.pathname === "/admin/course/add" ||
                      location.pathname === "/admin/course/edit"? "active" : ""
                    }
                  >
                  <SiGoogleclassroom size={20} />

                    <span>Course</span>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/otp">
                  <RiCalendarTodoLine size={20} />

                    <span>
                      Enroll Student
                    </span>
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