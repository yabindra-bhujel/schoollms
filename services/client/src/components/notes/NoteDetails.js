import React, { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { updatedNote } from "./NotesService";
import ShareDialog from "./ShareNote";
import { Snackbar } from "@mui/material";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./style/noteDetails.css";
import Tooltip from "@mui/material/Tooltip";
import NoteEditor from "./NoteEditor";
import { MdModeEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NoteDetails = ({
  openNoteDialog,
  setOpenNoteDialog,
  selectedNote,
  setSelectedNote,
  fetchData,
}) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  if (!selectedNote) {
    return null;
  }

  const tagColors = {
    "University": "#FF5733",
    "Work": "#33FF57",
    "Personal": "#3357FF",
    "Important": "#FF33A1",
    "Study": "#FFD633",
    "Meeting": "#33FFF5",
    "Project": "#FF8333",
    "Miscellaneous": "#9B59B6",
    "Reminder": "#34495E",
    "Others": "#E74C3C",
  };

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

  const closeShareDialog = () => {
    setShareDialogOpen(false);
  };

  const handleClose = () => {
    setOpenNoteDialog(false);
    setIsEditMode(false);
  };

  const handleSave = () => {
    const requestData = {
      content: selectedNote.content,
      title: selectedNote.title,
      tag: selectedNote.tag,
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
      content: markdown,
    }));
  };



  const handleEditModeChange = () => {
    setIsEditMode(true);
  };



  return (
    <>
      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      )}

      <ShareDialog
        open={shareDialogOpen}
        handleClose={closeShareDialog}
        noteid={selectedNote.id}
        fetchData={fetchData}
      />

      <Dialog
        open={openNoteDialog}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xl"
        fullWidth
        disableBackdropClick
        disableEscapeKeyDown
        PaperProps={{
          style: {
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          },
        }}
      >
        <DialogTitle>
          <div className="note-details-header">
            <div className="note-title">
              <input
                type="text"
                disabled={!isEditMode}
                className={isEditMode ? "note-title-input" : "note-title-input-disabled"}
                value={selectedNote?.title}
                onChange={(e) =>
                  setSelectedNote((prevNote) => ({
                    ...prevNote,
                    title: e.target.value,
                  }))
                }
                placeholder="タイトル入力..."
                onFocus={(e) => (e.target.style.borderColor = "#007BFF")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />

<div className="note-tag">
  {isEditMode ? (
    <select
      id="tag"
      className="tag-selection"
      value={selectedNote.tag} 
      onChange={(e) => {
        const selectedTag = e.target.value;
        setSelectedNote((prevNote) => ({
          ...prevNote,
          tag: selectedTag,
        }));
      }}
    >
      <option value="University">University</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Important">Important</option>
      <option value="Study">Study</option>
      <option value="Meeting">Meeting</option>
      <option value="Project">Project</option>
    </select>
  ) : (
    <p
      className="tag"
      style={{
        backgroundColor: tagColors[selectedNote.tag] || '#E0E0E0',
      }}
    >
      {selectedNote.tag || "Undefined"}
    </p>
  )}
</div>

            </div>

            <div className="button-group">
              <Tooltip title={isEditMode ? "保存" : "編集"}>
                <button onClick={isEditMode ? handleSave : handleEditModeChange}>
                  {isEditMode ? (
                    <FaCheck size={30} color="orange" />
                  ) : (
                    <MdModeEdit size={30} color="green" />
                  )}
                </button>
              </Tooltip>
              <Tooltip title="閉じる">
                <button disabled={isEditMode} onClick={handleClose}>
                  <IoMdCloseCircleOutline size={30} color={isEditMode ? "white" : "red"} />
                </button>
              </Tooltip>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          <div className="note-details-body">
            <NoteEditor 
              noteContent={selectedNote.content}
              handleEditorChange={handleEditorChange}
              isEditMode={isEditMode}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteDetails;
