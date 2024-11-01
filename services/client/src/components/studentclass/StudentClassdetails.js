import React, { useState, useEffect } from "react";
import { Link, useParams , useLocation } from "react-router-dom";
import Layout from "../layout/Layout";
import "./style/classDetails.css";
import instance from "../../api/axios";
import CourseContant from "./CourseContant";
import AssignmentList from "./AssigemtList";
import { useTranslation } from "react-i18next";
import StudentAttdance from "./attendance/attendance";
import AttendanceInput from "./attendance/attdanceInput";
import Announcement from "./Announcement/Announcement";
import Syllabus from "./syllabus/syllabus";
import StudentExamList from "./Exam/ExamList";
import Snackbar from "@mui/material/Snackbar";
import { IoChevronBack } from "react-icons/io5";


const StudentClassDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [subject, setSubject] = useState([]);
  const [selectedButton, setSelectedButton] = useState("assignment")
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");


  const handleButtonClick = (buttonType) =>{
    setSelectedButton(buttonType)
  }
 
  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const endpoint = `subject/student/${id}`;
      console.log(endpoint);
      const response = await instance.get(endpoint);
      setSubject(response.data);
    } catch {
      setMessage("データを取得できませんでした。しばらくしてからもう一度お試しください。");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    }
  };
  return (
    <Layout>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={message}
        onClose={() => setOpen(false)}
      />
      <div className="class-details-container">
        <div className="student-class-header">
          <div className="back-btn">
          <Link to="/studentclass">
            <IoChevronBack className="student-back" />
          </Link>
          </div>
          <div className="other-onfo">
            {subject.subject_name ? (
              <>
                <h3>{subject.subject_name}</h3>
                <p>
                  {subject.weekday} {subject.period_start_time} -{" "}
                  {subject.period_end_time} {subject.class_room}
                </p>
              </>
            ) : (
              <h3>Loading...</h3>
            )}
          </div>
        </div>
        <section className="section-buttons">
        <div className="all-buttons">
    <button
      onClick={() => handleButtonClick('assignment')}
      className={selectedButton === 'assignment' ? 'active' : ''}>
      {t("assignment")}
    </button>
    <button
      onClick={() => handleButtonClick('attendance')}
      className={selectedButton === 'attendance' ? 'active' : ''}>
      {t("attendance")}
    </button>
    <button
      onClick={() => handleButtonClick('coursematerials')}
      className={selectedButton === 'coursematerials' ? 'active' : ''}>
      {t("course materials")}
    </button>
    <button
    disabled
      onClick={() => handleButtonClick('survey')}
      >
      {t("survey")}
    </button>
    <button
      onClick={() => handleButtonClick('announcement')}
      className={selectedButton === 'announcement' ? 'active' : ''}>
      コースアナウンス
    </button>
    <button
      onClick={() => handleButtonClick('Syllabus')}
      className={selectedButton === 'Syllabus' ? 'active' : ''}>シラバス </button>
  </div>
         
        </section>

        <section className="student-main-section ">
          {selectedButton === "assignment" &&(
            <div className="main-element">
            <AssignmentList />
          </div>)}

          {selectedButton === "exam" &&(
            <div className="main-element">
             <StudentExamList />
            </div>)}

          {selectedButton === "attendance" &&(
              <div className="main-element-attendance">
                <StudentAttdance className="attendace-table" />
                {/* TODO: 学生自分で確認するようにしたい */}
                {/* <AttendanceInput className="attendace-input"/> */}
              </div>)}

          {selectedButton === "coursematerials" &&(
              <div className="main-element">
                <CourseContant/>
              </div>)}

          {selectedButton === "survey" &&(
              <div className="main-element">
                <h2>Survey list</h2>
              </div>)}

          {selectedButton === "announcement" &&(
              <div className="main-element">
                <Announcement />
              </div>)}

          {selectedButton === "Syllabus" &&(
              <div className="main-element">
                <Syllabus />
              </div>)}
              
        </section>
      </div>
    </Layout>
  );
};

export default StudentClassDetails;
