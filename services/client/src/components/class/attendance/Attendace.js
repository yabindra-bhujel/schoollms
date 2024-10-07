import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import "./style/attendace.css";
import instance from "../../../api/axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import AttendaceHeader from "./AttendaceHeader";
import AttendanceCreate from "./AttendanceCreate";
import AttendaceTable from "./AttendaceTable.";

const Attendace = () => {
  const params = useParams();
  const subject_code = params.courseID;
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [activeMenu, setActiveMenu] = useState("overview-table");
  const [todatAttendanceIsAlreadyCreated, setTodatAttendanceIsAlreadyCreated] = useState(false);

  const getAttendance = async () => {
    try {
      const endpoint = `attendance/get_attendance_by_subject/${subject_code}/`;
      const response = await instance.get(endpoint);
      const { student_list, attendance, current_attendance } = response.data;

      if (student_list) {
        setTableData(student_list);
      } else if (attendance) {
        setTableData(attendance);
      }

      const todayDate = format(new Date(), "yyyy-MM-dd");
      const todayAttendanceExists = attendance && attendance.some(row => row.date === todayDate);
      setTodatAttendanceIsAlreadyCreated(todayAttendanceExists);

    } catch (error) {
    }
  };

  useEffect(() => {
    getAttendance();
  }, []);


  return (
    <Layout>
      <div className="attendace">
        <div className="attendace__header">
          <AttendaceHeader  
            tableData={tableData} 
            setActiveMenu={setActiveMenu}
          />
        </div>

        <div>

          <div className="attendace_main_container">
              {activeMenu === "overview-table" && (
                <AttendaceTable 
                  attendanceList={tableData}
                />
              )}
              {activeMenu === "create-attendance" && (
                <AttendanceCreate 
                  todatAttendanceIsAlreadyCreated={todatAttendanceIsAlreadyCreated}
                  subject_code={subject_code}
                  getAttendance={getAttendance}
                />
              )}
           
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Attendace;
