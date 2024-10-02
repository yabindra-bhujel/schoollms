import React, { useState } from "react";
import "./style/notelist.css";
import NoteDetails from "./NoteDetails";
import getUserInfo from "../../api/user/userdata";

const NoteList = ({ notes, fetchData, activeTab }) => {
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);



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
            <div
              onClick={() => {
                setSelectedNote({
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  owner: note.owner,
                  collaborators: note.collaborators,
                  type: note.note_type
                });
                setOpenNoteDialog(true);
              }}

              className="note-item"
              key={index}
              style={{ backgroundColor: note.color || "" }}
            >
              <h3
                onClick={() => {
                  setSelectedNote({
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    owner: note.owner,
                    collaborators: note.collaborators,
                    type: note.note_type
                  });
                  setOpenNoteDialog(true);
                }}
                className="note-title"
              >
                {note.title}
              </h3>

              <div className="content-update">
                <div
                  onClick={() => {
                    setSelectedNote({
                      id: note.id,
                      title: note.title,
                      content: note.content,
                      owner: note.owner,
                      collaborators: note.collaborators,
                      type: note.note_type
                    });
                    setOpenNoteDialog(true);
                  }}
                  className="content">
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

          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteList;
