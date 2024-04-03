import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style/sidebar.css";
import { MdDashboard } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudentBold } from "react-icons/pi";
import { BsCalendarFill } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { RiLogoutCircleFill } from "react-icons/ri";
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

const Sidebar = ({}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData.access;
  const decoded = jwtDecode(accessToken);
  const username = decoded.username;
  const first_name = decoded.first_name;
  const last_name = decoded.last_name;
  const fullname = first_name + " " + last_name;
  const [loginuserData, setLoginuserData] = useState("");
  const is_student = decoded.is_student;
  const is_teacher = decoded.is_teacher;
  const { t, i18n } = useTranslation();
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
  const [groupName, setGroupName] = useState([])


  useEffect(() =>{
    get_Group_data()
  },[])

  const get_Group_data = async () => {
    try {
      const endpoint = `groups/group_list/`;
      const response = await instance.get(endpoint);
      const groupName = response.data.groups.map(group => group.name); // Extracting group names
      setGroupName(groupName); 
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


  const totalunreadnotify = notify.filter((item) => item.is_read === false)
    .length;

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, isOpen: false });
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
        console.log(error);
    }
}

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

      <nav>
        <div className="user_info_side">
       
          <p> CampusFlow  Welcome, {fullname}!</p>
        </div>
        <div className="quick_acess">
          <li>
            <select
              value={selectedLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </li>

          <li className="last-items">
            <IconButton
              color="inherit"
              className="nofi-icons"
              onClick={handleNotificationClick}
            >
              <Badge
                color="secondary"
                badgeContent={totalunreadnotify}
                sx={{
                  "& .MuiBadge-badge": {
                    color: "white",
                    backgroundColor: "red",
                  },
                }}
                nvisible={!hasUnread}
              >
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
              }}
            >
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

      <div className="sidebar">
        <div className="sidebar-menu">
          <ul>
            <li>
              <Link
                to="/"
                className={currentLocation.pathname === "/" ? "active" : ""}
              >
                <span>
                  <MdDashboard />
                </span>

                <span className="text">Dashboard</span>
              </Link>
            </li>

            {is_teacher && (
              <>
                <li>
                  <Link
                    to="/student"
                    className={
                      currentLocation.pathname.startsWith("/student/") ||
                      currentLocation.pathname === "/student"
                        ? "active"
                        : ""
                    }
                  >
                    <span>
                      <PiStudentBold />
                    </span>
                    <span className="text">Student</span>
                  </Link>
                </li>

                <li>
                  <Link
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
                  >
                    <span>
                      <SiGoogleclassroom />
                    </span>
                    <span className="text">Class</span>
                  </Link>
                </li>
              </>
            )}

            {is_student && (
              <>
                <li>
                  <Link
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
                  >
                    <span>
                      <PiStudentBold />
                    </span>
                    <span className="text">Class</span>
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/calender"
                className={
                  currentLocation.pathname === "/calender" ? "active" : ""
                }
              >
                <span>
                  <BsCalendarFill />
                </span>
                <span className="text">Calender</span>
              </Link>
            </li>

            <li>
              <Link
                to="/notes"
                className={
                  currentLocation.pathname === "/notes"
                    ? "active"
                    : "" || currentLocation.pathname.startsWith("/textediter/")
                    ? "active"
                    : ""
                }
              >
                <span>
                  <SlNote />
                </span>
                <span className="text">Notes</span>
              </Link>
            </li>

            <li>
              <Link
                to="/chat"
                className={
                  currentLocation.pathname.startsWith("/chat") ||
                  currentLocation.pathname === "/chat"
                    ? "active"
                    : ""
                }
              >
                <span>
                  <BsWechat />
                </span>
                <span className="text">Chat</span>
              </Link>
            </li>

            <li>
              <Link
                to="/filemanager"
                className={
                  currentLocation.pathname.startsWith("/folder") ||
                  currentLocation.pathname === "/filemanager"
                    ? "active"
                    : ""
                }
              >
                <span>
                  <AiFillFolderOpen />
                </span>
                <span className="text">File Manager</span>
              </Link>
            </li>

            <li>
              <Link
                to="/learningsection"
                className={
                  currentLocation.pathname.startsWith("/codeediter") ||
                  currentLocation.pathname.startsWith("/video/") ||
                  currentLocation.pathname.startsWith("/article/") ||
                  currentLocation.pathname === "/learningsection"
                    ? "active"
                    : ""
                }
              >
                <span>
                  <MdCastForEducation />
                </span>
                <span className="text">Learn More..</span>
              </Link>
            </li>

            <li>
              <Link
                to="/setting"
                className={
                  currentLocation.pathname === "/setting" ? "active" : ""
                }
              >
                <span>
                  <AiFillSetting />
                </span>
                <span className="text">Setting</span>
              </Link>
            </li>

            <li>
              <a href="" onClick={handleLogout}>
                <span>
                  <RiLogoutCircleFill />
                </span>
                <span className="text">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
