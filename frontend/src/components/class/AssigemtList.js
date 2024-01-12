import React, { useState, useEffect } from "react";
import "./style/AssigemtList.css";
import { Link, useParams } from "react-router-dom";
import instance from "../../api/axios";
import { format } from 'date-fns-tz';
import { useTranslation } from "react-i18next";
import Switch from '@mui/material/Switch';


const AssignmentList = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [assigemtList, setAssigemtList] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getAssigemtList();
  }, []);
  //get assigement list by subject code
  const getAssigemtList = async () => {
    try {
      const endpoint = `/course/${subject_code}/`;
      const response = await instance.get(endpoint);
      if (response.data[0] && response.data[0].assignments) {
        const assigement = response.data[0].assignments;
        setAssigemtList(assigement);
        // Calculate total number of unique students
        const studentSet = new Set();
        assigement.forEach(assignment => {
            assignment.student.forEach(studentId => studentSet.add(studentId));
        });
        const totalUniqueStudents = studentSet.size;
        setTotalStudents(totalUniqueStudents);
      } else {
        console.log("No students found in the response.");
      }
    } catch {
      console.log("error");
    }
  };


  const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    const formattedDate = format(inputDate, 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Tokyo' });
    return formattedDate;
  };

  const label = { inputProps: { 'aria-label': 'Color switch demo' } };

  


  return (
    <div>
      <div className="assigment-list">
        <table className="content-table">
          <thead>
            <tr>
              <th>{t("task")}</th>
              <th>{t("status")}</th>
              <th>{t("submitted")}</th>
              <th>{t("start date")}</th>
              <th>{t("deadline")}</th>
              <th colSpan={2}>Action</th>
             
            </tr>
          </thead>
          <tbody>
            {assigemtList.map((assignment) => (
              <tr key={assignment.id}>
                <td>
                  <Link to={`/assignment/${assignment.id}`}>
                    {assignment.assignment_title}
                  </Link>
                </td>
                <td className={assignment.is_active ? "active-assigment" : "inactive"}>
  {assignment.is_active ? "Active" : "Inactive"}
</td>

                <td>{assignment.submission_count}/ {totalStudents}</td>
                <td>{formatDate(assignment.assignment_posted_date)}</td>
                <td>{formatDate(assignment.assignment_deadline)}</td>
                <td><Switch {...label} defaultChecked /></td>

                
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentList;
