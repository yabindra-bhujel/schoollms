import React, { useState, useEffect } from "react";
import "./style/notelist.css";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";
import { deleteNote, updateNoteTitle, updateNoteColor, getNotes  } from "./NotesService";
import { MdSaveAlt } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import ShareDialog from "./ShareNote";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import getUserInfo from "../../api/user/userdata";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";



const NoteList = ({ notes, setNotes, fetchData, activeTab }) => {
  const [originalNotes, setOriginalNotes] = useState([]);
  const [editedTitles, setEditedTitles] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const currentUser = getUserInfo().username;

  const isNoteOwner = (note) => {
    return note.owner === currentUser; 
  };



  // Method to handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Method to open Snackbar with a message
  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    // set time out in 3 second
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


  useEffect(() =>{
    const interval = setInterval(() => {
      getNotes(currentUser);
    }, 60000);
    return () => clearInterval(interval);
  })


  useEffect(() => {
    setOriginalNotes([...notes]);
  }, [notes]);



  const handleTitleChange = (index, newTitle) => {
    const updatedNotesArray = [...notes];
    updatedNotesArray[index].title = newTitle;
    setNotes(updatedNotesArray);

    setEditedTitles((prevTitles) => ({
      ...prevTitles,
      [index]: {
        id: notes[index].id,
        title: newTitle,
      },
    }));
  };

  const findTitleById = (data, id) => {
    const dataArray = Array.isArray(data) ? data : Object.values(data);

    const foundNote = dataArray.find((note) => note.id === id);
    return foundNote ? foundNote.title : null;
  };

  const autoUpdate = (noteID) => {
    const titleValue = findTitleById(Object.values(editedTitles), noteID);

    updateNoteTitle(noteID, titleValue)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating note: ", error);
      });
  };

  const handleColorChange = (index, color) => {
    const noteId = notes[index].id;
    setSelectedColors(prevColors => ({
      ...prevColors,
      [noteId]: color,
    }));

    updateNoteColor(noteId, color)
      .then(() => {
        fetchData(); // Fetch updated data from the server
      })
      .catch((error) => {
        console.error("Error updating note color: ", error);
      });
};



  const filteredNotes = () => {
    if (activeTab === "All") {
      return notes;
    } else {
      return notes.filter(
        (note) => note.note_type.toLowerCase() === activeTab.toLowerCase()
      );
    }
  };

  const parseHTML = (htmlString) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    return tempElement.textContent || tempElement.innerText || "";
  };

  return (
    <div>
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <div className="note-list">
        <div className="note-card">
          {filteredNotes().map((note, index) => (
            <div
              className="note-item"
              key={index}
              style={{ backgroundColor: note.color || "" }}
            >
              <div className="note-item-header">
                <small>{note.date}</small>
              </div>

              <h3
                contentEditable
                onBlur={(e) => handleTitleChange(index, e.target.textContent)}
                style={{
                  maxHeight: "1.5em",
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                }}
              >
                {note.title}
              </h3>

              <div className="content-update">
                <div className="content">
                  <p>
                    <Link to={`/textediter/${note.id}`}>
                      {note.content.length > 140 ? (
                        <span>
                          {`${parseHTML(note.content.substring(0, 140))}...`}
                        </span>
                      ) : (
                        <span>{parseHTML(note.content)}</span>
                      )}
                    </Link>
                  </p>
                </div>
                <div className="update">
                  <button onClick={() => autoUpdate(note.id)}>
                    <MdSaveAlt className="save-icon" />
                  </button>

                  {isNoteOwner(note) &&(
                    <IconButton
                    aria-label="delete"
                    onClick={() => {
                      deleteNote(note.id)
                        .then(() => {
                          fetchData();
                        })
                        .catch((error) => {
                          console.error("Error deleting note: ", error);
                        });
                    }}
                    style={{ marginRight: 8, color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>

                  
                  )}



                  {isNoteOwner(note) &&(
                    <button className="share-btn" onClick={() => openShareDialog(note.id)}>
                    <IoMdPersonAdd className="share-icon" />
                  </button>

                  )}

                    



{isNoteOwner(note) && (
                    <div className="color-input">
                      <div className="custom-color-input">
                        <input
                          type="color"
                          id={`colorInput-${index}`}
                          value={selectedColors[index] || ""}
                          onChange={(e) =>
                            handleColorChange(index, e.target.value)
                          }
                        />
                        <div
                          className="color-swatch"
                          style={{
                            backgroundColor: selectedColors[index] || "#ffffff",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}



                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ShareDialog
  open={shareDialogOpen}
  handleClose={closeShareDialog}
  noteid={selectedNoteId}
  onUsersAdded={openSnackbar}
  fetchData = {fetchData}
/>
    </div>
  );
};

export default NoteList;
