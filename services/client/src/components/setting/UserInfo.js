import React from "react";
import { TextField, Grid, Paper, Typography } from "@mui/material";
import "./style/profile.css";
import { useTranslation } from "react-i18next";

const UserInfo = ({ userData, isTeacher, setUserData }) => {
  const { t } = useTranslation();
  const userName = t("settings.userName");
  const firstName = t("settings.firstName");
  const lastName = t("settings.lastName");
  const email = t("settings.email");

  return (
    <>
      <Paper style={{ padding: 15, width: "80%", margin: "0 auto" }}>
        <div className="form-control">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">{t("settings.normalInfo")}</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={userName}
                variant="outlined"
                value={userData?.user?.username || ""}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={email}
                variant="outlined"
                value={userData?.user?.email || ""}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={firstName}
                variant="outlined"
                value={userData?.user?.first_name || ""}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={lastName}
                variant="outlined"
                value={userData?.user?.last_name || ""}
                disabled
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </>
  );
};
export default UserInfo;
