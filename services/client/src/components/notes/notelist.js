import React, { useState } from "react";
import "./style/notelist.css";
import NoteDetails from "./NoteDetails";
import getUserInfo from "../../api/user/userdata";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { deleteNote } from "./NotesService";

const NoteList = ({ notes, fetchData, activeTab }) => {
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

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

  const parseHTML = (htmlString) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    return tempElement.textContent || tempElement.innerText || "";
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
                <div className="note-tag">
                  <p>University</p>
                </div>
                <div className="note-other-menu">
                  {isNoteOwner(note) && (
                    <button>
                      <MdOutlinePersonAddAlt
                        className="note-header-menu-btn"
                        size={20}
                        color="green"
                      />
                    </button>
                  )}
                  <button>
                    <MdModeEdit
                      className="note-header-menu-btn"
                      size={20}
                      color="blue"
                    />
                  </button>
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
                  });
                  setOpenNoteDialog(true);
                }}
                className="note-body"
              >
                <h3 className="note-title">{note.title}</h3>

                <div className="content-update">
                  <div className="content">
                    <p>
                      {note.content.length > 300 ? (
                        <span>
                          {`${parseHTML(note.content.substring(0, 300))}...`}
                        </span>
                      ) : (
                        <span>{parseHTML(note.content)}</span>
                      )}
                    </p>
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
