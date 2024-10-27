import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { updatedNote } from "./NotesService";
import { IoPersonAdd } from "react-icons/io5";
import getUserInfo from "../../api/user/userdata";
import ShareDialog from "./ShareNote";
import jsPDF from "jspdf";
import { Snackbar } from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./style/noteDetails.css";
import { CiSaveDown2 } from "react-icons/ci";
import Tooltip from "@mui/material/Tooltip";
// import { MDXEditor } from '@mdxeditor/editor';
import ReactMarkdown from "react-markdown";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoteDetails = ({
  openNoteDialog,
  setOpenNoteDialog,
  selectedNote,
  setSelectedNote,
  notes,
  fetchData,
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const currentUser = getUserInfo().username;

  const isNoteOwner = () => {
    return selectedNote && selectedNote.owner === currentUser;
  };

  if (!selectedNote) {
    return null;
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarMessage("");
    }, 3000);
  };

  const openShareDialog = (noteId) => {
    setSelectedNoteId(noteId);
    setShareDialogOpen(true);
  };

  const closeShareDialog = () => {
    setShareDialogOpen(false);
  };

  const handleClose = () => {
    setSelectedNote(null);
    setSelectedNoteId(null);
    setOpenNoteDialog(false);
  };

  const handleSave = () => {
    const index = notes.findIndex((note) => note.id === selectedNote.id);
    const requestData = {
      content: selectedNote.content,
      title: selectedNote.title,
    };

    updatedNote(selectedNote.id, requestData)
      .then(() => {
        openSnackbar("Note content updated successfully.");
        handleClose();
        fetchData();
      })
      .catch((error) => {
        openSnackbar("Error updating note content.");
      });
  };

  const handleEditorChange = (markdown) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      content: markdown, // Update the content as the user types
    }));
  };

  return (
    <>
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
        maxWidth="xl"
        fullWidth={true}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitle>
          <div className="note-details-header">
            <div className="note-title">
              <input
                type="text"
                value={selectedNote?.title}
                onChange={(e) =>
                  setSelectedNote((prevNote) => ({
                    ...prevNote,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter your note title here..."
                onFocus={(e) => (e.target.style.borderColor = "#007BFF")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />
            </div>

            <div className="button-group">
              {isNoteOwner() && (
                <>
                  <Tooltip title="Add Collaborator">
                    <button onClick={() => openShareDialog(selectedNote.id)}>
                      <IoPersonAdd size={30} color="green" />
                    </button>
                  </Tooltip>
                </>
              )}

              <Tooltip title="Save Note">
                <button onClick={handleSave}>
                  <CiSaveDown2 size={30} color="blue"/>
                </button>
              </Tooltip>

              <Tooltip title="Close">
                <button onClick={handleClose}>
                  <IoMdCloseCircleOutline size={30} color="red" />
                </button>
              </Tooltip>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          <div className="note-details-body">
            {/* <MDXEditor 
              markdown={selectedNote.content} 
              onChange={handleEditorChange} 
              readOnly
            /> */}
             <ReactMarkdown>{selectedNote.content}</ReactMarkdown>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteDetails;
