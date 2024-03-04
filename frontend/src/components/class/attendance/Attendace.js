import React, { useContext, useEffect, useState } from "react";
import Layout from "../../navigations/Layout";
import "./style/attendace.css";
import instance from "../../../api/axios";
import { MdArrowBack } from "react-icons/md";
import getUserInfo from "../../../api/user/userdata";
import { Link, useParams } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import Table from "./AttendaceTable";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

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
    const columnExistsInTableData = tableData.some(
      (row) => row.date === newColumnName
    );
    const columnExistsInColumns = columns.some(
      (column) => column.columnName === newColumnName
    );

    if (!columnExistsInTableData && !columnExistsInColumns) {
      const rowCount = tableData.length;
      const newColumn = {
        columnName: newColumnName,
        values: Array(rowCount).fill(true),
      };

      setColumns((prevColumnsData) => [...prevColumnsData, newColumn]);
    } else {
      setCreateAttendanceMessage("今日の出席はすでに作成されています。");
    }
  };

  const handleOpenDialog = () => {
    setConform(true);
  };
  const handleCloseDialog = () => {
    setConform(false);
  };

  const handleOpenCodeDialog = () => {
    setOpenCode(true);
  };
  const handleCloseCodeDialog = () => {
    setOpenCode(false);
  };

  const todayDate = format(new Date(), "yyyy-MM-dd");
  const columnExistsInTableData = tableData.some(
    (row) => row.date === todayDate
  );

  const createAttendance = async () => {
    try {
      const endpoint = `/course/create_attendance/`;
      const response = await instance.post(endpoint, {
        teacher_id: username,
        course_code: subject_code,
      });
      setNewattendance(response.data.attendance);
      handleCloseDialog();
      handleOpenCodeDialog();
    } catch {
      console.log("error");
    }
  };

  const getAttendance = async () => {
    try {
      const endpoint = `/course/get_attendance_by_subject/${subject_code}/`;

      const response = await instance.get(endpoint);
      const student_list = response.data.student_list;
      const attendance_list = response.data.attendance;

      setColumns([]);
      setStudentIds({});
      if (student_list) {
        setTableData(student_list);
      } else if (attendance_list) {
        setTableData(attendance_list);
      }
    } catch (e) {
    }
  };

  const makeAttendance = async () => {
    try {
      const endpoint = `/course/create_attdenace_and_add_student/`;
      const response = await instance.post(endpoint, {
        course_id: subject_code,
        studentIds: studentIds,
      });
      if (response.status === 200) {
        setCreateAttendanceMessage("出席が更新されました。");
        setTimeout(() => {
          setCreateAttendanceMessage("");
        }, 3000);
        getAttendance();
      }
    } catch {
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);

  const handleClick = () => {
    if (columnExistsInTableData) {
      setCreateAttendanceMessage("今日の出席はすでに作成されています。");
      setTimeout(() => {
        setCreateAttendanceMessage("");
      }, 3000);
    } else {
      handleOpenDialog();
    }
  };

  function formatCode(code) {
    return code.replace(/(\d{3})(\d{3})/, "$1  $2");
  }
  const formattedCode = newattendance
    ? formatCode(newattendance.attendance_code)
    : "";
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();
  const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(currentDateTime);


  return (
    <Layout>
      <Dialog
        open={conform}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{t("teacherAttdance.generateCode")}</DialogTitle>
        <DialogContent>
          <p>{t("teacherAttdance.areYouSure")}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {t("teacherAttdance.cancel")}
          </Button>
          <Button onClick={createAttendance} color="primary">
            {t("teacherAttdance.generate")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCode}
        onClose={handleCloseCodeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">出席番号</DialogTitle>
        <DialogContent>
          <div className="attdence-code-content">
            <div className="code">
              <h4>{formattedCode}</h4>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCodeDialog} color="primary" autoFocus>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      <div className="attendace">
        <div className="attendace__header">
        
          <div className="generate-button">
          <Link to={`/class/${subject_code}`}>
        <MdArrowBack className="back" />
        </Link>
        
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
          <p style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
            textAlign: "center",
            margin: "10px 0px",
          }}>{t("teacherAttdance.allStudentAttendanceList")}</p>

          <div className="all-table">
            {createAttendanceMessage && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="info">{createAttendanceMessage}</Alert>
              </Stack>
            )}
          </div>
          <Table
            className="table"
            attendanceData={tableData}
            newcolumns={columns}
            setColumns={setColumns}
            setStudentIds={setStudentIds}
            studentIds={studentIds}
          />

          <div className="update-btn">
            <button onClick={makeAttendance}>
              {t("teacherAttdance.update")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendace;
