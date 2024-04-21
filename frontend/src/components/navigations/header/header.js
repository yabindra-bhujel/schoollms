import React, { useEffect, useState } from "react";
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
    return true; 
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
    getNotification();
  }, []);

  const totalunreadnotify = notify.filter((item) => item.is_read === false)
    .length;

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, isOpen: false });
  };

  const getNotification = async () => {
    try {
      const endpoint = `/notifications/notification_by_user/`;
      const response = await instance.get(endpoint);
      setNotify(response.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleUpdate = async () => {
    try {
      const endpoint = `notifications/read/`;
      const response = await instance.put(endpoint);
      if (response.status === 200) {
        getNotification();
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

  useEffect(() => {
    getLoginUserData();
  }, []);

  const getLoginUserData = async () => {
    try {
      const endpoint = `users/profile/`;
      const response = await instance.get(endpoint);
      setLoginuserData(response.data);
    } catch (e) {
    }
  };
  const { t } = useTranslation();



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

            <p> CampusFlow  {t("header.welcome")}, {fullname}!</p>
          </div>
          <div className="quick_acess">
            <li>
              <select
                value={selectedLanguage}
                onChange={(e) => changeLanguage(e.target.value)}>
                <option value="en">{t("English")}</option>
                <option value="ja">{t("Japanese")}</option>
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
                    {t("notices")}
                  </Typography>
                  <Notifications notifications={notify} />
                </Box>
              </Popover>
            </li>

            <div className="profile">
              <ProfileMenu loginUserData={loginuserData} />
            </div>
          </div>
        </nav>

    </div>
    </div>
  );
};

export default Header;