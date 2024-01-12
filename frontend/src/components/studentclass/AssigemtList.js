import React, { useState, useEffect } from "react";
import "./style/AssigemtList.css";

import { Link, useParams } from "react-router-dom";
import instance from "../../api/axios";
import { format } from 'date-fns-tz';
import { useTranslation } from "react-i18next";
import getUserInfo from "../../api/user/userdata";


const AssignmentList = () => {
  const { id } = useParams();
  const [assigemtList, setAssigemtList] = useState([]);
  const { t } = useTranslation();
  const studentID = getUserInfo().username


  useEffect(() => {
    getAssigemtList();
  }, []);
  //get assigement list by subject code
  const getAssigemtList = async () => {
    try {
      const endpoint = `/course/${id}/${studentID}/`;
      const response = await instance.get(endpoint);
      if (response.data[0] && response.data[0].assignments) {
        const assigement = response.data[0].assignments;
        setAssigemtList(assigement);
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

  

  return (
    <div>
      <div className="assigment-list">
        <table className="content-table">
          <thead>
            <tr>
              <th>{t("task")}</th>
              <th>{t("status")}</th>
              <th>{t("start date")}</th>
              <th>{t("deadline")}</th>
              <th>{t("studentAssigemnt.submit")}</th>
            </tr>
          </thead>
          <tbody>
            {assigemtList.map((assignment) => (
              <tr key={assignment.id}
              >
                <td>
                  {assignment.is_active ? (
                    <Link to={`/studentassignment/${assignment.id}`}>
                      {assignment.assignment_title}
                    </Link>
                  ) : (
                    <span>{assignment.assignment_title}</span>
                  )}
                </td>
                <td className={assignment.is_active ? "" : "inactive-assigment"  }>{assignment.is_active ? "Active" : "Inactive"}</td>
                <td>
                  {formatDate(assignment.assignment_posted_date)}
                </td>
                <td>
                  {formatDate(assignment.assignment_deadline)}
                </td>
                <td
                  className={
                    assignment.has_submitted
                      ? "submitted"
                      : "not-submitted"
                  }
                >
                  {assignment.has_submitted ? t("studentAssigemnt.submit") : t("studentAssigemnt.notsubmit")}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AssignmentList;
