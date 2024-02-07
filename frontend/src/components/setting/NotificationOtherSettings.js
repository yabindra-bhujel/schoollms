import React, { useState, useEffect } from "react";
import { Snackbar, TextField, Button, Grid, Paper, Typography, List, ListItem, ListItemText, InputAdornment, IconButton } from '@mui/material';
import { Switch, FormGroup, FormControlLabel } from '@mui/material';
import "./style/notification.css";


const NotificationOtherSettings = () => {
    const [isTwoFactorAuthEnabled, setIsTwoFactorAuthEnabled] = useState(false);
    return (
        <>
            <div className="notification-settings">
                <div className="notify">
                <div className="notification">
                    <Typography>
                        <h2> Application Notification</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Nulla vitae elit libero, a pharetra augue.
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.


                        </p>
                    </Typography>



                <FormGroup>
                    <FormControlLabel
                        control={<Switch  />}
                        label={isTwoFactorAuthEnabled ? 'Enabled' : 'Disabled'}
                    />
                </FormGroup>
                </div>


                <div className="notification">
                    <Typography>
                        <h2> Email Notification</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Nulla vitae elit libero, a pharetra augue.
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur et.


                        </p>
                    </Typography>



                <FormGroup>
                    <FormControlLabel
                        control={<Switch  />}
                        label={isTwoFactorAuthEnabled ? 'Enabled' : 'Disabled'}
                    />
                </FormGroup>
                </div>

                </div>
         



            </div>
        </>
    );
}

export default NotificationOtherSettings;
