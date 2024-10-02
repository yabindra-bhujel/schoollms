import React, { useState } from 'react';
import { Snackbar, TextField, Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import { FaUserEdit } from "react-icons/fa";
import "./style/profile.css";
import { updateUserInfo } from "./SettingService";
import { useTranslation } from "react-i18next";


const UserInfoForm = ({ userData, isTeacher, setUserData }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [snackbaropen, setSnackbarOpen] = useState(false);
    const [message, setMessage] = useState("");
    const { t } = useTranslation();
    // notice msg
    const updateOk = t("messages.setInfoOk");
    const errorMsg = t("messages.setInfoErr");

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
                setMessage(updateOk);
                setSnackbarOpen(true);
                setIsEditMode(false);
            })
            .catch((error) => {
                setMessage(errorMsg);
                setSnackbarOpen(true);
            });
    };
    const userName = t("settings.userName");
    const firstName = t("settings.firstName");
    const lastName = t("settings.lastName");
    const email = t("settings.email");
    const phone = t("settings.phone");
    const address = t("settings.address");
    const district = t("settings.district");
    const prefect = t("settings.prefect");
    const postCode = t("settings.postCode");
    const country = t("settings.country");

    return (
        <>
        <Snackbar
            open={snackbaropen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}/>

        <Paper style={{ padding: 15, width: '80%', margin: '0 auto' }}>
            <div className='form-control'>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">{t("settings.normalInfo")}
                            <IconButton aria-label="edit" color="primary" onClick={toggleEditMode}>
                                <FaUserEdit />
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label={userName}
                            variant="outlined"
                            value={userData?.user?.username || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label={email}
                            variant="outlined"
                            value={userData?.user?.email || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label={firstName}
                            variant="outlined"
                            value={userData?.user?.first_name || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label={lastName}
                            variant="outlined"
                            value={userData?.user?.last_name || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">{t("settings.detailAdd")}</Typography>
                    </Grid>
                    {isTeacher ? (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={phone}
                                    variant="outlined"
                                    value={userData?.teacher_data?.[0]?.phone || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={address}
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
                                    label={district}
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.city || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={prefect}
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.state || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={postCode}
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.zip_code || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={country}
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.country || ''}
                                    disabled
                                />
                            </Grid>
                        </>
                    )}
                    {isEditMode && (
                        <Grid item xs={12}>
                            <Button color="secondary" onClick={handleFormSubmit}>
                                {t("settings.update")}
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
