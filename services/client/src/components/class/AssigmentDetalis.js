import React, { useState, useEffect } from "react";
import "./style/AssigmentDetalis.css";
import { useParams, Link } from "react-router-dom";
import Layout from "../layout/Layout";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import DataTable from "./AssigmentSubmitTable";
import ReactQuill from "react-quill";
import "./style/AssigmentCreate.css";
import TextDataTable from "./TextSubmitTable";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from '@mui/material/IconButton';
import { IoIosCloseCircleOutline } from "react-icons/io";

const AssigmentDetalis = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState("submissionList");

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
  };

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
  const subject_code = params.courseID;
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
      const endpoint = `/assignments/update-assignment/${assignmentID}/`;
      const response = await instance.put(endpoint, assignment);
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
    handleInputChange("description", content);
  };

  useEffect(() => {
    getAssignmentData();
  }, []);

  const getAssignmentData = async () => {
    try {
      const endpoint = `assignments/teacher-assignment-detail/${assignmentID}/`;
      const response = await instance.get(endpoint);
      setAssignment(response.data);
      setSubmissions(response.data.submissions);
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
          <div className="assigment-details-header">
            <div className="submission-btns">
              <button
                onClick={() => handleMenuChange("submissionList")}
                className={`menu-btn ${activeMenu === "submissionList" ? "active-menu" : ""}`}
              >
                提出一覧
              </button>
              <button
                onClick={() => handleMenuChange("assigment")}
                className={`menu-btn ${activeMenu === "assigment" ? "active-menu" : ""}`}
              >
                課題詳細
              </button>
            </div>
            <Link to={`/class/${subject_code}`}>
          <IoIosCloseCircleOutline size={40} className="assigemnt-back-btn" />
        </Link>
          </div>

          {activeMenu === "submissionList" ? (
            <div className="assigment-submit-table">
              <h2>課題提出一覧</h2>
              {assignment.assigment_type === "File" && (
                <DataTable submissions={submissions} />
              )}
              {assignment.assigment_type === "Text" && (
                <TextDataTable submissions={submissions} />
              )}
            </div>
          ) : (
            <Accordion className="assigment-details-forms">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="assignment-body-content"
                id="assignment-body-header"
              >
                <Typography style={{ fontWeight: "bold" }} variant="h5">
                  {assignment.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="assigment-body">
                  <div className="assigment-form">
                    <label>{t("assignmentTitle")}</label>
                    <input
                      type="text"
                      value={assignment.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                    <div className="short-form">
                      <div className="assigemnt-type">
                        <label>{t("assignmentType")}</label>
                        <input
                          disabled
                          type="text"
                          value={assignment.assigment_type}
                        />
                      </div>
                      <div className="assigemnt-deadline">
                        <label>{t("assignmentDeadline")}</label>
                        <input
                          type="text"
                          value={assignment.formatted_assignment_deadline}
                        />
                      </div>
                      <label>{t("assignmentDescription")}</label>
                      <div className="editor">
                        <ReactQuill
                          theme="snow"
                          value={assignment.description}
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
                      {assignment.assigment_type === "Text" && (
                        <div className="assignment-question">
                          <Typography>{t("assignmentQuestion")}</Typography>
                          {question.map((questionItem, index) => (
                            <div className="item" key={index}>
                              <Typography
                                dangerouslySetInnerHTML={{
                                  __html: questionItem.question,
                                }}
                              />
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
          )}
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">確認</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            この質問を削除してもよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            キャンセル
          </Button>
          <Button
            onClick={() => {
              deleteQuestion(selectedQuestionId, handleClose);
            }}
            color="primary"
            autoFocus
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AssigmentDetalis;
