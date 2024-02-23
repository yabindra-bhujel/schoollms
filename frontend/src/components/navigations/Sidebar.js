import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./style/sidebar.css";
import { MdDashboard } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudentBold } from "react-icons/pi";
import { BsCalendarFill } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { RiLogoutCircleFill, RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from "react-icons/ri";
import { FaFolder } from "react-icons/fa";
import { MdCastForEducation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiFillFolderOpen } from "react-icons/ai";
import jwtDecode from "jwt-decode";
import instance from "../../api/axios";
import { BsWechat } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { SlNote } from "react-icons/sl";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useWebSocket } from "../../WebSocketContext";
import Notifications from "./Notification";
import Snackbar from "@mui/material/Snackbar";
import ProfileMenu from "./Profile";
import getUserInfo from "../../api/user/userdata";

const Sidebar = ( ) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData.access;
  const decoded = jwtDecode(accessToken);
  const username = decoded.username;
  const first_name = decoded.first_name;
  const last_name = decoded.last_name;
  const fullname = first_name + " " + last_name;
  const [universityName, setuniversityName] = useState("");
  const [loginuserData, setLoginuserData] = useState("");
  const is_student = decoded.is_student;
  const is_teacher = decoded.is_teacher;
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notify, setNotify] = useState([]);
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const hasUnread = notify.some((item) => !item.is_read);
  const { socket } = useWebSocket();
  const [snackbarState, setSnackbarState] = useState({
    isOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });
  const { vertical, horizontal, isOpen, message } = snackbarState;
  const userId = getUserInfo().username;
  const [groupName, setGroupName] = useState(false);

    // set sidebar width (70px or 200)
    const [showSidebar, setshowSidebar] = useState(() => {
      const storedState = localStorage.getItem('showSidebar');
      return storedState !== null ? JSON.parse(storedState) : false;
    });
    const toggleSidebar = () => {
      setshowSidebar(!showSidebar);
    };
  
    useEffect(() => {
      get_Group_data();
      localStorage.setItem('showSidebar', JSON.stringify(showSidebar));
    }, [showSidebar]);

  const get_Group_data = async () => {
    try {
      const endpoint = `/realtimeapi/get_group_list/${userId}`;
      const response = await instance.get(endpoint);
      const groupName = response.data.groups.map(group => group.name); // Extracting group names
      setGroupName(groupName); // Setting the groupName state
    } catch (e) {
      console.log("error");
    }
  };


  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.emit("addNewuser", { userId });


        if (groupName.length > 0) {
          socket.emit("join-group", { groupName, userId });
        }
      });

      socket.on("receive-notification", (data) => {
        setSnackbarState({
          isOpen: true,
          vertical: "bottom",
          horizontal: "right",
          message: data.title || "You have a new notification!",
        });

        setNotify((prev) => [data, ...prev]);
      });

    }
  }, [socket]);

  useEffect(() => {
    getNotificationDataFromServer();
  }, []);

  const totalunreadnotify = notify.filter((item) => item.is_read === false)
    .length;

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, isOpen: false });
  };

  const getNotificationDataFromServer = async () => {
    try {
      const endpoint = `/notification/get_notification_by_user/${username}/`;
      const response = await instance.get(endpoint);
      setNotify(response.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleUpdate = async () => {
    try {
      const endpoint = `/notification/update_notification/${username}/`;
      const response = await instance.put(endpoint);
      if (response.status === 200) {
        getNotificationDataFromServer();
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  // Function to handle language change
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    handleUpdate();
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;



  const handleLogout = async () => {
    try {
      const endpoint = "api/logout/";
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.refresh) {
        const response = await instance.post(endpoint, { "refresh": userData.refresh });
        if (response.status === 200) {
          localStorage.removeItem("userData");
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLoginUserData();
  }, []);

  const getLoginUserData = async () => {
    try {
      const endpoint = `get_user_profile`;
      const response = await instance.get(endpoint);
      setLoginuserData(response.data);
    } catch (e) {
      console.log("error", e);
    }
  };



  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isOpen}
        onClose={handleCloseSnackbar}
        message={message}
        key={vertical + horizontal}
        autoHideDuration={6000}
      />

      {/* header bar */}
      <div className="set-nav">
        <nav style={{
          width: showSidebar ? "calc(100% - 200px)" : "calc(100% - 70px)",
          left: showSidebar ? "200px" : "70px"
        }}>
          <div className="user_info_side">

            <p> CampusFlow  Welcome, {fullname}!</p>
          </div>
          <div className="quick_acess">
            <li>
              <select
                value={selectedLanguage}
                onChange={(e) => changeLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ja">Japanese</option>
              </select>
            </li>

            <li className="last-items">
              <IconButton
                color="inherit"
                className="nofi-icons"
                onClick={handleNotificationClick}>
                <Badge
                  color="secondary"
                  badgeContent={totalunreadnotify}
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "white",
                      backgroundColor: "red",
                    },
                  }}
                  nvisible={!hasUnread}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}>

                <Box p={2}>
                  <Typography variant="h6" color="inherit">
                    Notifications
                  </Typography>
                  <Notifications notifications={notify} />
                </Box>
              </Popover>
            </li>

            <div className="profile">
              {/* <img src={loginuserData.image} alt="" /> */}
              <ProfileMenu loginUserData={loginuserData} />
            </div>
          </div>
        </nav>


        {/* side-bar */}
        <div className="sidebar" style={{ width: showSidebar ? "200px" : "70px" }}>
          <div className="sidebar-menu">
            <ul>
              <li>
                <div className="toggleBtn" onClick={toggleSidebar}>
                    {showSidebar ? <RiArrowLeftDoubleFill/>: <RiArrowRightDoubleFill />}
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
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Dashboard</span>
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
                        <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Student</span>
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
                        <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Class</span>
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
                        <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Class</span>
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
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Calender</span>
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
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Notes</span>
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
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Chat</span></div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/filemanager"
                  className={
                    currentLocation.pathname.startsWith("/folder") ||
                      currentLocation.pathname === "/filemanager"
                      ? "active"
                      : ""
                  }
                ><div className="menu-items">
                    <span>
                      <AiFillFolderOpen />
                    </span>
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>File Manager</span></div>
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
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Learn More..</span></div>
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
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Setting</span>
                  </div>
                </NavLink>
              </li>

              <li>
                <a href="" onClick={handleLogout}>
                  <div className="menu-items">
                    <span>
                      <RiLogoutCircleFill />
                    </span>
                    <span className="text" style={{ display: showSidebar ? "block" : "none" }}>Logout</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
