import React, { useState, useEffect } from "react";
import instance from "../../../api/axios";
import getUserInfo from "../../../api/user/userdata";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import ViewListIcon from '@mui/icons-material/ViewList';

const AnnouncementWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const AnnouncementListWrapper = styled.div`
  width: 100%;
`;

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const isStudent = getUserInfo().isStudent;

  useEffect(() => {
    if (isStudent) {
      instance.get("students/announcement/").then((response) => {
        setAnnouncements(response.data);
      });
    }
  }, []);

  function extractTextFromHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }

  return (
    <AnnouncementListWrapper>
      <AnnouncementWrapper>
        <Typography variant="p" style={{ fontWeight: "bold" }}>
          Announcement List
        </Typography>
      </AnnouncementWrapper>

      <List>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <ListItem key={announcement.id}>
              <ListItemIcon>
                <ViewListIcon style={{ color: "#3f51b5" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#333" }}>
                    {`${extractTextFromHtml(announcement.announcement_title).substring(0, 20)}...`}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" style={{ color: "gray", fontWeight: "bold", fontSize: "0.9rem",}}>
                    {`${extractTextFromHtml(announcement.announcement_description).substring(0, 50)}...`}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="You don't have any announcements." />
          </ListItem>
        )}
      </List>
    </AnnouncementListWrapper>
  );
};

export default AnnouncementList;
