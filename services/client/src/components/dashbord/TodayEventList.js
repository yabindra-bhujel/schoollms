import React, { useEffect, useState } from "react";
import { Typography, ListItemIcon, List, ListItem, ListItemText, Divider, Box, Avatar } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import instance from "../../api/axios";
import styled from "styled-components";

const Container = styled.div`
  margin: 5px;
  max-height: 300px;
  overflow-y: auto;
`;

const TodayEventList = () => {
  const [events, setEvents] = useState([]);

  const getTodayEvent = async () => {
    const endpoint = `/calendar/get_today_event`;
    try {
      const response = await instance.get(endpoint);
      if (response.status === 200) {
        setEvents(response.data);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getTodayEvent();
  }, []);

  return (
    <Container>
      <Typography variant="p" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        Today's Event
      </Typography>

      {events.length === 0 ? (
        <Typography variant="h5" style={{ color: "#666" }}>No events scheduled for today.</Typography>
      ) : (
        <List>
          {events.map((event, index) => (
            <React.Fragment key={index}>
              <ListItem style={{ backgroundColor: "#f0f0f0", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, marginRight: 2, backgroundColor: "rgb(232, 142, 202)" }}>
                      <EventIcon fontSize="small" style={{ color: "green" }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold" noWrap>
                        {event.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2">
                        {`${event.start_date}`}
                      </Typography>
                    }
                  />
                </div>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default TodayEventList;
