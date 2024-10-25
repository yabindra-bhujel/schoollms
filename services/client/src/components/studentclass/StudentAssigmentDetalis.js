import React, { useRef, useState, useEffect } from "react";
import "./style/AssigmentDetalis.css";
import { Link, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import { MdArrowBack } from "react-icons/md";
import instance from "../../api/axios";
import { BiSolidSend } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import getUserInfo from "../../api/user/userdata";
import { AiFillFilePdf } from "react-icons/ai";
import AnswerFrom from "./AswerInputArea";
import ReactQuill from "react-quill";
import { useTranslation } from "react-i18next";
import { Snackbar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { RiDeleteBin6Line } from "react-icons/ri";

const StudentAssigmentDetalis = () => {
  const userid = getUserInfo();
  const user = userid.username;
  const { id } = useParams();
  const { assignmentId, courseId } = useParams();
  const [assignment, setAssignment] = useState([]);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState([]);
  const [textsubmission, setTextsubmission] = useState("");
  const [localTextSubmission, setLocalTextSubmission] = useState("");
  const [fileUploadMessage, setFileUploadMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitedFiles, setSubmitedFiles] = useState([]);

  const makeTextSubmission = async () => {
    try {
      const endpoint = `/assignments/create-text-assignment/`;
      const data = {
        student: user,
        assignment_id: assignmentId,
        answers: answers.map((answer, index) => ({
          question_id: questions[index].id,
          answer: answer,
        })),
      };
      setIsLoading(true);
      const response = await instance.post(endpoint, data);
      if (response.status === 201) {
        window.history.back();
      }
    } catch {
      setMessage(
        "リクエスト失敗しました。しばらくしてからもう一度お試しください。"
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const makeFileSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("student", user);
      formData.append("assignment_id", assignmentId);
      file.forEach((file) => {
        formData.append("file_submission", file);
      });
      const endpoint = `assignments/create-file-assignment/`;
      setIsLoading(true);
      const response = await instance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201 || response.status === 200) {
        getAssignmentData();
        setFile([]);
      }
    } catch (e) {
      setMessage(
        "リクエスト失敗しました。しばらくしてからもう一度お試しください。"
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const isInputEmpty = () => {
    if (assignment.assignment_type === "File") {
      return file.length === 0;
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    const validFiles = Array.from(selectedFiles).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      setFile((prevFiles) => [...prevFiles, ...validFiles]);
      setFileUploadMessage("");
    } else {
      setFileUploadMessage(t("studentAssigemnt.fileerror"));
      setTimeout(() => {
        setFileUploadMessage("");
      }, 2000);
    }
  };

  const handleFileDelete = (indexToDelete) => {
    setFile((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToDelete)
    );
  };

  useEffect(() => {
    getAssignmentData();
  }, []);
  const getAssignmentData = async () => {
    try {
      const endpoint = `assignments/student-assignment-detail/${assignmentId}/`;
      setIsLoading(true);
      const response = await instance.get(endpoint);
      setAssignment(response.data);
      setQuestions(response.data.questions || []);
      setAnswers(
        response.data.questions.map((question) => question.answer || "")
      );

      const file_submissions = response.data.file_submissions || [];
      setSubmitedFiles(file_submissions);
    } catch {
      setMessage(
        "データを取得できませんでした。しばらくしてからもう一度お試しください。"
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const endpoint = `assignments/delete_assigment_file/${fileId}/`;
      setIsLoading(true);
      const response = await instance.delete(endpoint);
      if (response.status === 204) {
        setSubmitedFiles(submitedFiles.filter((file) => file.id !== fileId));
      }
    } catch {
      setMessage(
        "ファイルの削除に失敗しました。しばらくしてからもう一度お試しください。"
      );
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const haveValidAnswer = () => {
    return answers.every((answer) => answer !== null && answer !== "");
  };

  const currentDate = new Date();
  const deadline = new Date(assignment.assignment_deadline);

  const isDeadlinePassed = currentDate > deadline;

  console.log(submitedFiles);

  return (
    <Layout>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={message}
        onClose={() => setOpen(false)}
      />

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="assigemt-details-student">
            <div className="class-header-student">
              <Link to={`/studentclassdetails/${courseId}`}>
                <MdArrowBack className="back" />
              </Link>
              <p>{assignment.title}</p>
            </div>
            <div className="assigment-section-student">
              <div className="assigment-body-st">
                <div className="body-st">
                  <div
                    className="body-st"
                    dangerouslySetInnerHTML={{ __html: assignment.description }}
                  />
                </div>

                <div className="assigment-input">
                  {assignment.assigment_type === "File" ? (
                    <>
                      <div className="file-attagement">
                        {assignment.is_active && (
                          <>
                            <button
                              className="button"
                              onClick={handleFileButtonClick}
                            >
                              <FiPlusCircle className="add-btn" />
                              <span>{t("studentAssigemnt.drag")}</span>
                              <span>{t("studentAssigemnt.maxFile")}</span>
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                              multiple
                            />
                          </>
                        )}

                        <div className="file-items">
                          {submitedFiles.length > 0 && (
                            <ul className="file-list">
                              {submitedFiles.map((fileUrl, index) => {
                                const filename = fileUrl.files.split("/").pop();

                                return (
                                  <li key={index}>
                                    <div className="fielname-size">
                                      {assignment.is_active && (
                                        <button
                                          onClick={() => deleteFile(fileUrl.id)}
                                          className="file-remove"
                                        >
                                          <RiDeleteBin6Line
                                            className="file-delete-icons"
                                            size={30}
                                          />
                                        </button>
                                      )}
                                      <p>
                                        <a
                                          href={fileUrl}
                                          download={filename}
                                          className="file-link"
                                        >
                                          {filename}
                                        </a>
                                      </p>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>

                        <div className="file-items">
                          {file.length > 0 && (
                            <ul className="file-list">
                              {file.map((file, index) => (
                                <li key={index}>
                                  <div className="fielname-size">
                                    <AiFillFilePdf className="file-icon" />
                                    <p>
                                      {" "}
                                      {file.name} <br />
                                      <span>
                                        {file && file.size
                                          ? (file.size / (1024 * 1024)).toFixed(
                                              2
                                            )
                                          : 0}{" "}
                                        MB
                                      </span>
                                    </p>
                                  </div>
                                  {assignment.is_active && (
                                    <button>
                                      <IoMdRemoveCircleOutline
                                        onClick={() => handleFileDelete(index)}
                                        className="btn-icon"
                                      />
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="fileerror">{fileUploadMessage}</p>
                        </div>
                      </div>
                      <div className="file-bottom-button">
                        {assignment.is_active && (
                          <button
                            className={`submit-file ${
                              isInputEmpty() ? "disabled-button" : ""
                            }`}
                            disabled={isInputEmpty()}
                            onClick={makeFileSubmission}
                          >
                            <span>提出</span>
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {questions.map((question, index) => (
                        <div key={question.id}>
                          <p className="question-title">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: question.question,
                              }}
                            />
                          </p>
                          <div className="answer-input">
                            <AnswerFrom
                              value={answers[index]}
                              onChange={(value) =>
                                handleAnswerChange(index, value)
                              }
                              isDeadlinePassed={assignment.is_active}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="bottom-button">
                        {assignment.is_active && (
                          <>
                            <button
                              className="submit-button"
                              onClick={makeTextSubmission}
                              disabled={!haveValidAnswer()}
                            >
                              <span>{t("studentAssigemnt.submit")}</span>
                              <BiSolidSend className="submit-icon" />
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};
export default StudentAssigmentDetalis;
