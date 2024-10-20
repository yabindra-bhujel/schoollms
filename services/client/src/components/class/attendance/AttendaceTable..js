import React, { useState } from "react";
import "./style/AttendaceTable.css";
import { useTranslation } from "react-i18next";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";


const AttendaceTable = ({ attendanceList, setQuery, query }) => {
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
    <div>
      {/* Filter Section */}
      <div className="table-filter">
        {/* Student ID filter */}
        {/* <div className="filter-item">
          <label htmlFor="studentIdFilter">Student ID</label>
          <input
            id="studentIdFilter"
            type="text"
            value={query.studentId}
            onChange={handleInputChange}
            placeholder="Student ID"
          />
        </div> */}

        {/* Date filter */}
        <div className="filter-item">
          <label htmlFor="dateFilter">Attendace Date </label>
          <select
            id="dateFilter"
            value={query.date}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, date: e.target.value }))
            }
          >
            <option value="">Attendace Date</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination */}
        <div className="attdance-pagenation">
          <button className="prev"><GrFormPrevious size={30} /> </button>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <button className="next"><MdOutlineNavigateNext size={30} /></button>
        </div>
      </div>

      {/* Table Section */}
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
    </div>
  );
};

export default AttendaceTable;
