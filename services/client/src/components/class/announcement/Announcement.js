import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import AnnouncementList from "./AnnouncementList";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BackupIcon from "@mui/icons-material/Backup";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";
import instance from "../../../api/axios";

const AnnouncementWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(226, 222, 222);
  border-radius: 10px;
`;
const AddButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background-color: #2196f3;
  border: none;
  color: white;
  margin-right: 10px;
`;
const AnnouncementListWrapper = styled.div`
  width: 90%;
  padding: 20px;
  background-color: #d1dace;
  margin: 10px;
  border-radius: 8px;
`;

const Announcement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileUploadMessage, setFileUploadMessage] = useState("");
  const { t } = useTranslation();
  const params = useParams();
  const subject_code = params.subject_code;
  const fileInputRef = useRef(null);
  const [file, setFile] = useState([]);
  const [announcements, setAnnouncements] = useState([])
  const [deleteMessage, setDeleteMessage] = useState("")
  const [updateMessage, setUpdateMessage] = useState("")

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    const validFiles = Array.from(selectedFiles).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      setFile((prevFiles) => [...prevFiles, ...validFiles]);
      setFileUploadMessage("");
    } else {
      setFileUploadMessage(t("ファイルのサイズが大きすぎます。最大サイズは10MBです。"));
      setTimeout(() => {
        setFileUploadMessage("");
      }, 2000);
    }
  };

  const handleFileDelete = (indexToDelete) => {
    setFile((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  useEffect(() => {
    getAnnouncementData();
  }, [])

  const getAnnouncementData = async () => {
    const endpoint = `announcements/subject/${subject_code}/`;
    try {
      const response = await instance.get(endpoint);
      setAnnouncements(response.data);
    } catch (error) {

    }
  }


  const handlePostAnnouncemnet = async () => {
    const announcementData = new FormData();
    announcementData.append("subject_code", subject_code);
    announcementData.append("title", title);
    announcementData.append("content", content);
    for (let i = 0; i < file.length; i++) {
      announcementData.append("file", file[i]);
    }
    // announcement
    const endpoint = `announcements/`;
    try {
      const response = await instance.post(endpoint, announcementData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        setNewMessage("Announcement Added Successfully")
        setTimeout(() => {
          setNewMessage("");
        }, 3000);
        handleCloseAddDialog()
        setTitle("")
        setContent("")
        setFile([])
        getAnnouncementData();

      }

    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div>
      <AnnouncementWrapper>
        <div className="title">
          <h1>Announcement List</h1>
        </div>
        <div className="add-btn">
          <AddButton onClick={handleOpenAddDialog}>Add Announcement</AddButton>
        </div>
      </AnnouncementWrapper>
      {/*  */}
      {updateMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="success">{updateMessage}</Alert>
        </Stack>
      )}
      {deleteMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="success">{deleteMessage}</Alert>
        </Stack>
      )}

      {newMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="success">{newMessage}</Alert>
        </Stack>
      )}

      <AnnouncementListWrapper>
        <AnnouncementList announcements={announcements} setDeleteMessage={setDeleteMessage} getAnnouncementData={getAnnouncementData} setUpdateMessage={setUpdateMessage} />
      </AnnouncementListWrapper>




      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth={true}
      >
        <DialogTitle>Add Announcement</DialogTitle>

        {fileUploadMessage && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error">{fileUploadMessage}</Alert>
          </Stack>
        )}


        <DialogContent>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Title"
            fullWidth margin="normal" />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(content) => setContent(content)}
            modules={{
              toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            }}
          />
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple/>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<BackupIcon />}
              onClick={handleButtonClick}
            >ファイル選択
            </Button>
            {file.length > 0 && (
              <List dense>
                {file.map((file, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText
                      primary={
                        <>
                          <strong>{file.name}</strong> <br />
                          {file && file.size
                            ? (file.size / (1024 * 1024)).toFixed(2)
                            : 0}{" "}
                          MB
                        </>
                      }
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleFileDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
            <Typography variant="body2" style={{ marginTop: "10px" }}>
              <strong>JPEG, PNG, PDF, ZIP | Max size: 10MB</strong>
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>キャンセル</Button>
          <Button onClick={handlePostAnnouncemnet}>送信</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Announcement;
