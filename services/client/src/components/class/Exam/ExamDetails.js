import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getExambyID, updateExma } from "./ExamService";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactQuill from "react-quill";
import "./style/examDetails.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ExamSubmission from "./ExamTable";

const ExamDetails = () => {
  const params = useParams();
  const examID = params.examID;
  const [examDetails, setExamDetails] = useState(null);
  const { t } = useTranslation();
  const [exmaupdateSuccess, setExmaupdateSuccess] = useState("");
  const [exmaupdateError, setExmaupdateError] = useState("");
  const [shortAnswerQuestions, setShortAnswerQuestions] = useState([]);
  const [lortAnswerQuestions, setLortAnswerQuestions] = useState([]);

  console.log(shortAnswerQuestions);
  console.log(lortAnswerQuestions);

  const toolbarOptions = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "removeFormat"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ font: [] }], // This line adds font style options
      [{ size: ["small", false, "large", "huge"] }], // Add this line for font size options
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const fetchData = () => {
    getExambyID(examID)
      .then((response) => {
        setExamDetails(response);
        setShortAnswerQuestions(response.short_answer_questions);
        setLortAnswerQuestions(response.long_answer_questions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [examID]);

  const handelupdateExma = async () => {
    try {
      const response = await updateExma(examID, examDetails);
      setExmaupdateSuccess(response);
      fetchData();
    } catch (error) {
      setExmaupdateError(error);
    }
  };

  const handleInputChange = (field, value) => {
    setExamDetails((prevsetExamDetails) => ({
      ...prevsetExamDetails,
      [field]: value,
    }));
  };

  const handleEditorChange = (content, editor) => {
    handleInputChange("description", content);
  };

  const renderQuestions = (questions) => {
    return questions.map((questionGroup) => (
      <div key={questionGroup.id}>
        {questionGroup.questions.map((q) => (
          <p className="items" key={q.id} dangerouslySetInnerHTML={{ __html: q.question }}></p>
        ))}
      </div>
    ));
  };

  return (
    <>
      <Layout>
        <div className="exam-details-container">
          <div className="exam-body">
            {examDetails ? (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">{examDetails.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="exam-details">
                    <div className="col">
                      <div className="row">
                        <label>{t("examD.startDate")}</label>
                        <input
                          type="text"
                          value={examDetails.start_date}
                          onChange={(e) => {
                            handleInputChange("start_date", e.target.value);
                          }}
                        />
                      </div>

                      <div className="row">
                        <label>{t("examD.endDate")}</label>
                        <input
                          type="text"
                          value={examDetails.end_date}
                          onChange={(e) => {
                            handleInputChange("end_date", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="col">
                      <div className="row">
                        <label>{t("examD.duration")}</label>
                        <input
                          type="text"
                          value={examDetails.duration}
                          onChange={(e) => {
                            handleInputChange("duration", e.target.value);
                          }}
                        />
                      </div>

                      <div className="row">
                        <label>{t("examD.maxGrade")}</label>
                        <input
                          type="text"
                          value={examDetails.max_grade}
                          onChange={(e) => {
                            handleInputChange("max_grade", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="editer">
                      <ReactQuill
                        theme="snow"
                        value={examDetails.description}
                        modules={{
                          toolbar: toolbarOptions.toolbar,
                        }}
                        onChange={handleEditorChange}
                      />
                    </div>

                    <div className="update-bnt">
                      <button onClick={handelupdateExma}>Update</button>
                    </div>



                    <div className="question-list">
                      <div className="questions-section">
                        <h3>{t("examD.shortAnswerQuestions")}</h3>
                        {shortAnswerQuestions.length > 0 ? (
                          renderQuestions(shortAnswerQuestions)
                        ) : (
                          <p>{t("examD.noShortAnswerQuestions")}</p>
                        )}
                        


                       
                      </div>

                      {/* Render long answer questions */}
                      <div className="questions-section">
                        <h3>{t("examD.longAnswerQuestions")}</h3>
                        {lortAnswerQuestions.length > 0 ? (
                          renderQuestions(lortAnswerQuestions)
                        ) : (
                          <p>{t("examD.noLongAnswerQuestions")}</p>
                        )}
        
                        
                        
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            ) : (
              <Typography>{t("examD.loading")}</Typography>
            )}
          </div>

          <div className="exma-submission-table">
            <h2>{t("examD.examlist")}</h2>
          <ExamSubmission/>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ExamDetails;
