import React, {useState, useEffect} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import instance from "../../../api/axios";
import AnnouncementDetails from "./AnnouncementDetails";



const AnnouncementList = ({announcements}) =>{
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState({});
  
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
        <>
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
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {announcement.announcement_title}
                  </Typography>
                }
                secondary={
                  <span>
                  {`${extractTextFromHtml(announcement.announcement_description).substring(0, 150)}...`}
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

      <AnnouncementDetails
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        announcement={selectedAnnouncement}
      />

</>


    )
}

export default AnnouncementList;