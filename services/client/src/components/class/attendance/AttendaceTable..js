import React from "react";
import "./style/AttendaceTable.css";
import { useTranslation } from "react-i18next";

const AttendaceTable = ({ attendanceList }) => {
  const { t } = useTranslation();
  const studentAttendance = {};

  attendanceList.forEach(({ date, students_attended, course }) => {
    students_attended.forEach(({ student_id, full_name, is_present }) => {
      if (!studentAttendance[student_id]) {
        studentAttendance[student_id] = {
          fullName: full_name,
          course: course,
          attendance: {},
        };
      }
      studentAttendance[student_id].attendance[date] = is_present
        ? "出席"
        : "欠席";
    });
  });

  const uniqueStudents = Object.entries(studentAttendance).map(
    ([studentId, { fullName, course, attendance }]) => ({
      studentId,
      fullName,
      course,
      attendance,
    })
  );

  const dates = [
    ...new Set(attendanceList.map((attendance) => attendance.date)),
  ];

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="sticky-left-table-head">
                {t("teacherAttdance.studentNumber")}
              </th>
              <th className="sticky-left-table-head">
                {t("teacherAttdance.studentName")}
              </th>
              <th className="sticky-left-table-head">
                {t("teacherAttdance.courseName")}
              </th>
              {dates.map((date) => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueStudents.map((student) => (
              <tr key={student.studentId}>
                <td className="sticky-left">{student.studentId}</td>
                <td className="sticky-left">{student.fullName}</td>
                <td className="sticky-left">{student.course}</td>

                {dates.map((date) => (
                  <td
                    key={date}
                    className={
                      student.attendance[date] === "出席"
                        ? "attended"
                        : "absent"
                    }
                  >
                    {student.attendance[date] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendaceTable;
