import React, { useState } from 'react';
import { Snackbar, TextField, Button, Grid, Paper, Typography, IconButton } from '@mui/material';
import { FaUserEdit } from "react-icons/fa";
import "./style/profile.css";
import { updateUserInfo } from "./SettingService";

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
                setMessage("ユーザー情報を更新しました");
                setSnackbarOpen(true);
                setIsEditMode(false);
            })
            .catch((error) => {
                setMessage("ユーザー情報の更新中に問題が発生しました。後でもう一度お試しください。または、サービスプロバイダに連絡してください。");
                setSnackbarOpen(true);
            });
    };

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
                        <Typography variant="h6">一般 情報
                            <IconButton aria-label="edit" color="primary" onClick={toggleEditMode}>
                                <FaUserEdit />
                            </IconButton>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="ユーザー名"
                            variant="outlined"
                            value={userData?.user?.username || ''}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="メール"
                            variant="outlined"
                            value={userData?.user?.email || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="名"
                            variant="outlined"
                            value={userData?.user?.first_name || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="姓"
                            variant="outlined"
                            value={userData?.user?.last_name || ''}
                            disabled={!isEditMode}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">住所の詳細</Typography>
                    </Grid>
                    {isTeacher ? (
                        <>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="電話"
                                    variant="outlined"
                                    value={userData?.teacher_data?.[0]?.phone || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="住所"
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
                                    label="市区町村"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.city || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="都道府県"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.state || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="郵便番号"
                                    variant="outlined"
                                    value={userData?.student_data?.[0]?.zip_code || ''}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="国"
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
                                更新
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
