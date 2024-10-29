import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import "./style/note.css";
import NoteList from "./notelist";
import { GoShieldLock } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi2";
import { FaList } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { getNotes, addNotes } from "./NotesService";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { debounce } from "lodash";

const Notes = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const maxNotesAllowed = 10;
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      const notedata = await getNotes();
      setNotes(notedata);
      setFilteredNotes(notedata); 
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = debounce((text) => {
    setFilteredNotes(
      notes.filter((note) => note.title.toLowerCase().includes(text.toLowerCase()))
    );
  }, 300);

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText, notes]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateNote = () => {
    if (notes.length >= maxNotesAllowed) {
      setIsDialogOpen(true);
      return;
    }

    const newNote = {
      title: "ノートのタイトル...",
      content: "ノートの詳細...",
    };

    addNotes(newNote)
      .then(() => fetchData())
      .catch((error) => {
        console.error("Error creating new note: ", error);
      });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="note-component-header">
        <div className="top-bar">
          <div className="nav-search">
            <IoSearch className="search-icon" />
            <input 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              placeholder="Search notes title..."
            />
          </div>
          <div className="nav-right">
            <button onClick={handleCreateNote} className="add-note-btn">
              <IoMdAdd className="add-icon" />
              <span>新規ノート</span>
            </button>
          </div>
        </div>

        <div className="tab-bar">
          <ul className="note-ul">
            <li className={activeTab === "All" ? "note-active" : ""} onClick={() => handleTabClick("All")}>
              <FaList className="icon" />
              <span>All</span>
            </li>
            <li className={activeTab === "Private" ? "note-active" : ""} onClick={() => handleTabClick("Private")}>
              <GoShieldLock className="icon" />
              <span>Private</span>
            </li>
            <li className={activeTab === "Shared" ? "note-active" : ""} onClick={() => handleTabClick("Shared")}>
              <HiUserGroup className="icon" />
              <span>Shared</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="note-body">
        <NoteList notes={filteredNotes} setNotes={setNotes} fetchData={fetchData} activeTab={activeTab} />
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
          <Button onClick={handleCloseDialog} color="primary" autoFocus>Okay</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Notes;
