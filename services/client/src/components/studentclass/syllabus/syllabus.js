import React, { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from "styled-components";
import instance from "../../../api/axios";
import { useParams } from "react-router-dom";
import { Snackbar } from "@mui/material";
import AccordionDetails from '@mui/material/AccordionDetails';


const SyllabusContainer = styled.div`
  margin-bottom: 30px;
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
    const params = useParams();
    const subject_code = params.id;
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");


  const fetchSyllabus = async () => {
    const endpoint = `/syllabus/subject/${subject_code}/`;

    try {
      setLoading(true);
      const response = await instance.get(endpoint);
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
            </div>

          </AccordionSummary>
          <AccordionDetails>
              <SectionDescription>{section.section_description}</SectionDescription>
          </AccordionDetails>
        </AccordionContainer>
      ))}
    </SyllabusContainer>
  );
};

export default Syllabus;
