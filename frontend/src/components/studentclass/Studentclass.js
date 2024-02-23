import React, { useState, useEffect } from "react";
import moment from "moment";
import Layout from "../layout/Layout";

import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { Link } from "react-router-dom";
import "./style/class.css";
import { useTranslation } from "react-i18next";
 
const StudentTableComponent = () => {
  const userData = getUserInfo();
  const username = userData.username;
  const isStudent = userData.isStudent;
  const isTeacher = userData.isTeacher;
  const { t } = useTranslation();

  const [subject, setSubject] = useState();

  useEffect(() => {
    if(isStudent){
      getSubjectData();
    }
  }, []);

  const getSubjectData = async () => {
    try {
      const endpoint = `/student/${username}/`;
      const response = await instance.get(endpoint);
      console.log(response.data)
      setSubject(response.data.courses);


    } catch {
      console.log("error in get student");
    }
  };

  const weekdays = [];

  for (let day = 1; day <= 6; day++) {
    const date = moment().isoWeekday(day);
    const weekday = date.format("dddd");
    weekdays.push(weekday);
  }

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
    pathname: `/studentclassdetails/${encodeURIComponent(subject[index].id)}`,
    state: {
      subject_code: subject[index].subject_code,
    },
  }}
>
  {subject[index].name} <br />
  ({subject[index].class_room})
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

export default StudentTableComponent;
