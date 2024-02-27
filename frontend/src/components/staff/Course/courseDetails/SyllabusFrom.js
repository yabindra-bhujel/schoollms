import React, { useState } from "react";
import { TextField, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Delete as DeleteIcon } from "@mui/icons-material";
import instance from "../../../../api/axios";
import Snackbar from "@mui/material/Snackbar";

const SyllabusForm = ({ courseId, fetchSyllabus }) => {
  const [sections, setSections] = useState([{ title: "", description: "" }]);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, { title: "", description: "" }]);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const sectionsData = sections.map(section => ({
        section_title: section.title,
        section_description: section.description,
      }));
      const response = await instance.post(`/course/create_syllabus/${courseId}/`, sectionsData);
      if (response.status === 201) {
        setSnackbarMessage("Syllabus sections added successfully");
        setOpenSnackbar(true);
        setSections([{ title: "", description: "" }]);
        fetchSyllabus();
      }
    } catch (error) {
      console.error("Error adding syllabus sections:", error);
      setSnackbarMessage("Error occurred while adding syllabus sections");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {!showForm && (
        <Button style={{ margin: "10px" }} variant="contained" color="primary" onClick={() => setShowForm(true)}>
      <form onSubmit={handleSubmit}>
        {sections.map((section, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{section.title ? section.title : `Section ${index + 1}`}</Typography>
              <Button onClick={() => removeSection(index)}><DeleteIcon /></Button>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={section.title}
                onChange={(e) => handleInputChange(index, "title", e.target.value)}
                required
                margin="normal"
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={section.description}
                onChange={(e) => handleInputChange(index, "description", e.target.value)}
                required
                margin="normal"
              />
            </AccordionDetails>
          </Accordion>
        ))}
        <Button style={{ margin: "10px" }} variant="contained" color="primary" onClick={addSection}>
          Add Section
        </Button>
      )}
      {showForm && (
        <form onSubmit={handleSubmit}>
          {sections.map((section, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{section.title ? section.title : `Section ${index + 1}`}</Typography>
                <Button onClick={() => removeSection(index)}><DeleteIcon /></Button>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={section.title}
                  onChange={(e) => handleInputChange(index, "title", e.target.value)}
                  required
                  margin="normal"
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={section.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  required
                  margin="normal"
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <Button style={{ margin: "10px" }} variant="contained" color="primary" onClick={addSection}>
            Add Section
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || sections.some(section => !section.title || !section.description)}
            style={{ margin: "10px" }}
          >
            {loading ? "Adding..." : "Upload Syllabus"}
          </Button>
        </form>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default SyllabusForm;
