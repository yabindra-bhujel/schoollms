import React, { useState, useEffect } from "react";
import moment from "moment";
<<<<<<< HEAD
import Layout from "../navigations/Layout";
=======
import Layout from "../layout/Layout";

>>>>>>> 9bdbe49ee235700db43227133b53bb56680bfe21
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { Link } from "react-router-dom";
import "./style/class.css";
import { useTranslation } from "react-i18next";
import Snackbar from "@mui/material/Snackbar";

const StudentTableComponent = () => {
  const userData = getUserInfo();
  const username = userData.username;
  const isStudent = userData.isStudent;
  const { t } = useTranslation();
  const [subject, setSubject] = useState();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const weekdays = [];
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    if (isStudent) {
      getSubjectData();
    }
  }, []);

  const getSubjectData = async () => {
    try {
      const endpoint = `/student/${username}/`;
      setIsLoading(true);
      const response = await instance.get(endpoint);
      setSubject(response.data.courses);
    } catch {
      setMessage("でーたを取得できませんでした。しばらくしてからもう一度お試しください。");
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
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

  if (isLoading) {
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message="データを取得中"
    />;
  }

  return (
    <Layout>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
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
                              },}}
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
