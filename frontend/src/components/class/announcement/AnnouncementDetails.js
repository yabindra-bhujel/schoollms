import React, {useState, useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import instance from "../../../api/axios";
import TextField from "@mui/material/TextField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const AnnouncementDialog = ({
  open,
  onClose,
  announcement,
  handleDelete,
  getAnnouncementData,
  setUpdateMessage
}) => {
  const [isActive, setIsActive] = useState(announcement.is_active);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState(announcement.announcement_title);
  const [editableContent, setEditableContent] = useState(announcement.announcement_description)


  useEffect(() => {
    setIsActive(announcement.is_active);
    setEditableTitle(announcement.announcement_title);
    setEditableContent(announcement.announcement_description);
  }, [announcement]);


  const deleteAnnouncement =  () => {
    handleDelete();
    onClose();
    getAnnouncementData();
  }
  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleTitleChange = (event) => {
    setEditableTitle(event.target.value);
  };



  const handleSwitchChange = (event) => {
    setIsActive(event.target.checked);
    handleIsActiveChange(announcement.id, event.target.checked); 
  };

  const handleIsActiveChange = async (announcementId, newStatus) => {

    const endpoint = `course/handle_active_change_announcement/${announcementId}/`;
    try{
      const response = await instance.put(endpoint);
    }catch(error){
      console.log(error)
    }
  };

  const handleUpdateAnnouncemnet = async() =>{
    const endpoint = `course/update_announcement/${announcement.id}/`;
    try{
      const response = await instance.put(endpoint, {
        announcement_title: editableTitle,
        announcement_description: editableContent,
      });
      if(response.status === 200){
        setIsEditMode(false);
        getAnnouncementData();
        onClose();
        setUpdateMessage("Announcement updated successfully")

        setTimeout(() =>{
          setUpdateMessage("")
        }, 3000)
      }
    }catch(error){
      console.log(error)
    }
  }

  
  

  const extractFileName = (url) => {
    const segments = url.split("/");
    return segments[segments.length - 1];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {isEditMode ? (
        <TextField
          fullWidth
          value={editableTitle}
          onChange={handleTitleChange}
          variant="standard"
          sx={{ padding: '10px' }}

        />
      ) : (
        <DialogTitle>{editableTitle}</DialogTitle>
      )}
      <DialogContent dividers>
        
      {isEditMode ? (
    <ReactQuill
      theme="snow"
      value={editableContent} 
      onChange={(editableContent) => setEditableContent(editableContent)}
      modules={{
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      }}
    />
  ) : (
    <Typography variant="body1" gutterBottom>
      <span dangerouslySetInnerHTML={{ __html: editableContent }} />
    </Typography>
  )}
        

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box>
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={deleteAnnouncement} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Switch
          checked={isActive}
          onChange={handleSwitchChange}

           />
           {isEditMode ? (
            <Button variant="outlined" onClick={handleUpdateAnnouncemnet}>
            Save
          </Button>

           ):(
            <Button variant="outlined" onClick={onClose}>
            Close
          </Button>

           )}
          
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementDialog;
