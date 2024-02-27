import React, { useState, useEffect } from "react";
import moment from "moment";
import Layout from "../layout/Layout";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { Link } from "react-router-dom";
import "./style/class.css";
import { useTranslation } from "react-i18next";

const Class = () => {
  const userData = getUserInfo();
  const username = userData.username;
  const isStudent = userData.isStudent;
  const isTeacher = userData.isTeacher;

  const [subject, setSubject] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (isTeacher) {
      getSubjectData();
    }
  }, []);
  const getSubjectData = async () => {
    try {
      const endpoint = `/teacher/${username}/`;

      const response = await instance.get(endpoint);
      console.log("API Request URL: ", endpoint);

      if (response.status !== 200) {
        console.error(`Error fetching data: ${response.statusText}`);
        return;
      }

      setSubject(response.data.subjects);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];


  const weekdaysforui = t("weekDay", { returnObjects: true });



  const classTime = [
    { id: 1, time: "9:00-10:30" },
    { id: 2, time: "10:40-12:10" },
    { id: 3, time: "13:00-14:30" },
    { id: 4, time: "14:40-16:10" },
    { id: 5, time: "16:20-17:40" },
  ];

  return (
    <Layout>
      <div>
        <div className="header">
          <h1>{t("classSchedule")}</h1>
        </div>
        <div className="container-class">
          <table>
            <thead>
              <tr>
                <th>{t("time")}</th>
                {weekdays.map((weekday) => (
                  
                  <th key={weekday}>{weekday}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classTime.map((classItem, index) => (
                <tr key={classItem.id}>
                  <td className="class-time">{classItem.time}</td>
                  {weekdays.map((weekday, weekdayIndex) => (
                    <td key={weekdayIndex}>
                      {subject &&
                      subject[index] &&
                      subject[index].weekday === weekday ? (
                        <p>
                          <Link
                            to={{
                              pathname: `/class/${encodeURIComponent(
                                subject[index].subject_code
                              )}`,
                              state: {
                                subject_code: subject[index].subject_code,
                              },
                            }}
                          >
                            {subject[index].subject_name} <br />(
                            {subject[index].class_room})
                          </Link>
                        </p>
                      ) : (
                        ""
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Class;
