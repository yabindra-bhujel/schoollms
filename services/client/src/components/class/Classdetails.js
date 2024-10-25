import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import "./style/classdetals.css";
import CourseContant from "./CourseContant";
import AssignmentList from "./AssigemtList";
import { useTranslation } from "react-i18next";
import Announcement from "./announcement/Announcement";
import AssigmentCreate from "./AssigmentCreate";
import UploadPDF from "./uploadPDF";
import TeacherClassServices from "./ClassServices";
import Syllabus from "./syllabus/Syllabus";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { IoChevronBack } from "react-icons/io5";

const ClassDetails = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [subject, setSubject] = useState([]);
  const [selectedButton, setSelectedButton] = useState("assignment");
  const { t } = useTranslation();
  const [isAssigmentModalOpen, setIsAssigmentModalOpen] = useState(false);
  const [isPDFModelOpen, setIsPDFModelOpen] = useState(false);
  const [isExamModelOpen, setIsExamModelOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");


  const fetchData = async () => {
    try {
      setIsLoaded(true);
      const response = await TeacherClassServices.getFile(subject_code);
      setIsLoaded(false);
      return response;
    } catch (error) {
      setMessage("データの取得に失敗しました 。");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 5000);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      setIsLoaded(true);
      const response = await TeacherClassServices.getCourseDetails(subject_code);
      console.log(response.data[1]);
      setIsLoaded(false);
      setSubject(response.data[1]);
    } catch {
      setMessage("データの取得に失敗しました 。");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 5000);
    }
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

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={message}
      />
      <div className="class-details-container">
        <div className="class-header">
          <div className="retun-bnt">
            <Link to="/class">
              <IoChevronBack className="back" />
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
              <>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={() => setOpen(false)}
                  message="データの取得中"
                />
              </>
            )}
          </div>
        </div>
        <Dialog
          open={isAssigmentModalOpen}
          onClose={closeAssigmentModal}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <h3>{t("create assignment")}</h3>
          </DialogTitle>
          <DialogContent>
            <AssigmentCreate closeAssigmentModal={closeAssigmentModal} />
          </DialogContent>
        </Dialog>

        <Dialog
          open={isPDFModelOpen}
          onClose={closePDFModel}>
          <DialogContent>
            <UploadPDF closePDFModel={closePDFModel} fetchData={fetchData} />
          </DialogContent>
        </Dialog>

        <div className="all-btn">
          <button
            className={`assigemnt-btn ${selectedButton === "assignment" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("assignment")}
          >
            {t("assignment")}
          </button>

          <Link to={`/attendance/${subject_code}`}>
            <button className="attendance-btn">{t("attendance")}</button>
          </Link>

          <button className="survey-btn" disabled>{t("survey")}</button>

          <button className={`course-contant-btn ${selectedButton === "course_contant" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("course_contant")}
          >
            {t("course materials")}
          </button>

          <button className={`course-contant-btn ${selectedButton === "announcement" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("announcement")}
          >
            コースアナウンス
          </button>

          <button className={`course-contant-btn ${selectedButton === "syllabus" ? "menu-active" : ""}`}
            onClick={() => handleButtonClick("syllabus")}
          >
            シラバス
          </button>

        </div>

        <section className="main-section">
          {selectedButton === "assignment" && (
            <div className="main-element">
              <AssignmentList />
            </div>
          )}
          {selectedButton === "course_contant" && (
            <div className="main-element">
              <CourseContant setMessage={setMessage} setOpen={setOpen} fetchData={fetchData} />
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
