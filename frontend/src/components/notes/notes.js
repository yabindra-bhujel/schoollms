import React, { useState, useEffect } from "react";
import Layout from "../navigations/Layout";
import "./style/note.css";
import NoteList from "./notelist";
import { GoShieldLock } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi2";
import { FaList } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { getNotes, addNotes } from "./NotesService";
import getUserInfo from "../../api/user/userdata";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const Notes = () => {
  const username = getUserInfo().username;
  const [activeTab, setActiveTab] = useState("All");
  const [notes, setNotes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const maxNotesAllowed = 6;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateNote = () => {
    if (notes.length >= maxNotesAllowed) {
      setIsDialogOpen(true);
      return;
    }

    const newNote = {
      user: username,
      title: "Enter your note title here...",
      content: "Enter your note here...",
    };

    addNotes(newNote)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error creating new note: ", error);
      });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const fetchData = async () => {
    try {
      const notedata = await getNotes();
      setNotes(notedata);
    } catch (error) {
      console.error("Error fetching notes data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="nav-bar">
        <div className="nav-left">
          <ul className="node-ul">
            <li
              className={activeTab === "All" ? "note-active" : ""}
              onClick={() => handleTabClick("All")}
            >
              <FaList  className="icon"/>
              <span>All</span>
            </li>
            <li
              className={activeTab === "Private" ? "note-active" : ""}
              onClick={() => handleTabClick("Private")}
            >
              <GoShieldLock  className="icon" />
              <span>Private</span>
            </li>
            <li
              className={activeTab === "Shared" ? "note-active" : ""}
              onClick={() => handleTabClick("Shared")}
            >
              <HiUserGroup   className="icon"/>
              <span>Shared</span>
            </li>
          </ul>
        </div>
        <div className="nav-right">
          <button onClick={handleCreateNote} className="add-note-btn">
            <IoMdAdd className="add-icon" />
            <span> Add New Note</span>
          </button>
        </div>
      </div>

      <div className="note-body">
        <NoteList notes={notes} setNotes={setNotes} fetchData={fetchData} activeTab={activeTab} />
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Maximum Notes Limit Reached"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can only create up to {maxNotesAllowed} notes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Notes;
