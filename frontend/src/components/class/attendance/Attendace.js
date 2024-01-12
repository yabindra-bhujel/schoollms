import React, { useContext, useEffect, useState } from "react";
import Layout from "../../navigations/Layout";
import "./style/attendace.css";
import instance from "../../../api/axios";

import getUserInfo from "../../../api/user/userdata";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import Table from "./AttendaceTable";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

Modal.setAppElement("#root");

const Attendace = () => {
  const username = getUserInfo().username;
  const params = useParams();
  const subject_code = params.courseID;
  const [conform, setConform] = useState(false);
  const [newattendance, setNewattendance] = useState();
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [createAttendanceMessage, setCreateAttendanceMessage] = useState("");
  const [openCode, setOpenCode] = useState(false);
  const [studentIds, setStudentIds] = React.useState({});

  const addNewColumn = () => {
    const newColumnName = format(new Date(), "yyyy-MM-dd");
    // Check if the column already exists in tableData or columns
    const columnExistsInTableData = tableData.some(
      (row) => row.date === newColumnName
    );
    const columnExistsInColumns = columns.some(
      (column) => column.columnName === newColumnName
    );

    if (!columnExistsInTableData && !columnExistsInColumns) {
      // Dynamically determine the number of rows based on existing data
      const rowCount = tableData.length;
      const newColumn = {
        columnName: newColumnName,
        values: Array(rowCount).fill(true), // Creates an array with 'rowCount' elements, all set to true
      };

      // Add the new column to the columns data
      setColumns((prevColumnsData) => [...prevColumnsData, newColumn]);
    } else {
      // Column already exists, handle this case (e.g., show a message)
      setCreateAttendanceMessage("Attendance already created for today");
    }
  };

  const openDiglog = () => {
    setConform(true);
  };
  const closeDialog = () => {
    setConform(false);
  };

  const openCodeDiglog = () => {
    setOpenCode(true);
  };
  const closCodeDialog = () => {
    setOpenCode(false);
  };

  // check in tableData already have attdance date is todya
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const columnExistsInTableData = tableData.some(
    (row) => row.date === todayDate
  );

  const create_attendance = async () => {
    try {
      const endpoint = `/course/create_attendance/`;
      const response = await instance.post(endpoint, {
        teacher_id: username,
        course_code: subject_code,
      });
      setNewattendance(response.data.attendance);
      closeDialog();
      openCodeDiglog();
    } catch {
      console.log("error");
    }
  };

  const get_attendance = async () => {
    try {
      const endpoint = `/course/get_attendance_by_subject/${subject_code}/`;

      const response = await instance.get(endpoint);
      const student_list = response.data.student_list;
      const attendance_list = response.data.attendance;

      // Clear existing columns before setting new ones
      setColumns([]);
      // Reset studentIds state
      setStudentIds({});
      if (student_list) {
        setTableData(student_list);
      } else if (attendance_list) {
        setTableData(attendance_list);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const makeattendance = async () => {
    try {
      const endpoint = `/course/create_attdenace_and_add_student/`;
      const response = await instance.post(endpoint, {
        course_id: subject_code,
        studentIds: studentIds,
      });
      if (response.status === 200) {
        setCreateAttendanceMessage("Attendance updated successfully");
        // set timeout
        setTimeout(() => {
          setCreateAttendanceMessage("");
        }, 3000);
        get_attendance();
      }
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    get_attendance();
  }, []);

  const handleClick = () => {
    if (columnExistsInTableData) {
      // Column already exists, handle this case (e.g., show a message)
      setCreateAttendanceMessage("Attendance already created for today");
      // set timeout
      setTimeout(() => {
        setCreateAttendanceMessage("");
      }, 3000);
    } else {
      openDiglog();
    }
  };

  function formatCode(code) {
    // Assuming code is a string of 6 digits
    return code.replace(/(\d{3})(\d{3})/, "$1  $2");
  }

  const formattedCode = newattendance
    ? formatCode(newattendance.attendance_code)
    : "";


    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
      // Update currentDateTime every second
      const intervalId = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
  
      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
  
    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();
    const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(currentDateTime);
  

  return (
    <Layout>
      <Modal
        className="attdence-model"
        isOpen={conform}
        onRequestClose={closeDialog}
        contentLabel="Create Attdnace Modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-content-attdence">
          <div className="modal-header-attdence">
            <h2>{t("teacherAttdance.generateCode")}</h2>
          </div>

          <div className="modal-body-attdence">
            <p>{t("teacherAttdance.areYouSure")}</p>
          </div>

          <div className="model-footer-attdence">
            <button className="cancle-btn" onClick={closeDialog}>
              {t("teacherAttdance.cancel")}
            </button>
            <button className="creaet-btn" onClick={create_attendance}>
              {t("teacherAttdance.generate")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        className="show-code"
        isOpen={openCode}
        onRequestClose={closCodeDialog}
        contentLabel="Show Attdnace code"
        shouldCloseOnOverlayClick={false}
      >
        <div className="attdence-code-content">
          <div className="code">
            <h1>{formattedCode}</h1>
          </div>

          <button onClick={closCodeDialog}>Close</button>
        </div>
      </Modal>

      <div className="attendace">
        <div className="attendace__header">
          <div className="generate-button">
            <button className="btn-attdance" onClick={handleClick}>
              {t("teacherAttdance.generateCode")}
            </button>

            <button className="btn-attdance" onClick={addNewColumn}>
              {t("teacherAttdance.addAttendance")}
            </button>
          </div>

          <div className="today-date">
          <div className="subject-name">
  {Array.from(new Set(tableData.map(item => item.course))).map((course, index) => (
    <p key={index}>{course}</p>
  ))}
</div>


      <div className="time">
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
            <p>{dayOfWeek}</p>
          </div>
          </div>
        </div>

        <div>
          <div className="all-table">
            {createAttendanceMessage && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="info">{createAttendanceMessage}</Alert>
              </Stack>
            )}
            <p>{t("teacherAttdance.allStudentAttendanceList")}</p>
          </div>
          <Table
            className="filnal-table"
            attendanceData={tableData}
            newcolumns={columns}
            setColumns={setColumns}
            setStudentIds={setStudentIds}
            studentIds={studentIds}
          />

          <div className="update-btn">
            <button onClick={makeattendance}>
              {t("teacherAttdance.update")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendace;
