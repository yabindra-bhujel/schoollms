import React, { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import instance from "../../../../api/axios";
import SyllabusFrom from "./SyllabusFrom";

const SyllabusContainer = styled.div`
  margin-bottom: 30px;
`;

const SyllabusWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgb(226, 222, 222);
  border-radius: 10px;
`;

const AddButton = styled(Button)`
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background-color: #2196f3;
  border: none;
  color: white;

  &:hover {
    background-color: #1976d2;
  }
`;

const AccordionContainer = styled(Accordion)`
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const SectionDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const EditableDescription = styled.textarea`
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 10px;
`;

const Syllabus = () => {
  const { id } = useParams();
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSyllabus = async () => {
    const endpoint = `syllabus/subject/${id}/`;
    try {
      setLoading(true);
      const response = await instance.get(endpoint);
      console.log(response.data);
      setSyllabus(response.data[0].syllabus_items);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const handleEditToggle = (id) => {
    setEditMode(editMode === id ? null : id);
  };

  const handleDescriptionChange = (index, event) => {
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[index].section_description = event.target.value;
    setSyllabus(updatedSyllabus);
  };

  const handleSave = async (id) => {
    const editedSection = syllabus.find(section => section.id === id);
    try {
      setLoading(true);
      const endpoint = `/syllabus/update/${id}/`;
      const response = await instance.put(endpoint, editedSection);
      if(response.status === 200) {
        fetchSyllabus();
        setOpen(true);
        setMessage("Syllabus section has been updated successfully!");
      }
    } catch (error) {
      setOpen(true);
      setMessage("Error occurred while saving syllabus section");
    } finally {
      setLoading(false);
      setEditMode(null);
    }
  };

  if (loading) return <Snackbar open={true} message="Loading..." />;
  if (error) return <Snackbar open={true} message="Error occurred while fetching syllabus" />;

  return (
    <SyllabusContainer>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={message}
      />
      {syllabus?.map((section, index) => (
        <AccordionContainer key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <SectionTitle>{section.section_title}</SectionTitle>
            <div>
              <Button onClick={() => handleEditToggle(section.id)}>
                <FaEdit /> Edit
              </Button>
              {editMode === section.id && (
                <Button onClick={() => handleSave(section.id)}>
                  Save
                </Button>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {editMode === section.id ? (
              <EditableDescription
                value={section.section_description}
                onChange={(event) => handleDescriptionChange(index, event)}
              />
            ) : (
              <SectionDescription>{section.section_description}</SectionDescription>
            )}
          </AccordionDetails>
        </AccordionContainer>
      ))}
        <SyllabusFrom 
          courseId={id}
          fetchSyllabus={fetchSyllabus}
        />
    </SyllabusContainer>
  );
};

export default Syllabus;
