import React, { useState, useEffect } from "react";
import "./style/AssigmentDetalis.css";
import { useParams } from "react-router-dom";
import Layout from "../navigations/Layout";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import DataTable from "./AssigmentSubmitTable";
import ReactQuill from "react-quill";
import "./style/AssigmentCreate.css";
import TextDataTable from "./TextSubmitTable";
import {Accordion,AccordionSummary,AccordionDetails,Typography,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Button,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from '@mui/material/IconButton';




const AssigmentDetalis = () => {
  const { t } = useTranslation();

  const toolbarOptions = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "removeFormat"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const params = useParams();
  const assignmentID = params.assignmentID;
  const [assignment, setAssignment] = useState([]);
  const [message, setMessage] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [question, setQquestion] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [open, setOpen] = useState(false);

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
        setMessage("問題が正常に削除されました");
        setOpen(true);
        setTimeout(() => {
          setMessage(null);
          setOpen(false);
        }, 3000);
      }
    } catch (error) {
      setMessage("問題の削除中にエラーが発生しました");
      setOpen(true);
      setTimeout(() => {
        setMessage(null);
        setOpen(false);
      }, 3000);
    } finally {
      callback(); 
    }
  };

  const updateAssigemntData = async () => {
    try {
      const endpoint = `/course/upadteAssigemnt/`;
      const response = await instance.post(endpoint, assignment);
      if (response.status === 200) {
        getAssignmentData();
        setOpen(true);
        setMessage("課題更新されました。");
        setTimeout(() => {
          setMessage(null);
          setOpen(false);
        }, 3000);
      } else {
        setMessage("課題の更新中にエラーが発生しました。");
        setTimeout(() => {
          setMessage(null);
          setOpen(false);
        }, 3000);
      }
    } catch {
      setMessage("課題の更新中にエラーが発生しました。");
        setTimeout(() => {
          setMessage(null);
          setOpen(false);
        }, 3000);
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
      setMessage("課題のデータを取得中にエラーが発生しました。");
      setOpen(true);
      setTimeout(() => {
        setMessage(null);
        setOpen(false);
      }, 3000);
    }
  };

  return (
    <Layout>
      <div className="assigemnt-submission">
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          message={message}
        />

        <div className="assigment-section">
          <Accordion className="assigment-details-forms">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="assignment-body-content"
              id="assignment-body-header"
            >
              <Typography style={{fontWeight: "bold"}} variant="h5">{assignment.assignment_title}</Typography>
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
                      disabled
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
                          minHeight: "100px",
                          maxHeight: "300px",
                          border: "none",
                        }}
                      />
                    </div>

                    {assignment.assignment_type === "Text" && (
                    <div className="assignment-question">
                      <Typography>{t("assignmentQuestion")}</Typography>
                      {question.map((questionItem, index) => (
                        <div className="item" key={index}>
                          <Typography dangerouslySetInnerHTML={{ __html: questionItem.question }} />
                          <IconButton onClick={() => handleClickOpen()}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      ))}
                    </div>
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
            <h2>{t("assigemnttabletitile")}</h2>
            {assignment.assignment_type === "File" && (
              <DataTable submissions={submissions} />
            )}
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
