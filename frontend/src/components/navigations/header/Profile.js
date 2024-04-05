import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar, ListItemIcon } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Replace with appropriate icons
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useTranslation } from 'react-i18next';
import instance from '../../../api/axios';



function ProfileMenu({ loginUserData }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSetting = () => {
    window.location.href = "/setting"
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
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

  const { t } = useTranslation();

  return (
    <div>
      <IconButton className='user-role' onClick={handleClick}>
        <Avatar src={loginUserData.image} alt="" />
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '220px', // Adjust the width as needed
          },
        }}
      >
        <MenuItem onClick={handleSetting}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          {t("header.profile")}
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          {t("header.logout")}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ProfileMenu;
