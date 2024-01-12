import React, { useRef, useState, useEffect } from "react";
import "./style/AssigmentDetalis.css";
import { Link, useParams } from "react-router-dom";
import Layout from "../navigations/Layout";
import { MdArrowBack } from "react-icons/md";
import instance from "../../api/axios";
import { CiSaveDown2 } from "react-icons/ci";
import { BiSolidSend } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import getUserInfo from "../../api/user/userdata";
import { AiFillFilePdf } from "react-icons/ai";
import AnswerFrom from "./AswerInputArea";
import ReactQuill from "react-quill";
import { useTranslation } from "react-i18next";



const StudentAssigmentDetalis = () => {
  const userid = getUserInfo();
  const user = userid.username;
  const { id } = useParams();
  const [assignment, setAssignment] = useState([]);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState([]);
  const [textsubmission, setTextsubmission] = useState("");
  const [localTextSubmission, setLocalTextSubmission] = useState(""); // Local state for text submission
  const [totalTimeSpend, setTotalTimeSpend] = useState(0);
  const [fileUploadMessage, setFileUploadMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const { t } = useTranslation();


  const MakeTextSubmission = async () => {
    try {
      const endpoint = `/course/text_assignment/`;
      const data = {
        student: user,
        assignment_id: id,
        answers: answers.map((answer, index) => ({
          question_id: questions[index].id,
          answer: answer,
        })),
      };
      const response = await instance.post(endpoint, data);
    } catch {
      console.log("error");
    }
  };



  const MakeFileSubmission = async () => {
    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append("student", user);
      formData.append("assignment_id", id);
      file.forEach((file) => {
        formData.append("file_submission", file);
      });
      const endpoint = `/course/file_assigment/`;
      const response = await instance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      console.log("response", response.data);
    } catch (e) {
      console.log("error", e);
    }
  };


  const isInputEmpty = () => {
    if (assignment.assignment_type === "File") {
      return file.length === 0;
    } 
  };

  // Event handler for "Save" button to update local state
  const handleSave = () => {
    setLocalTextSubmission(textsubmission);
  };

  const handleFileButtonClick = () => {
    // Trigger the file input dialog when the button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;

    // Check each selected file's size
    const validFiles = Array.from(selectedFiles).filter(
      (file) => file.size <= 10 * 1024 * 1024
    ); // 10MB limit

    if (validFiles.length > 0) {
      // Append the valid files to the existing ones in the state
      setFile((prevFiles) => [...prevFiles, ...validFiles]);
      setFileUploadMessage(""); // Clear any previous error message
    } else {
      // Display an error message if the selected files exceed the size limit
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
      const endpoint = `/course/student_assignment_details/${id}/`;
      const response = await instance.get(endpoint);
      console.log("response", response.data);
      setAssignment(response.data);
      setQuestions(response.data.questions || []);
      setAnswers(Array(response.data.questions.length).fill(""));
    } catch {
      console.log("error");
    }
  };

  // Update answers when the user inputs an answer
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };



  return (
    <Layout>
      <div className="assigemt-details-student">
        <div className="class-header-student">

          <Link to="/studentclass/">
            <MdArrowBack className="back" />
          </Link>
          <p>{assignment.assignment_title}</p>
        </div>
        <div className="assigment-section-student">
          <div className="assigment-body-st">
         
            <div className="body-st">
              <ReactQuill
                value={assignment.assignment_description}
                readOnly={true}

              />
              </div>

            <div className="assigment-input">
              {assignment.assignment_type === "File" ? (
                <>
                  <div className="file-attagement">
                    <button className="button" onClick={handleFileButtonClick}>
                      <FiPlusCircle className="add-btn" />
                      <span>{t("studentAssigemnt.drag")}</span>
                      <span>{t("studentAssigemnt.maxFile")}</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      multiple // Allow multiple file selection
                    />

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
                                      ? (file.size / (1024 * 1024)).toFixed(2)
                                      : 0}{" "}
                                    MB
                                  </span>
                                </p>
                              </div>
                              <button>
                                <IoMdRemoveCircleOutline
                                  onClick={() => handleFileDelete(index)}
                                  className="btn-icon"
                                />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="fileerror">{fileUploadMessage}</p>
                    </div>
                  </div>
                  <div className="file-bottom-button">
                    <button
                      className={`submit-file ${
                        isInputEmpty() ? "disabled-button" : ""
                      }`}
                      disabled={isInputEmpty()}
                      onClick={MakeFileSubmission}
                    >
                      <span>{t("studentAssigemnt.submit")}</span>
                      <BiSolidSend className="submit-icon" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {questions.map((question, index) => (
                    <div key={question.id}>
                      <p className="question-title">
                        {index + 1}.{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: question.question,
                          }}
                        />
                      </p>
                      <div className="answer-input">
                        <AnswerFrom
                          value={answers[index]}
                          onChange={(value) => handleAnswerChange(index, value)}
                        />
                      </div>
                    </div>
                  ))}

              
              
                  <div className="bottom-button">
                    <button
                      className={`save-button ${
                        isInputEmpty() ? "disabled-button" : ""
                      }`}
                      onClick={handleSave} // Update local state
                      disabled={isInputEmpty()}
                    >
                      <CiSaveDown2 className="save-icon" />
                      <span>{t("studentAssigemnt.save")}</span>
                    </button>
                    <button
                      className="submit-button "
                      onClick={MakeTextSubmission}
                    >
                      <span>{t("studentAssigemnt.submit")}</span>
                      <BiSolidSend className="submit-icon" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default StudentAssigmentDetalis;
