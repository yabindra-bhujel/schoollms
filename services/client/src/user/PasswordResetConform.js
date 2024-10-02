import React, { useState } from 'react';
import { Button, TextField, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "./passwordreset.css"
import { PiLockKeyFill } from "react-icons/pi";
import instance from '../api/axios';
import {Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';


const ResetPasswordConfirm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState("");
    const [opensnackbar, setOpenSnackbar] = useState(false);


    const handleClose = () => { 
        setOpenSnackbar(false);
    };


    const handleDialogClose = () => {
        setOpenDialog(false);
    };



    const validatePasswords = () => {
        let tempErrors = {};
        if (!password) {
            tempErrors.password = 'Password is required';
        }
        // } else if (password.length < 8) {
        //     tempErrors.password = 'Password must be at least 8 characters long';
        // }

        if (!confirmPassword) {
            tempErrors.confirmPassword = 'Confirming password is required';
        } else if (password !== confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validatePasswords()) {
            // Submit the passwords
            const uuid = window.location.pathname.split('/')[2];
            const token = window.location.pathname.split('/')[3];
            const endpoint = `/conform_reset_password/${uuid}/${token}/`;
            try{
                const response = await instance.post(endpoint, { password, confirmPassword });
                if (response.status === 200) {
                    setOpenDialog(true);
                    setPassword("");
                    setConfirmPassword("");

                    setTimeout(() => {
                        window.location.href = "/login";
                    }
                        , 6000);

                }


            }catch(e){
                setMessage(
                    "Unable to reset your password. Please try again."
                );
                setOpenSnackbar(true);
                setPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
                

            }


        }
    };

    return (
        <>
        <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Password Reset Successfully"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Your password has been reset successfully. You will be redirected to the login page in 5 seconds.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>

        <Snackbar
            open={opensnackbar}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
        />
        
        <div className="reset-password">
            <div className="from-controll">
                <Avatar sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    backgroundColor: "#f50057",
                    }}>
                    <PiLockKeyFill size={40}/>
                </Avatar>
                <Typography 
                
                >
                     <h2
                            style={{
                                color: "blue",
                                fontWeight: "bold",
                                fontSize: "2rem",
                            }}
                        > Reset Your Password</h2>
                </Typography>
                <form onSubmit={handleSubmit} style={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
        </>

    );
};

export default ResetPasswordConfirm;
