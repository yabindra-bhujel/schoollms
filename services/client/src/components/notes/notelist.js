import React, { useState } from "react";
import "./style/notelist.css";
import NoteDetails from "./NoteDetails";
import getUserInfo from "../../api/user/userdata";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { deleteNote } from "./NotesService";
import MarkdownEditor from "@uiw/react-markdown-editor";
import ShareDialog from "./ShareNote";

const NoteList = ({ notes, fetchData, activeTab }) => {
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isPrivateNote, setIsPrivateNote] = useState();

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

  const closeShareDialog = () => {
    setShareDialogOpen(false);
  };

  const isNoteOwner = (note) => {
    const isOwner = note.owner === getUserInfo().username;
    return isOwner;
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

  const handleOpenShareDialog = (noteId, noteType) => {
    setIsPrivateNote(null);

    if(noteType === 'private'){
      setIsPrivateNote(true);
    } else {
      setIsPrivateNote(false);
    }

    setSelectedNoteId(noteId);
    setShareDialogOpen(true);
  };

  const formattedDate = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear().toString().slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <ShareDialog
        open={shareDialogOpen}
        handleClose={closeShareDialog}
        noteid={selectedNoteId}
        fetchData={fetchData}
        isPrivateNote={isPrivateNote}
        setIsPrivateNote={setIsPrivateNote}
      />

      <NoteDetails
        openNoteDialog={openNoteDialog}
        setOpenNoteDialog={setOpenNoteDialog}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        notes={notes}
        fetchData={fetchData}
      />

      <div className="note-list">
        <div className="note-card">
          {filteredNotes().map((note, index) => (
            <div className="note-item" key={index}>
              <div className="note-header">
                <div className="note-tag" 
                  style={{
                    backgroundColor: tagColors[note.tag] || '#E0E0E0',
                  }}
                >
                  <p>{note.tag || "Undefind"}</p>
                </div>
                <div className="note-other-menu">
                  {isNoteOwner(note) && (
                    <button
                      onClick={() => {
                        handleOpenShareDialog(note.id, note.note_type);
                      }}
                    >
                      <MdOutlinePersonAddAlt
                        className="note-header-menu-btn"
                        size={20}
                        color="green"
                      />
                    </button>
                  )}
                  {isNoteOwner(note) && (
                    <button
                      onClick={() => {
                        deleteNote(note.id)
                          .then(() => {
                            fetchData();
                          })
                          .catch((error) => {});
                      }}
                    >
                      <RiDeleteBin5Line
                        className="note-header-menu-btn"
                        size={20}
                        color="red"
                      />
                    </button>
                  )}
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedNote({
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    owner: note.owner,
                    collaborators: note.collaborators,
                    type: note.note_type,
                    tag: note.tag,
                  });
                  setOpenNoteDialog(true);
                }}
                className="note-body"
              >
                <h3 className="note-title">
                  {note.title.substring(0, 50)}
                </h3>

                <div className="content-note">
                  <div data-color-mode="light">
                    <MarkdownEditor.Markdown
                      source={note.content}
                      height="auto"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="note-card-footer">
                <small>{formattedDate(note.date)}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteList;
