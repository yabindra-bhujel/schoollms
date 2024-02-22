import React, { useState, useEffect } from 'react';
import {Snackbar, TextField, Button, Grid, Paper, Typography, List, ListItem, ListItemText, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "./style/password.css";
import HttpsIcon from '@mui/icons-material/Https';
import { chnagePassword, handleLogout, checkTwoFactorAuth , updateTwoFactorAuth} from './SettingService';
import { Switch, FormGroup, FormControlLabel } from '@mui/material';
import { set } from 'date-fns';


const UserManagement = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginHistory, setLoginHistory] = useState([]);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbaropen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);



  const fatchData = async () => {
    try{
      const response = await checkTwoFactorAuth();
      setIsTwoFactorAuthEnabled(response.data.two_factor_auth);
    }catch(error){
      setMessage("Something went wrong while fetching data. Please try again later or contact to service provider.");
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
    const response = await updateTwoFactorAuth(data);
    if (response.status === 200) {
      setMessage("Two Factor Authentication Updated Successfully");
      setSnackbarOpen(true);
    }
  };

  
  const handleClose = () => {
    setSnackbarOpen(false);
  };
  
  useEffect(() => {
    // Fetch login history data
    // This is a placeholder, replace with actual data fetching logic
    setLoginHistory(['Device 1 - 2024-01-01', 'Device 2 - 2024-01-02']);
  }, []);



  // const validatePassword = (password) => {
  //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  //   return regex.test(password);
  // };
  

  const handleFormSubmit = (e) => {
    setErrors({});

    if (oldPassword === "") {
      setErrors({ oldPassword: "Old Password is required" });
      return;
    }

    if (newPassword === "") {
      setErrors({ newPassword: "New Password is required" });
      return;
    }

    if (confirmPassword === "") {
      setErrors({ confirmPassword: "Confirm Password is required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Confirm Password must be same as new password" });
      return;
    }

    // if (!validatePassword(newPassword)) {
    //   setErrors({ newPassword: "Password must meet the specified criteria." });
    //   return;
    // }


    e.preventDefault();
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
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
        } , 10000);


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

        <HttpsIcon style={{ fontSize: 60,
        color: 'blue',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,

         }} />
        <Typography
        style={{ color: 'blue', fontSize: '20px' , fontWeight: 'bold'}}
         >Change Password</Typography>
        <Typography 
        style={{ color: 'black', fontSize: '15px' , fontWeight: 'bold'}}
        >To change your password, please fill in the fields below.</Typography>
        <br />
        <Typography 
        style={{ color: 'red', fontSize: '15px' , fontWeight: 'bold'}}
        >Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.</Typography>
        <div 
        style={{marginTop: '20px', marginBottom: '20px', width: '70%'}}

        >
          <TextField 
            label="Old Password" 
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
            label="New Password" 
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
            label="Confirm Password" 
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
            style={{marginTop: '40px'}}
            startIcon={<HttpsIcon />
          }
            onClick={handleFormSubmit}
          >
            Change Password
          </Button>
        </div>
      </div>

      <div className='other-security'>

        <div className='two-factor-auth'>
      <Typography >
        <h2>Two-Factor Authentication</h2>
        <p>
  Two-factor authentication enhances security by requiring a code from your <strong>email</strong>  along with your password for login. Ensure your <strong>email</strong> is current in your profile for this feature.
</p>


        </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={isTwoFactorAuthEnabled} onChange={handleToggleChange} />}
          label={isTwoFactorAuthEnabled ? 'Enabled' : 'Disabled'}
        />
      </FormGroup>
      </div>
    </div>
    </div>
    </>

  );
};

export default UserManagement;
