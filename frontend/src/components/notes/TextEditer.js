import React, { useState, useEffect } from "react";
import Layout from "../navigations/Layout";
import "./style/editer.css";
import { getNotesbyID, updatedNotes } from "./NotesService";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";

export default function TextEditer() {
    const [notes, setNotes] = useState({ content: '' });
    const [loading, setLoading] = useState(true);
    const [initialContent, setInitialContent] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (notes.content !== initialContent) {
                const message = "You have unsaved changes. Are you sure you want to leave?";
                event.returnValue = message;
                return message;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [notes.content, initialContent]);

    const fetchData = async () => {
        try {
            const notedata = await getNotesbyID(id);
            setNotes(notedata);
            setInitialContent(notedata.content);
        } catch (error) {
            console.error("Error fetching notes data: ", error);
            // Handle the error, e.g., display an error message or redirect to an error page
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        updatedNotes(id, { content: notes.content })
            .then(() => {
                navigate("/notes");
                setInitialContent(notes.content);
            })
            .catch((error) => {
                console.error("Error updating note: ", error);
            });
    };
    const toolbarOptions = {
      toolbar: [
          // Text formatting options
          ['bold', 'italic', 'underline', 'strike'], // Basic formatting
          ['removeFormat'], // Clear formatting
  
          // Lists and alignment
          [{ list: 'ordered'}, { list: 'bullet' }], // Lists
          [{ align: [] }], // Text alignment
  
          // Hyperlinks and media
          ['link'], // Hyperlinks
          ['image'], // Upload image
          // Custom buttons
          [{ 'indent': '-1'}, { 'indent': '+1' }], // Outdent/indent
          [{ 'direction': 'rtl' }], // Text direction


          // Tables
         
  
          // Custom font sizes and families (optional based on needs)
          [{ 'font': [] }],  // Font family dropdown
  
          // Additional options (consider based on your app's needs)
          ['blockquote', 'code-block'], // Block-level formatting
          [{ 'color': [] }, { 'background': [] }], // Text color and background
      ],
  };
  
  
  
    return (
        <Layout>
            <div className="text-editer-body">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{ height: 'calc(100vh - 250px)' }} className="text-editer">
                        <ReactQuill
                            
                            theme="snow"
                            value={notes.content}
                            onChange={(content) => setNotes({ ...notes, content })}
                            modules={{ toolbar: toolbarOptions.toolbar }}
                        />
                        <button onClick={handleSave} className="original-button">Save</button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
