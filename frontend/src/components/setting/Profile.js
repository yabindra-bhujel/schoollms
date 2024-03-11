import React, { useState, useEffect, useRef } from "react";
import "./style/profile.css";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { getUserProfile, uploadImage, getUserProfileInfo } from "./SettingService";
import getUserInfo from "../../api/user/userdata";
import { Snackbar } from "@mui/material";
import UserInfoForm from "./UserInfoForm";

const Profile = () => {
  const [image, setImage] = useState("");
  const imageRef = useRef(null);
  const [profile, setProfile] = useState({});
  const [userData, setUserData] = useState({});
  const username = getUserInfo().username;
  const isTeacher = getUserInfo().isTeacher;
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");


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

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    uploadImage(formData)
      .then((response) => {
        imageRef.current.value = null;
        setImage("");
        setMessage("画像を正常にアップロードしました");
        setSnackbarOpen(true);
        fetchData();

      })
      .catch((error) => {
        setMessage("画像のアップロード中に問題が発生しました");
        setSnackbarOpen(true);
      });
  };

  const fetchData = async () => {
    try {
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (error) {
      setMessage("何か問題が発生しました");
      setSnackbarOpen(true);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserProfileInfo();
      setUserData(response.data);
    } catch (error) {
      setMessage("何か問題が発生しました");
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
        <div className="profile-header">
          <Typography variant="h4">個人情報</Typography>
        </div>

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

            <Typography variant="body2" style={{ color: 'red', fontWeight: 'bold' }}>
              <small>
                PNG、JPG、JPEGの画像形式がサポート（10MB未満）。
              </small>
            </Typography>
          </div>
        </div>

        <div className="userinfofrom">
          <UserInfoForm userData={userData} isTeacher={isTeacher} setUserData={setUserData} />
        </div>
      </div>
    </>
  );
};

export default Profile;
