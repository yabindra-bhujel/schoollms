import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
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
import { Switch } from '@mui/material';


const Attendace = () => {
  const username = getUserInfo().username;
  const params = useParams();
  const subject_code = params.courseID;
  const [conform, setConform] = useState(false);
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [createAttendanceMessage, setCreateAttendanceMessage] = useState("");
  const [studentIds, setStudentIds] = React.useState({});
  const [attendanceCode, setAttendanceCode] = useState([]);

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


  const todayDate = format(new Date(), "yyyy-MM-dd");
  const columnExistsInTableData = tableData.some(
    (row) => row.date === todayDate
  );

  const createAttendance = async () => {
    try {
      const endpoint = `/attendance/create_attendance/`;
      const response = await instance.post(endpoint, {
        teacher_id: username,
        course_code: subject_code,
      });
      if(response.status === 201){
        setAttendanceCode(response.data.attendance_code);
        getAttendance();
      }
    } catch {
    }
  };

  const getAttendance = async () => {
    try {
      const endpoint = `attendance/get_attendance_by_subject/${subject_code}/`;

      const response = await instance.get(endpoint);
      const student_list = response.data.student_list;
      const attendance_list = response.data.attendance;
      setAttendanceCode(response.data.current_attendance);

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
      const endpoint = `attendance/add_attendance_by_teacher/`;
      const response = await instance.post(endpoint, {
        course_id: subject_code,
        studentIds: studentIds,
      });
      if (response.status === 201) {
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



  const handleChangeActive = async () => {
    try{
      const endpoint = `attendance/update_attendance_active/${attendanceCode.id}/`;
      const response = await instance.put(endpoint);  
      if(response.status === 200){
        getAttendance();
      }
    }catch(e){
    }
  }

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

            {attendanceCode && attendanceCode.is_active && (
              <strong>{attendanceCode.attendance_code}</strong>
            )}
            </div>

              <Switch 
                checked={attendanceCode[0]?.is_active}
                onChange={handleChangeActive}
              />
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
