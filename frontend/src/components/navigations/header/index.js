import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../style/sidebar.css";
import jwtDecode from "jwt-decode";
import instance from "../../../api/axios";
import { useTranslation } from "react-i18next";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useWebSocket } from "../../../WebSocketContext";
import Notifications from "./Notification";
import Snackbar from "@mui/material/Snackbar";
import ProfileMenu from "./Profile";
import getUserInfo from "../../../api/user/userdata";


function Header() {
  
  const userData = JSON.parse(localStorage.getItem("userData"));
  const accessToken = userData.access;
  const decoded = jwtDecode(accessToken);
  const username = decoded.username;
  const first_name = decoded.first_name;
  const last_name = decoded.last_name;
  const fullname = first_name + " " + last_name;
  const [loginuserData, setLoginuserData] = useState("");
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notify, setNotify] = useState([]);
  const hasUnread = notify.some((item) => !item.is_read);
  const { socket } = useWebSocket();
  const currentLocation = useLocation();
  const [universityName, setuniversityName] = useState("");
  const is_student = decoded.is_student;
  const is_teacher = decoded.is_teacher;

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
const [sidebarWidth, setSidebarWidth] = useState(() => {
  const storedWidth = localStorage.getItem('sidebarWidth');
  try {
    return storedWidth !== null ? JSON.parse(storedWidth) : true;
  } catch (error) {
    console.error('Error parsing storedWidth:', error);
    return true; // Use a default value or handle the error accordingly
  }
});

const toggleSidebar = () => {
  setSidebarWidth((prevWidth) => {
    const newWidth = !prevWidth;
    localStorage.setItem('sidebarWidth', JSON.stringify(newWidth));
    return newWidth;
  });
};

useEffect(() => {
  get_Group_data();
}, []);


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
  }, [socket, sidebarWidth]);

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
    getUniveristyName();
    getLoginUserData();
  }, []);

  const getLoginUserData = async () => {
    try {
      const endpoint = `/get_user_profile_pic/${username}/`;
      const response = await instance.get(endpoint);
      setLoginuserData(response.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getUniveristyName = async () => {
    try {
      const endpoint = "/get_university_login_screen_info";
      const response = await instance.get(endpoint);
      setuniversityName(response.data);
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
        <nav>
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

    </div>
    </div>
  );
};

export default Header;