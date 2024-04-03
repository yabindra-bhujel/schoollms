import React, { useState, useEffect } from 'react';
import { Snackbar, TextField, Button, Grid, Paper, Typography, List, ListItem, ListItemText, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "./style/password.css";
import HttpsIcon from '@mui/icons-material/Https';
import { chnagePassword, handleLogout, checkTwoFactorAuth, updateTwoFactorAuth, updateEmailNotification, checkEmailNotification } from './SettingService';
import { Switch, FormGroup, FormControlLabel } from '@mui/material';

const UserManagement = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] = useState(false);

  const fatchData = async () => {
    try {
      const response = await checkTwoFactorAuth();
      setIsTwoFactorAuthEnabled(response.data.two_factor_auth);
      const emailNotificationResponse = await checkEmailNotification();
      setIsEmailNotificationEnabled(emailNotificationResponse.data.is_email_notification);
    } catch (error) {
      setMessage("データの取得中に問題が発生しました。後でもう一度試すか、サービスプロバイダーに問い合わせてください.");
      setSnackbarOpen(true);
    }

  }




  useEffect(() => {
    fatchData();
  }, []);


  const handleToggleChange = async () => {
    setIsTwoFactorAuthEnabled((prevValue) => !prevValue);

    const data = {
      two_factor_auth: !isTwoFactorAuthEnabled,
    };
   try{
    const response = await updateTwoFactorAuth(data);
    if (response.status === 200) {
      setMessage("二要素認証が正常に更新されました");
      setSnackbarOpen(true);
    }
   }catch (error) {
    setMessage("二要素認証の更新中に問題が発生しました。後でもう一度試すか、サービスプロバイダーに問い合わせてください。");
    setSnackbarOpen(true);
   }
  };

  const handleEmailToggleChange = async () => {
    setIsEmailNotificationEnabled((prevValue) => !prevValue);

    const data = {
      emai_notification: !setIsEmailNotificationEnabled,
    };
    try{
      const response = await updateEmailNotification(data);
      if (response.status === 200) {
        setMessage("電子メール通知が正常に更新されました");
        setSnackbarOpen(true);
      }
    }catch (error) {
      setMessage("電子メール通知の更新中に問題が発生しました。後でもう一度試すか、サービスプロバイダーに問い合わせてください。");
      setSnackbarOpen(true);
    }
  };


  const handleClose = () => {
    setSnackbarOpen(false);
  };




  // const validatePassword = (password) => {
  //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //   return regex.test(password);
  // };


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
      setErrors({ confirmPassword: "パスワードは新しいパスワードと同じであることを確認してください" });
      return;
    }

    // if (!validatePassword(newPassword)) {
    //   setErrors({ newPassword: "Password must meet the specified criteria." });
    //   return;
    // }


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
        setMessage("Something went wrong while updating password. Please try again later or contact to service provider.");
        setSnackbarOpen(true);
      });
  }



  return (
    <>
      <Snackbar
        open={snackbaropen}
        onClose={handleClose}
        message={message}
        autoHideDuration={6000}
      />
      <div className="password-security">
        <div className='password-chnage'>

          <HttpsIcon style={{
            fontSize: 50,
            color: 'blue',
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 20,
            marginRight: 20,

          }} />
          <Typography
            style={{ color: 'blue', fontSize: '18px', fontWeight: 'bold' }}
          >パスワードを変更</Typography>
          <Typography
            style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}
          >パスワードを変更するには、以下のフィールドに入力してください</Typography>
          <br />
          <Typography
            style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}
          >パスワードは 8 文字以上で、大文字、小文字、数字、および特殊文字を少なくとも 1 つずつ含める必要があります。</Typography>
          <div
            style={{ marginTop: '20px', marginBottom: '20px', width: '70%' }}

          >
            <TextField
              label="古いパスワード"
              type={showOldPassword ? 'text' : 'password'}
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
              type={showNewPassword ? 'text' : 'password'}
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
              type={showConfirmPassword ? 'text' : 'password'}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              style={{ marginTop: '20px' }}
              startIcon={<HttpsIcon />
              }
              onClick={handleFormSubmit}
            >
              パスワードを変更
            </Button>
          </div>
        </div>

        <div className='other-security'>

          <div className='two-factor-auth' aria-disabled>
            <Typography >
              <h2>二要素認証</h2>
              <p>
              二要素認証では、ログイン時にパスワードとともに<strong>電子メール</strong>からのコードが必要になるため、セキュリティが強化されます。この機能のプロフィールに<strong>電子メール</strong>が最新であることを確認してください。
              </p>


            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={isTwoFactorAuthEnabled} onChange={handleToggleChange} />}
                label={isTwoFactorAuthEnabled ? 'Enabled' : 'Disabled'}
              />
            </FormGroup>
          </div>

          <div className='two-factor-auth'>
            <Typography >
            <h2>電子メール通知</h2>
              <p>
                二要素認証では、ログイン時にパスワードとともに<strong>電子メール</strong>からのコードが必要になるため、セキュリティが強化されます。この機能のプロフィールに<strong>電子メール</strong>が最新であることを確認してください。
              </p>
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={isEmailNotificationEnabled} onChange={handleEmailToggleChange} />}
                label={isEmailNotificationEnabled ? 'Enabled' : 'Disabled'}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </>

  );
};

export default UserManagement;
