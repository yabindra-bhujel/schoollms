import React, { useState } from 'react';
import {Snackbar, TextField, Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import { FaUserEdit } from "react-icons/fa";
import "./style/profile.css";
import {updateUserInfo} from "./SettingService";



const UserInfoForm = ({ userData, isTeacher, setUserData }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [snackbaropen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");



    const handleClose = () => {
        setSnackbarOpen(false);
    };

    const toggleEditMode = () => {
        setIsEditMode(prevMode => !prevMode);
    };



    const handleInputChange = (field, value) => {
        let updatedUserData = { ...userData };
        updatedUserData.user = { ...updatedUserData.user, [field]: value };
        setUserData(updatedUserData);
    };
    

      



    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = {
            first_name: userData?.user?.first_name,
            last_name: userData?.user?.last_name,
            email: userData?.user?.email,
            
        };
        updateUserInfo(data)
            .then((response) => {
                setMessage("User Info Updated Successfully");
                setSnackbarOpen(true);
                setIsEditMode(false);
            })
            .catch((error) => {
                setMessage("Something went wrong while updating user info. Please try again later or contact to service provider.");
                setSnackbarOpen(true);
            });
    };
    

    return (
        <>
        <Snackbar
            open={snackbaropen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
        />

        <Paper style={{ padding: 15, width: '80%', margin: '0 auto' }}>
            <div className='form-control'>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">General Info
                            <IconButton aria-label="edit" color="primary" onClick={toggleEditMode}>
                                <FaUserEdit />
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={userData?.user?.username || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={userData?.user?.email || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('email', e.target.value)}


                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            value={userData?.user?.first_name || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            value={userData?.user?.last_name || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Address Details</Typography>
                    </Grid>

                    {isTeacher ? (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    variant="outlined"
                                    value={userData?.teacher_data?.[0]?.phone || ''}
                                    disabled

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    variant="outlined"
                                    value={userData?.teacher_data?.[0]?.address || ''}
                                    disabled
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.city || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="State/Province/Region"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.state || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Postal Code"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.zip_code || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.country || ''}
                                    disabled
                                />
                            </Grid>
                        </>
                    )}


                    {isEditMode && (
                        <Grid item xs={12}>
                            <Button color="secondary" 
                            onClick={handleFormSubmit}
                            >
                                update
                            </Button>
                        </Grid>
                    )}




                </Grid>
            </div>
        </Paper>
        </>

    );
};

export default UserInfoForm;

