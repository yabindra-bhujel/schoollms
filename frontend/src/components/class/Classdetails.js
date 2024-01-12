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

import { IoCreateOutline } from "react-icons/io5"; // If the icon is part of version 5
import Announcement from "./announcement/Announcement";

import Modal from "react-modal";

import AssigmentCreate from "./AssigmentCreate";
import UploadPDF from "./uploadPDF";
import CreateExam from "./Exam/CreateExam";
import { getFile } from "./ClassServices";

Modal.setAppElement("#root");

const ClassDetails = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [subject, setSubject] = useState([]);
  const [selectedButton, setSelectedButton] = useState("assignment");
  const { t } = useTranslation();



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

  const [isAssigmentModalOpen, setIsAssigmentModalOpen] = useState(false);
  const [isPDFModelOpen, setIsPDFModelOpen] = useState(false);
  const [isExamModelOepn, setIsExamModelOepn] = useState(false);
  const [isattendanceOpen, setIsattendanceOpen] = useState(false);

  const openattendacne = () => {
    setIsattendanceOpen(true);
  };

  const closeattendacne = () => {
    setIsattendanceOpen(false);
  };

  const openExamModel = () => {
    setIsExamModelOepn(true);
  };

  const closeExamModel = () => {
    setIsExamModelOepn(false);
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

        <Modal
          className="exam-model"
          isOpen={isExamModelOepn}
          onRequestClose={closeExamModel}
          contentLabel="Create Exam Modal"
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal-content-exam">
            <CreateExam closeExamModel={closeExamModel} />
          </div>
        </Modal>

        <Modal
          className="model"
          isOpen={isAssigmentModalOpen}
          onRequestClose={closeAssigmentModal}
          contentLabel="Create Assignment Modal"
          shouldCloseOnOverlayClick={false}
        >
          <div className="modal-content">
            <AssigmentCreate closeAssigmentModal={closeAssigmentModal} />
          </div>
        </Modal>

        <Modal
          className="upload-pdf-model"
          isOpen={isPDFModelOpen}
          onRequestClose={closePDFModel}
          contentLabel="Upload PDF"
          shouldCloseOnOverlayClick={false}
        >
          <div className="pdf-modal-content">
            <UploadPDF closePDFModel={closePDFModel} fetchData={fetchData} />

          </div>
        </Modal>

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
            className={`assigemnt-btn ${
              selectedButton === "assignment" ? "menu-active" : ""
            }`}
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
          >{t("course materials")}</button>




      <button className={`course-contant-btn ${selectedButton === "announcement" ? "menu-active" : ""}`}
          onClick={() => handleButtonClick("announcement")}
          >{t("announcement")}</button>


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


        </section>
      </div>
    </Layout>
  );
};

export default ClassDetails;
