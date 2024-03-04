import React, { useState, useEffect } from "react";
import "./style/AssigmentCreate.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AssignmentPreview from "./AssignmentPreview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import instance from "../../api/axios";
import AssigmentForm from "./AssigemntFrom";
import { useTranslation } from "react-i18next";
import { getCourseDetails } from "./ClassServices";
import Snackbar from '@mui/material/Snackbar';

const AssigmentCreate = (props) => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [studentIds, setStudentIds] = useState([]);
  const [showAddMoreButton, setShowAddMoreButton] = useState(false);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const toolbarOptions = {
    toolbar: [
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline", "strike", "removeFormat"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const handleQuestionsChange = (updatedQuestions) => {
    setFormData((prevData) => ({
      ...prevData,
      questions: updatedQuestions,
    }));
  };

  useEffect(() => {
    getSubjectData();
    const extractedStudentIds = studentList.map(
      (student) => student.Student_id
    );
    setStudentIds(extractedStudentIds);
  }, []);

  const getSubjectData = async () => {
    try {
      const endpoint = `/course/${subject_code}/`;
      const response = await instance.get(endpoint);
      if (response.data[0] && response.data[0].students) {
        const student = response.data[0].students;
        setStudentList(student);
        const studentIds = student.map((student) => student.Student_id);
        setStudentIds(studentIds);
      } else {
        setMessage("データが見つかりませんでした。");
        setTimeout(() => {
          setOpen(false);
          setMessage("");
        }, 5000);
      }
    } catch (e) {
      setMessage("データの取得に失敗しました。");
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 5000);
    }
  };

  const [formData, setFormData] = useState({
    course: subject_code,
    students: studentIds,
    assignment_title: "",
    assignment_description: "",
    assignment_deadline: "",
    assignment_type: "File",
    max_grade: 100,
    assignment_start_date: "",
    questions: [],
  });

  const handleChange = (e, name) => {
    const newValue = e.target ? e.target.value : e;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleNextClick = () => {
    setIsPreviewMode(true);
  };

  const handleBackClick = () => {
    setIsPreviewMode(false);
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const sendData = async () => {
    try {
      const endpoint = `/course/create_assigment/`;
      const response = await instance.post(endpoint, {
        ...formData,
        students: studentIds,
      });
      if (response.status === 201) {
        getCourseDetails(subject_code);
        setMessage("課題が作成されました。");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          setMessage("");
        }, 5000);
        props.closeAssigmentModal();
      }
    } catch (e) {
      setMessage("課題の作成に失敗しました。");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 5000);
      
    }
  };
  const isVallidFrom = () => {
    return (
      formData.assignment_title !== "" &&
      formData.assignment_description !== "" &&
      formData.assignment_start_date !== "" &&
      formData.assignment_deadline !== ""
    );
  };

  const handleAssignmentTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      assignment_type: selectedType,
    }));
    if (selectedType === "Text"){
      setShowAddMoreButton(true)
    }else{
      setShowAddMoreButton(false)
    }
}

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={message}
      />
      <div className="assignment-form">
        {isPreviewMode ? (
          <AssignmentPreview formData={formData} />
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              {t("assignmentTitle")}
              <input
                type="text"
                name="assignment_title"
                value={formData.assignment_title}
                onChange={(e) => handleChange(e, "assignment_title")}
                required
              />
            </label>
            
            <div className="sort-form">
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label> {t("assignmentType")}</label>
                    <select
                      name="assignment_type"
                      value={formData.assignment_type}
                      onChange= {handleAssignmentTypeChange}>
                      <option value="File">File</option>
                      <option value="Text">Text</option>
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>{t("assignmentDeadline")}</label>
                    <DatePicker
                      selected={formData.assignment_deadline}
                      onChange={(date) =>
                        handleDateChange("assignment_deadline", date)
                      }
                      showTimeSelect
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      required
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>{t("maxGrade")}</label>
                    <input
                      type="text"
                      name="max_grade"
                      value={formData.max_grade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>{t("assignmentStartDate")}</label>
                    <DatePicker
                      selected={formData.assignment_start_date}
                      onChange={(date) =>
                        handleDateChange("assignment_start_date", date)}
                      showTimeSelect
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      required/>
                  </div>
                </div>
              </div>
            </div>
            <div className="assigment_question_area">
            <label>
           {t("assignmentDescription")}
            </label>
            <ReactQuill
              theme="snow"
              value={formData.assignment_description}
              onChange={(value) =>
                handleChange(value, "assignment_description")}
              modules={{toolbar: toolbarOptions.toolbar,}}/>
            </div>
            {showAddMoreButton && (<AssigmentForm onQuestionsChange={handleQuestionsChange} />)}
          </form>
        )}
      </div>
      <div className="btn">
        {isPreviewMode ? ( <button type="button" onClick={handleBackClick}>戻る</button>) : null}
        {isPreviewMode ? (<button type="submit" onClick={sendData}>送信</button>
        ) : (
          <>
            <button type="button" onClick={props.closeAssigmentModal}>キャンセル</button>
            {isVallidFrom() && <button type="submit" onClick={handleNextClick}>Next</button>}
          </>
        )}
      </div>
    </div>
  );
};

export default AssigmentCreate;
