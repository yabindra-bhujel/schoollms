import React, { useState, useEffect, useRef } from "react";
import "./style/profile.css";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {
  getUserProfile,
  uploadImage,
  getUserProfileInfo,
} from "./SettingService";
import getUserInfo from "../../api/user/userdata";
import { Snackbar } from "@mui/material";
import UserInfo from "./UserInfo";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const [image, setImage] = useState("");
  const imageRef = useRef(null);
  const [profile, setProfile] = useState({});
  const [userData, setUserData] = useState({});
  const isTeacher = getUserInfo().isTeacher;
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      setImage(file);
      if (file) {
        handleImageUpload(file);
      }
    }
  };
  const imgUpdated = t("messages.imgUpdated");
  const imgUpdateErr = t("messages.imgUpdateErr");
  const err = t("messages.err");

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    uploadImage(formData)
      .then((response) => {
        imageRef.current.value = null;
        setImage("");
        setMessage(imgUpdated);
        setSnackbarOpen(true);
        fetchData();
      })
      .catch((error) => {
        setMessage(imgUpdateErr);
        setSnackbarOpen(true);
      });
  };

  const fetchData = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (error) {
      setMessage(err);
      setSnackbarOpen(true);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserProfileInfo();
      setUserData(response.data);
    } catch (error) {
      setMessage(err);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserInfo();
  }, []);

  return (
    <>
      <Snackbar
        open={snackbaropen}
        onClose={handleClose}
        message={message}
        autoHideDuration={6000}
      />
      <div className="setting-profile">
        <div className="profile-header"></div>

        <div className="profile-image-name">
          <div className="profile-image">
            <button
              onClick={() => imageRef.current && imageRef.current.click()}
            >
              <label htmlFor="profile-image">
                <input
                  ref={imageRef}
                  onChange={handleImageChange}
                  type="file"
                  id="profile-image"
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </label>
              <Avatar
                alt="プロフィール画像"
                src={image || profile.image}
                sx={{ width: 80, height: 80 }}
              />
            </button>
          </div>

          <div className="profile-details">
            <Typography variant="h5">{profile.username} </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>
                {profile.first_name} {profile.last_name}
              </strong>
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "red", fontWeight: "bold" }}
            >
              <small>{t("settings.imgInfo")}</small>
            </Typography>
          </div>
        </div>

        <div className="userinfofrom">
          <UserInfo
            userData={userData}
            isTeacher={isTeacher}
            setUserData={setUserData}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
