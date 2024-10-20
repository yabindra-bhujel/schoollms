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
  const [attendanceData, setAttendanceData] = useState([]);
  const [activeMenu, setActiveMenu] = useState("overview-table");
  const [todatAttendanceIsAlreadyCreated, setTodatAttendanceIsAlreadyCreated] = useState(false);
  const [query, setQuery] = useState({
    studentId: "",
    date: "",
  });

  const getAttendance = async () => {
    try {
      const query_params = new URLSearchParams();
      query_params.append("date", query.date);
      const endpoint = `attendance/get_attendance_by_subject/${subject_code}/?${query_params.toString()}`;
      const response = await instance.get(endpoint);
      const attendance = response.data || [];
      setAttendanceData(attendance);

      const todayDate = format(new Date(), "yyyy-MM-dd");
      const todayAttendanceExists = attendance && attendance.some(row => row.date === todayDate);
      setTodatAttendanceIsAlreadyCreated(todayAttendanceExists);

    } catch (error) {
    }
  };

  useEffect(() => {
    getAttendance();
  }, [query]);


  return (
    <Layout>
      <div className="attendace">
        <div className="attendace__header">
          <AttendaceHeader  
            tableData={attendanceData} 
            setActiveMenu={setActiveMenu}
          />
        </div>

        <div>

          <div className="attendace_main_container">
              {activeMenu === "overview-table" && (
                <AttendaceTable 
                  attendanceList={attendanceData}
                  setQuery={setQuery}
                  query={query}
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
