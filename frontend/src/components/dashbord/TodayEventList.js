import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Divider, Typography, Box, Avatar, Paper } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";

const TodayEventList = () => {
  const [events, setEvents] = useState([]);

  const getTodayEvent = async () => {
    const username = getUserInfo().username;
    const endpoint = `/notification/getTodayEvent/${username}/`;
    try {
      const response = await instance.get(endpoint);
      if (response.status === 200) {
        setEvents(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodayEvent();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <strong>Today's Event</strong>
      </Typography>
      {events.length > 0 ? (
        <Paper elevation={3} sx={{ borderRadius: "10px", padding: "10px" }}>
          <List>
            {events.map((event, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="center"
                  sx={{
                    backgroundColor: event.color || "transparent",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, marginRight: 2 }}>
                    <EventIcon fontSize="small" />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold" noWrap>
                        {event.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2">
                        {`${event.start_date} ${event.time}`}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < events.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography>No events scheduled for today.</Typography>
      )}
    </Box>
  );
};

export default TodayEventList;
