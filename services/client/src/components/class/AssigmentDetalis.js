import React, { useState, useEffect } from "react";
import "./style/AssigmentDetalis.css";
import { useParams, Link } from "react-router-dom";
import Layout from "../layout/Layout";
import instance from "../../api/axios";
import { useTranslation } from "react-i18next";
import DataTable from "./AssigmentSubmitTable";
import "./style/AssigmentCreate.css";
import TextDataTable from "./TextSubmitTable";
import Snackbar from "@mui/material/Snackbar";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AssigmentUpdateForm from "./AssigmentUpdateForm";

const AssigmentDetalis = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState("submissionList");
  const params = useParams();
  const assignmentID = params.assignmentID;
  const subject_code = params.courseID;
  const [assignment, setAssignment] = useState([]);
  const [message, setMessage] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [open, setOpen] = useState(false);

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
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
                className={`menu-btn ${
                  activeMenu === "submissionList" ? "active-menu" : ""
                }`}
              >
                提出一覧
              </button>
              <button
                onClick={() => handleMenuChange("assigment")}
                className={`menu-btn ${
                  activeMenu === "assigment" ? "active-menu" : ""
                }`}
              >
                課題詳細
              </button>
            </div>
            <Link to={`/class/${subject_code}`}>
              <IoIosCloseCircleOutline
                size={40}
                className="assigemnt-back-btn"
              />
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
            <div className="assigment-submit-table">
              <AssigmentUpdateForm
                assignment={assignment}
                assignmentID={assignmentID}
                getAssignmentData={getAssignmentData}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AssigmentDetalis;
