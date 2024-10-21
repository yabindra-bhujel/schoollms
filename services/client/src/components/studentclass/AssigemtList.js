import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../api/axios";
import { format } from 'date-fns-tz';
import { useTranslation } from "react-i18next";
import Snackbar from "@mui/material/Snackbar";
import getUserInfo from "../../api/user/userdata";
import './style/AssignmentList.css';

const AssignmentList = () => {
  const { id } = useParams();
  const [assignmentList, setAssignmentList] = useState([]);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const username = getUserInfo().username;
  const [filters, setFilters] = useState({
    all: true,
    available: false,
    notAvailable: false,
  });

  const handleCheckboxChange = (event) => {
    const { id } = event.target;

    if (id === "all") {
      setFilters({
        all: true,
        available: false,
        notAvailable: false,
      });
    } else if (id === "available") {
      setFilters({
        all: false,
        available: true,
        notAvailable: false,
      });
    } else if (id === "notAvailable") {
      setFilters({
        all: false,
        available: false,
        notAvailable: true,
      });
    }
  };

  useEffect(() => {
    getAssignmentList();
  }, [filters]);

  const getAssignmentList = async () => {
    try {
      const query_params = new URLSearchParams();
      query_params.append("available", filters.available);
      query_params.append("not_available", filters.notAvailable);
      const endpoint = `assignments/student-assignment/${id}/?${query_params.toString()}`;
      setIsLoading(true);
      const response = await instance.get(endpoint);
      setAssignmentList(response.data);
    } catch (error) {
      console.error("Error fetching assignment list:", error);
      setMessage("データを取得できませんでした。しばらくしてからもう一度お試しください。");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    return format(inputDate, 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Tokyo' });
  };

  return (
    <div className="student-assignment-list">
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={message}
        onClose={() => setOpen(false)}
      />
      <div className="student-assignment-header">
        <h2>課題一覧</h2>
        <div className="assignment-filter">
          <div className="filter-option">
            <span className="filter-titile">Filter:</span>
            <input
              type="checkbox"
              id="all"
              checked={filters.all}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="all">All</label>
          </div>
          <div className="filter-option">
            <input
              type="checkbox"
              id="available"
              checked={filters.available}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="available">Available</label>
          </div>
          <div className="filter-option">
            <input
              type="checkbox"
              id="notAvailable"
              checked={filters.notAvailable}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="notAvailable">Not Available</label>
          </div>
        </div>
        <div></div>
      </div>
      {isLoading && <div className="loading-container">
        <div className="spinner"></div>
        </div>}
      <table className="student-assigemnt-list">
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
          {assignmentList.map((assignment) => (
            <tr key={assignment.id}>
              <td>
                <Link to={`/studentassignment/${assignment.id}/${id}`}>
                  {assignment.title}
                </Link>
              </td>
              <td style={{ color: assignment.is_active ? "green" : "red" }}>
                {assignment.is_active ? "提出可" : "提出不可"}
              </td>
              <td>{formatDate(assignment.posted_date)}</td>
              <td>{formatDate(assignment.deadline)}</td>
              <td style={{ color: assignment.has_submitted ? "green" : "red" }}>
                {assignment.has_submitted ? t("studentAssigemnt.submit") : t("studentAssigemnt.notsubmit")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentList;
