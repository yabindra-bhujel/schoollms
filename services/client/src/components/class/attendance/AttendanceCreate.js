import React, { useState, useEffect } from "react";
import "./style/AttendanceCreate.css";
import instance from "../../../api/axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const AttendanceCreate = ({
  todatAttendanceIsAlreadyCreated,
  subject_code,
  getAttendance,
}) => {
  const [initialAttendance, setInitialAttendance] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [showAttendanceCode, setShowAttendanceCode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    instance
      .get("attendance/get_student_info_for_inital_attendance/20202/")
      .then((response) => {
        const students = response.data.student_list || [];
        setInitialAttendance(students);

        const defaultAttendance = {};
        students.forEach((student) => {
          defaultAttendance[student.student_id] = "present";
        });
        setAttendanceData(defaultAttendance);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddAttendance = () => {
    if (showAttendanceCode) {
      setShowAttendanceCode(false);
    }
    setShowTable((prevShowTable) => !prevShowTable);
  };

  const handleShowAttendanceCode = () => {
    if (showTable) {
      setShowTable(false);
    }
    setShowAttendanceCode((prevShowAttendanceCode) => !prevShowAttendanceCode);
  };

  const handleAttendanceChange = (studentId, event) => {
    const { value } = event.target;
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmit = () => {
    if (!subject_code) return;

    const payload = [
      {
        subject_code: subject_code,
        students: Object.entries(attendanceData).map(
          ([studentId, attendanceStatus]) => ({
            student_id: studentId,
            attendance_status: attendanceStatus,
          })
        ),
      },
    ];

    instance
      .post("attendance/add_attendance_by_teacher/", payload)
      .then((response) => {
        if (response.status === 201) {
          setSuccessMessage("出席が正常に追加されました。");
          setTimeout(() => {
            setSuccessMessage("");
            setAttendanceData({});
            setShowTable(false);
            getAttendance();

          }, 5000);
        }

        
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(
          "出席の追加中にエラーが発生しました。もう一度お試しください。"
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      });
  };

  const attendanceList = initialAttendance || [];

  const uniqueStudents = Array.from(
    new Map(
      attendanceList.map((student) => [student.student_id, student])
    ).values()
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="attendance-create-container">
      <header className="attendance-create__header">
        <div className="attendance-title">
          {!showTable &&
            !showAttendanceCode &&
            !todatAttendanceIsAlreadyCreated && (
              <h2>出席方法を選択してください。</h2>
            )}

          {todatAttendanceIsAlreadyCreated && (
            <h2>今日の出席はすでに作成されています。</h2>
          )}
        </div>
        <div className="action-buttons-attendance-create">
          {!todatAttendanceIsAlreadyCreated && (
            <>
              <button
                className={`btn-attendance ${showTable ? "disabled" : ""}`}
                onClick={handleShowAttendanceCode}
                disabled={showTable}
              >
                出席コード生成
              </button>
              <button
                className={`btn-attendance ${
                  showAttendanceCode ? "disabled" : ""
                }`}
                onClick={handleAddAttendance}
                disabled={showAttendanceCode}
              >
                出席追加
              </button>
            </>
          )}
        </div>
      </header>

      {showTable && (
        <div className="attendance-create__body">
          {successMessage && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="success">
                <AlertTitle>Success</AlertTitle>
                {successMessage}
              </Alert>
            </Stack>
          )}

          {errorMessage && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            </Stack>
          )}
          <button className="btn-submit" onClick={handleSubmit}>
            出席を送信
          </button>
          <div className="new-attendance-table">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>学生番号</th>
                  <th>学生名</th>
                  <th>コース名</th>
                  <th>{today}</th>
                </tr>
              </thead>
              <tbody>
                {uniqueStudents.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.full_name}</td>
                    <td>{student.course}</td>
                    <td className="attended">
                      <select
                        name="attendance"
                        value={attendanceData[student.student_id] || ""}
                        onChange={(e) =>
                          handleAttendanceChange(student.student_id, e)
                        }
                      >
                        <option value="present">出席</option>
                        <option value="absent">欠席</option>
                        <option value="late">遅刻</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAttendanceCode && (
        <div className="attendance-create__body">
          <div className="attendance-code">
            <h2>出席コード</h2>
            <p>出席コードは以下の通りです。</p>
            <p>123456</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCreate;
