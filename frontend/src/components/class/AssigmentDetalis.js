import React, { useState, useEffect } from "react";
import "./style/AssigmentDetalis.css";
import { useParams } from "react-router-dom";
import Layout from "../navigations/Layout";
import instance from "../../api/axios";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";
import DataTable from "./AssigmentSubmitTable";
import ReactQuill from "react-quill";
import "./style/AssigmentCreate.css";
import { CiCircleRemove } from "react-icons/ci";
import TextDataTable from "./TextSubmitTable";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

Modal.setAppElement("#root");

const AssigmentDetalis = () => {
  const { t } = useTranslation();

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

  const params = useParams();
  const assignmentID = params.assignmentID;
  const [assignment, setAssignment] = useState([]);
  const [openDetailModelIndex, setOpenDetailModelIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [submissions, setSubmissions] = useState([]);
  const [question, setQquestion] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const deleteQuestion = async (questionID, callback) => {
    try {
      const endpoint = `/course/delete_assigemnt_question/${questionID}`;
      const response = await instance.delete(endpoint);
      if (response.status === 200) {
        getAssignmentData();
        setSuccessMessage("Question deleted successfully");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("Failed to delete question");
    } finally {
      callback(); // Close the dialog after deletion
    }
  };

  const updateAssigemntData = async () => {
    try {
      const endpoint = `/course/upadteAssigemnt/`;
      const response = await instance.post(endpoint, assignment);
      if (response.status === 200) {
        console.log("success");
        getAssignmentData();
        setSuccessMessage("Assignment updated successfully");

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.log("error");
        setSuccessMessage("Failed to update assignment");
      }
    } catch {
      console.log("error");
      setSuccessMessage("An error occurred while updating assignment");
    }
  };
  const handleInputChange = (field, value) => {
    setAssignment((prevAssignment) => ({
      ...prevAssignment,
      [field]: value,
    }));
  };

  const handleEditorChange = (content, editor) => {
    handleInputChange("assignment_description", content);
  };

  const openDetailModel = (index) => {
    setOpenDetailModelIndex(index);
  };

  const closeDetailModel = () => {
    setOpenDetailModelIndex(null);
  };

  useEffect(() => {
    getAssignmentData();
  }, []);

  const getAssignmentData = async () => {
    try {
      const endpoint = `/course/assigment_detalis/${assignmentID}/`;
      const response = await instance.get(endpoint);
      const student = response.data.students;
      setAssignment(response.data);
      setSubmissions(response.data.submissions);
      console.log(response.data.submissions);
      setQquestion(response.data.questions);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getFileNameFromURL = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <Layout>
      <div className="assigemnt-submission">
        <Stack sx={{ width: "100%" }} spacing={2}>
          {successMessage && (
            <Alert variant="outlined" severity="success">
              <p>{t("successMessage")}</p>
            </Alert>
          )}
        </Stack>

        <div className="assigment-section">
          <Accordion className="assigment-details-forms">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="assignment-body-content"
              id="assignment-body-header"
            >
              <Typography variant="h5">{assignment.assignment_title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="assigment-body">
                <div className="assigment-form">
                  <label>{t("assignmentTitle")}</label>
                  <input
                    type="text"
                    value={assignment.assignment_title}
                    onChange={(e) =>
                      handleInputChange("assignment_title", e.target.value)
                    }
                  />

                  <div className="short-form">
                    <div className="assigemnt-type">
                      <label>{t("assignmentType")}</label>
                      <input
                        type="text"
                        value={assignment.assignment_type}
                        onChange={(e) =>
                          handleInputChange("assignment_type", e.target.value)
                        }
                      />
                    </div>

                    <div className="assigemnt-deadline">
                      <label>{t("assignmentDeadline")}</label>
                      <input
                        type="text"
                        value={assignment.formatted_assignment_deadline}
                        onChange={(e) =>
                          handleInputChange(
                            "formatted_assignment_deadline",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <label>{t("assignmentDescription")}</label>
                    <div className="editor">
                      <ReactQuill
                        theme="snow"
                        value={assignment.assignment_description}
                        onChange={handleEditorChange}
                        modules={{
                          toolbar: toolbarOptions.toolbar,
                        }}
                        style={{
                          height: "300px",
                          border: "none",
                        }}
                      />
                    </div>

                    {assignment.assignment_type == "Text" && (
                      <>
                        {assignment.assignment_type === "Text" && (
                          <div className="assignment-question">
                            <label>{t("assignmentQuestion")}</label>
                            {question.map((questionItem, index) => (
                              <div className="item" key={index}>
                                <div className="question">
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: questionItem.question,
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedQuestionId(questionItem.id);
                                    handleClickOpen();
                                  }}
                                >
                                  <CiCircleRemove className="remove-icon" />
                                  <span className="tooltip-text">
                                    {t("deleteQuestionhover")}
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div onClick={updateAssigemntData} className="update-btn">
                  <button>{t("saveChange")}</button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          <div className="assigment-submit-table">
            {/* Submission Table */}
            <h2>{t("assigemnttabletitile")}</h2>
            {/* if submision type file */}
            {assignment.assignment_type === "File" && (
              <DataTable submissions={submissions} />
            )}
            {/* if submision type text */}
            {assignment.assignment_type === "Text" && (
              <TextDataTable submissions={submissions} />
            )}
            
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("confirmDeletion.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("confirmDeletion.description")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("confirmDeletion.cancel")}</Button>
          <Button
            onClick={() => deleteQuestion(selectedQuestionId, handleClose)}
            autoFocus
          >
            {t("confirmDeletion.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AssigmentDetalis;
