import React, {useState, useEffect} from "react";
import instance from "../../../api/axios";
import getUserInfo from "../../../api/user/userdata";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import styled from "styled-components";

const AnnouncementWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background: rgb(226, 222, 222);
`;

const AnnouncementListWrapper = styled.div`
  width: 100%;
  background-color: #d1dace;
  padding: 10px;
`;

const AnnouncementList = () =>{
    const [announcements, setAnnouncements] = useState([]);
    const isStudent = getUserInfo().isStudent;
    const studentid = getUserInfo().username;
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
  



    useEffect(() => {
        if (isStudent) {
            instance.get("students/announcement/").then((response) => {
                setAnnouncements(response.data);
            });
            }
      }
    , []);


    const handleOpenDetailsDialog = (announcement) => {
        setSelectedAnnouncement(announcement);
        setOpenDetailsDialog(true);
      };
    
      const handleCloseDetailsDialog = () => {
        setOpenDetailsDialog(false);
      };
  
      function extractTextFromHtml(htmlString) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, 'text/html');
          return doc.body.textContent || "";
        }


    return(
        <div>
          <AnnouncementWrapper>
          <strong>Announcement List</strong>
      </AnnouncementWrapper>

      <AnnouncementListWrapper>
      <List>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <ListItem
              key={announcement.id}
              button
              onClick={() => handleOpenDetailsDialog(announcement)}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="p" style={{ fontWeight: 'bold' }}>
                  {`${extractTextFromHtml(announcement.announcement_title).substring(0, 55)}...`}

                  </Typography>
                }
                secondary={
                  <span>
                  {`${extractTextFromHtml(announcement.announcement_description).substring(0, 50)}...`}
                </span>
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

        </div>
    )
}

export default AnnouncementList;