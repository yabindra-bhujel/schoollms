import React, {useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import "react-quill/dist/quill.snow.css";


const AnnouncementDetails = ({open,onClose,announcement,}) => {
  const extractFileName = (url) => {
    const segments = url.split("/");
    return segments[segments.length - 1];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{announcement.announcement_title}</DialogTitle>
      <DialogContent dividers>
      
    <Typography variant="body1" gutterBottom>
      <span dangerouslySetInnerHTML={{ __html: announcement.announcement_description }} />
    </Typography>

        {announcement.announcement_file_url && announcement.announcement_file_url.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Attached Files:
            </Typography>
            <List>
              {announcement.announcement_file_url.map((file, index) => (
                <ListItem key={index}>
                  <Link href={file.file_url} target="_blank" rel="noopener noreferrer">
                    {extractFileName(file.file_url)}
                  </Link>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
            <Button variant="outlined" onClick={onClose}>
            閉
          </Button>

      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementDetails;
