import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns-tz";
import instance from "../../../api/axios";

import "./style/exmalist.css";
import { useTranslation } from "react-i18next";

const ExamList = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [examList, setexamList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getExamList();
  }, []);
  //get assigement list by subject code
  const getExamList = async () => {
    try {
      const endpoint = `/exam/${subject_code}/`;
      const response = await instance.get(endpoint);
      if (response.data) {
        const examdata = response.data;
        setexamList(examdata);
      } else {
        console.log("No exam found in the response.");
      }
    } catch {
      console.log("error");
    }
  };

  const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    const formattedDate = format(inputDate, "yyyy-MM-dd HH:mm", {
      timeZone: "Asia/Tokyo",
    });
    return formattedDate;
  };

  return (
    <div>
      <div className="exam-list">
        <table className="content-table">
          <thead>
            <tr>
              <th>{t("exam title")}</th>
              <th>{t("status")}</th>
              <th>{t("time")}</th>
              <th>{t("start time")}</th>
              <th>{t("end time")}</th>
            </tr>
          </thead>
          {examList.length > 0 ? (
            <tbody>
              {examList.map((exam) => (
                <tr key={exam.id}>

                  <td>

                    <Link to={`/exam/${exam.id}`}>
                    {exam.title}
                    </Link>


                    </td>

                
                  <td
                    className={exam.is_active ? "active-assigment" : "inactive"}
                  >
                    {exam.is_active ? "Active" : "Inactive"}
                  </td>
                  <td>{exam.duration}</td>
                  <td>{formatDate(exam.start_date)}</td>
                  <td>{formatDate(exam.end_date)}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="5">
                  <p>{t("not have exam")}</p>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ExamList;
