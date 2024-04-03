import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { updatedNote , deleteNote} from './NotesService';
import { FaDownload } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import getUserInfo from "../../api/user/userdata";
import ShareDialog from "./ShareNote";
import CollaboratorAvatars from './CollaboratorAvatars';
import jsPDF from 'jspdf';
import { Snackbar } from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoteDetails = ({
  openNoteDialog,
  setOpenNoteDialog,
  selectedNote,
  setSelectedNote,
  notes,
  fetchData
}) => {
  
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const currentUser = getUserInfo().username;

  const isNoteOwner = () => {
    return  selectedNote && selectedNote.owner === currentUser;
  };

  if (!selectedNote) {
    return null; 
  }

  const exportPdf = () => {
    const contentLines = selectedNote.content.split('\n');
    const pdf = new jsPDF();
  
    pdf.setFontSize(20);
    pdf.text(selectedNote.title, 10, 10); 
  
    pdf.setFontSize(12);
    contentLines.forEach((line, index) => {
      pdf.text(line, 10, 20 + index * 10); 
    });
  
    pdf.save('note.pdf'); 
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setTimeout(() => {
      setSnackbarMessage(null);
    }, 3000);

    setSnackbarOpen(true);
  };

  const openShareDialog = (noteId) => {
    setSelectedNoteId(noteId);
    setShareDialogOpen(true);
  };

  const closeShareDialog = () => {
    setShareDialogOpen(false);
  };

  const handleClose = () => {
    setOpenNoteDialog(false);
  };

  const handleSave = () => {
    const index = notes.findIndex(note => note.id === selectedNote.id);
    const requestData = {
      content: selectedNote.content,
      title: selectedNote.title,
    };


    updatedNote(selectedNote.id, requestData)
      .then(() => {
        setSnackbarMessage('Note content updated successfully.');
        handleClose(); 
        fetchData();
      })
      .catch(error => {
        setSnackbarMessage('Error updating note content.');
      });
  };

  return (
    <React.Fragment>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
        <ShareDialog
        open={shareDialogOpen}
        handleClose={closeShareDialog}
        noteid={selectedNoteId}
        onUsersAdded={openSnackbar}
        fetchData={fetchData}
      />

      <Dialog
        open={openNoteDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        onClose={handleClose}
      >
        <DialogTitle>{"Edit Note"}</DialogTitle>
        <input
            type="text"
            value={selectedNote?.title}
                onChange={(e) => setSelectedNote(prevNote => ({ ...prevNote, title: e.target.value }))}
                placeholder="Enter your note title here..."
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '18px',
              border: 'none',
              outline: 'none',
            }}
          />
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <TextareaAutosize
                style={{ 
                  width: "600px",
                  minHeight: "200px",
                  resize: "none",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                }}
                value={selectedNote?.content}
                onChange={(e) => setSelectedNote(prevNote => ({ ...prevNote, content: e.target.value }))}
                placeholder="Enter your note here..."
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            backgroundColor: "#4BC5BC",
          }}
        >
          {selectedNote.type === "shared" && (
            <CollaboratorAvatars
              collaborators={selectedNote.collaborators}
            />
          
          )}
          <Button 
          onClick={exportPdf}>
            <FaDownload 
              size={20}
            />
          </Button>
          {isNoteOwner() && (
                    <Button onClick={() => openShareDialog(selectedNote.id)}>
                      <IoPersonAdd 
                        size={20}
                       />
                    </Button>

                  )}

          {isNoteOwner() && (
            <Button
              aria-label="delete"
              onClick={() => {
                deleteNote(
                  selectedNote.id
                )
                  .then(() => {
                    fetchData();
                    handleClose();
                  })
                  .catch((error) => {
                    console.error("Error deleting note: ", error);
                  });
              }}
              style={{ marginRight: 8, color: "red" }}
            >
              <MdDelete
                style={{ color: "red" }}
                size={20}
              />
            </Button>
          )}
          
          <Button onClick={handleSave}>
            <FaSave
              size={20}
              />
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default NoteDetails;
