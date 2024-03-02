import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../navigations/Layout";
import "./style/classdetals.css";
import instance from "../../api/axios";
import { MdArrowBack } from "react-icons/md";
import CourseContant from "./CourseContant";
import AssignmentList from "./AssigemtList";
import { PiExamThin } from "react-icons/pi";
import { FaListCheck } from "react-icons/fa6";
import { FcSurvey } from "react-icons/fc";
import ExamList from "./Exam/ExamList";
import { useTranslation } from "react-i18next";
import { BiSolidCloudUpload } from "react-icons/bi";
import { IoCreateOutline } from "react-icons/io5";
import Announcement from "./announcement/Announcement";
import AssigmentCreate from "./AssigmentCreate";
import UploadPDF from "./uploadPDF";
import CreateExam from "./Exam/CreateExam";
import { getFile } from "./ClassServices";
import Syllabus from "./syllabus/Syllabus";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const ClassDetails = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [subject, setSubject] = useState([]);
  const [selectedButton, setSelectedButton] = useState("assignment");
  const { t } = useTranslation();
  const [isAssigmentModalOpen, setIsAssigmentModalOpen] = useState(false);
  const [isPDFModelOpen, setIsPDFModelOpen] = useState(false);
  const [isExamModelOpen, setIsExamModelOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getFile(subject_code);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const endpoint = `/course/${subject_code}/`;
      const response = await instance.get(endpoint);
      setSubject(response.data);
    } catch {
      console.log("error");
    }
  };


  const openExamModel = () => {
    setIsExamModelOpen(true);
  };

  const closeExamModel = () => {
    setIsExamModelOpen(false);
  };

  const openAssigmentModal = () => {
    setIsAssigmentModalOpen(true);
  };

  const closeAssigmentModal = () => {
    setIsAssigmentModalOpen(false);
  };

  const openPDFModel = () => {
    setIsPDFModelOpen(true);
  };

  const closePDFModel = () => {
    setIsPDFModelOpen(false);
  };

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  return (
    <Layout>
      <div className="class-details-container">
        <div className="class-header">
          <div className="retun-bnt">
            <Link to="/class">
              <MdArrowBack className="back" />
            </Link>
          </div>

          <div className="subject-info">
            {subject.length > 0 ? (
              <>
                <h3>{subject[0].subject_name}</h3>
                <p>
                  {subject[0].weekday} {subject[0].start_time} -{" "}
                  {subject[0].end_time} {subject[0].class_room}
                </p>
              </>
            ) : (
              <h3>Loading...</h3>
            )}
          </div>
        </div>

        <Dialog 
        open={isExamModelOpen}
         onClose={closeExamModel}
          fullWidth
          maxWidth="md"

         >
          <DialogTitle>Create Exam Modal</DialogTitle>
          <DialogContent>
            <CreateExam closeExamModel={closeExamModel} />
          </DialogContent>
        </Dialog>

        <Dialog
         open={isAssigmentModalOpen}
          onClose={closeAssigmentModal}
          fullWidth
          maxWidth="md"
          >
          <DialogTitle>Create Assignment Modal</DialogTitle>
          <DialogContent>
            <AssigmentCreate closeAssigmentModal={closeAssigmentModal} />
          </DialogContent>
        </Dialog>

        <Dialog open={isPDFModelOpen} onClose={closePDFModel}>
          <DialogTitle>Upload PDF</DialogTitle>
          <DialogContent>
            <UploadPDF closePDFModel={closePDFModel} fetchData={fetchData} />
          </DialogContent>
        </Dialog>

        <div className="card-item">
          <div className="card">
            <div className="icon">
              <PiExamThin />
            </div>
            <div className="card-body">
              <button onClick={openExamModel}>
                <h4>{t("exam")}</h4>
                <p>{t("create new exam")}</p>
              </button>
            </div>
          </div>

          <div className="card-attdance">
            <Link className={"link-styles"} to={`/attendance/${subject_code}`}>
              <div className="link-to-attdance">
                <div className="icon">
                  <FaListCheck />
                </div>
                <div className="card-body">
                  <h4>{t("attendance")}</h4>
                  <p>{t("generate QR code or number")}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="card">
            <div className="icon">
              <IoCreateOutline />
            </div>
            <div className="card-body">
              <button onClick={openAssigmentModal}>
                <h4>{t("create assignment")}</h4>
                <p>{t("create assignment for this subject")}</p>
              </button>
            </div>
          </div>

          <div className="card">
            <div className="icon">
              <BiSolidCloudUpload />
            </div>
            <div className="card-body">
              <button onClick={openPDFModel}>
                <h4>{t("teaching materials")}</h4>
                <p>{t("share materials related to the class")}</p>
              </button>
            </div>
          </div>

          {/* survey */}
          <div className="card-attdance">
            <Link className={"link-styles"} to={`/survey`}>
              <div className="link-to-attdance">
                <div className="icon">
                  <FcSurvey />
                </div>
                <div className="card-body">
                  <h4>{t("attendance")}</h4>
                  <p>{t("generate QR code or number")}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="all-btn">
          <button
            className={`assigemnt-btn ${selectedButton === "assignment" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("assignment")}
          >
            {t("assignment")}
          </button>
          <button
            className={`test-btn ${selectedButton === "test" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("test")}
          >
            {t("exam")}
          </button>

          <button className="survey-btn">{t("survey")}</button>

          <button className={`course-contant-btn ${selectedButton === "course_contant" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("course_contant")}
          >
            {t("course materials")}
          </button>

          <button className={`course-contant-btn ${selectedButton === "announcement" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("announcement")}
          >
            {t("announcement")}
          </button>

          <button className={`course-contant-btn ${selectedButton === "syllabus" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("syllabus")}
          >
            {t("syllabus")}
          </button>

        </div>

        <section className="main-section">
          {selectedButton === "assignment" && (
            <div className="main-element">
              <AssignmentList />
            </div>
          )}
          {selectedButton === "test" && (
            <div className="main-element">
              <ExamList />
            </div>
          )}
          {selectedButton === "course_contant" && (
            <div className="main-element">
              <CourseContant fetchData={fetchData} />
            </div>
          )}

          {selectedButton === "announcement" && (
            <div className="main-element">
              <Announcement />
            </div>
          )}

          {selectedButton === "syllabus" && (
            <div className="main-element">
              <Syllabus />
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ClassDetails;
