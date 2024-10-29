import React, { useState, useEffect } from "react";
import {
  Snackbar,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./style/password.css";
import HttpsIcon from "@mui/icons-material/Https";
import {
  chnagePassword,
  handleLogout,
  updateEmailNotification,
  checkEmailNotification,
} from "./SettingService";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";

const UserManagement = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] =
    useState(false);

  const fatchData = async () => {
    try {
      const emailNotificationResponse = await checkEmailNotification();
      setIsEmailNotificationEnabled(emailNotificationResponse.data);
    } catch (error) {
      setMessage(
        "Something went wrong while fetching email notification status."
      );
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fatchData();
  }, []);

  const handleEmailToggleChange = async () => {
    setIsEmailNotificationEnabled((prevValue) => !prevValue);

    const data = {
      emai_notification: !setIsEmailNotificationEnabled,
    };
    try {
      const response = await updateEmailNotification(data);
      if (response.status === 200) {
        setMessage("Updated Email Notification Successfully");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setMessage("Something went wrong while updating email notification.");
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleFormSubmit = (e) => {
    setErrors({});

    if (oldPassword === "") {
      setErrors({ oldPassword: "必須" });
      return;
    }

    if (newPassword === "") {
      setErrors({ newPassword: "必須" });
      return;
    }

    if (confirmPassword === "") {
      setErrors({ confirmPassword: "必須" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({
        confirmPassword:
          "パスワードは新しいパスワードと同じであることを確認してください",
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrors({ newPassword: "Password must meet the specified criteria." });
      return;
    }

    e.preventDefault();
    const data = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    chnagePassword(data)
      .then((response) => {
        setMessage("Password Updated Successfully");
        setSnackbarOpen(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          handleLogout();
        }, 10000);
      })
      .catch((error) => {
        setMessage(
          "Something went wrong while updating password. Please try again later or contact to service provider."
        );
        setSnackbarOpen(true);
      });
  };

  return (
    <>
      <Snackbar
        open={snackbaropen}
        onClose={handleClose}
        message={message}
        autoHideDuration={6000}
      />
      <div className="password-security">
        <div className="password-chnage">
          <HttpsIcon
            style={{
              fontSize: 50,
              color: "blue",
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          />
          <Typography
            style={{ color: "blue", fontSize: "18px", fontWeight: "bold" }}
          >
            パスワードを変更
          </Typography>
          <Typography
            style={{ color: "red", fontSize: "14px", fontWeight: "bold" }}
          >
            パスワードは 8
            文字以上で、大文字、小文字、数字、および特殊文字を少なくとも 1
            つずつ含める必要があります。
          </Typography>
          <div
            style={{ marginTop: "20px", marginBottom: "20px", width: "70%" }}
          >
            <TextField
              label="古いパスワード"
              type={showOldPassword ? "text" : "password"}
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
              error={errors.oldPassword}
              helperText={errors.oldPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="新しいパスワード"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              error={errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="新しいパスワードを確認"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              error={errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              style={{ marginTop: "20px" }}
              startIcon={<HttpsIcon />}
              onClick={handleFormSubmit}
            >
              パスワードを変更
            </Button>
          </div>
        </div>

        <div className="other-security">
          <div className="two-factor-auth">
            <Typography>
              <h2>電子メール通知</h2>
              <p>
                この設定を有効にすると、課題の締め切りや新しい課題の作成に関する通知が電子メールで送信されます。
              </p>
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isEmailNotificationEnabled}
                    onChange={handleEmailToggleChange}
                  />
                }
                label={isEmailNotificationEnabled ? "Enabled" : "Disabled"}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
