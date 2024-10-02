import React, { useState } from "react";
import { Snackbar, Button, TextField, Typography, Container, CssBaseline, Avatar } from '@mui/material';
import "./passwordreset.css"
import { PiLockKeyOpenFill } from "react-icons/pi";
import instance from "../api/axios";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';




const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [opensnackbar, setOpenSnackbar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClose = () => {
        setOpenDialog(false);
    };



    const handleClose = () => {
        setOpenSnackbar(false);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => {
        setErrors({});

        if (email.trim() === "") {
            setErrors({ email: "Email is required" });
            return;
        }

        if (username.trim() === "") {
            setErrors({ username: "Username is required" });
            return;
        }



        e.preventDefault();
        const endpoint = `reset_password`;
        try {
            const response = await instance.post(endpoint, { email, username });

            if (response.status === 200) {
                setOpenDialog(true);
                setEmail("");
                setUsername("");
                
            }

        }

        catch (e) {
            setMessage(
                "Unable to authenticate your account. Please check your credentials and try again."
            );
            setOpenSnackbar(true);
            setEmail("");
            setUsername("");
            setTimeout(() => {
                setMessage("");
            }, 5000);
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
                <DialogTitle id="alert-dialog-title">
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}>
                        <CheckCircleIcon sx={{ color: "green", fontSize: 80 }} />
                        <Typography>
                            <h1><b>Success</b></h1>
                        </Typography>
                    </div>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A password reset link has been sent to your email address. Please check your inbox to proceed with resetting your password. This link is valid for  
                       <strong
                       style={{
                                color: "red",
                            }}
                       > 1 hour
                        </strong>. If you do not receive the email within a few minutes, check your spam folder or try requesting a new link.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>

            </Dialog>

            <Snackbar
                open={opensnackbar}
                onClose={handleClose}
                message={message}
                autoHideDuration={5000}
            />
            <div className="reset-password">
                <div className="from-controll">
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            margin: "1rem auto",
                            backgroundColor: "#f50057",
                        }}
                    >
                        <PiLockKeyOpenFill size={40} />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <h2
                            style={{
                                color: "blue",
                                fontWeight: "bold",
                                fontSize: "2rem",
                            }}
                        > Reset Password</h2>
                        <p
                            style={{
                                color: "#f50057",
                                fontWeight: "bold",
                                fontSize: "1rem",
                            }}
                        >
                            Enter your email address and we'll send you a link to reset your.
                            Email Address must be the same as the one used to register your account.
                        </p>
                    </Typography>
                    <div>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={handleEmailChange}
                            error={errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={handleUsernameChange}
                            error={errors.username}
                            helperText={errors.username}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            style={{
                                marginTop: '1rem',
                                color: 'white', fontSize: '20px'
                            }}
                        >
                            Reset Password
                        </Button>

                    </div>
                </div>
            </div>
        </>

    );
};

export default ResetPassword;
