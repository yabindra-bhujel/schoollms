import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";
import Snackbar from "@mui/material/Snackbar";
import instance from "../../api/axios";
import "./style/AssigemtList.css";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AssigmentCreate from "./AssigmentCreate";
import Alert from '@mui/material/Alert';


const AssignmentList = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [assignmentList, setAssignmentList] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigmentModalOpen, setIsAssigmentModalOpen] = useState(false);
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
      const endpoint = `assignments/assignment-list/${subject_code}/?${query_params.toString()}`;
      setIsLoading(true);
      const response = await instance.get(endpoint);
      setAssignmentList([]);
      if (response.data && response.data.length > 0) {
        const assignments = response.data;
        setAssignmentList(assignments);
        const studentSet = new Set();
        assignments.forEach((assignment) => {
          assignment.students.forEach((studentId) => studentSet.add(studentId));
        });
        const totalUniqueStudents = studentSet.size;
        setTotalStudents(totalUniqueStudents);
      }
    } catch (error) {
      setError("Error fetching assignment list.");
      setTimeout(() => {
        setOpen(false);
        setError("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    return format(inputDate, "yyyy-MM-dd HH:mm", { timeZone: "Asia/Tokyo" });
  };

  const handleVisibilityChange = async (assignmentId, newValue) => {
    try {
      const assignment = assignmentList.find(
        (assignment) => assignment.id === assignmentId
      );
      const deadline = new Date(assignment.deadline);
      const currentDate = new Date();
      if (currentDate <= deadline) {
        setError(
          "The assignment deadline has not yet passed. You cannot change visibility."
        );
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          setError("");
        }, 5000);
        return;
      }

      const updatedAssignments = assignmentList.map((assignment) => {
        if (assignment.id === assignmentId) {
          assignment.is_visible = newValue;
        }
        return assignment;
      });
      setAssignmentList(updatedAssignments);
      const endpoint = `assignments/update-assignment-viibility/${assignmentId}/`;
      await instance.put(endpoint, { is_visible: newValue });
    } catch (error) {
      setError("An error occurred while updating assignment visibility.");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setError("");
      }, 5000);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  const closeAssigmentModal = () => {
    setIsAssigmentModalOpen(false);
  };

  const openAssigmentModal = () => {
    setIsAssigmentModalOpen(true);
  };

  if (isLoading) return <Snackbar open={true} message="Fetching data..." />;

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={error}
      />

      <Dialog
        open={isAssigmentModalOpen}
        onClose={closeAssigmentModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <h3>{t("create assignment")}</h3>
        </DialogTitle>
        <DialogContent>
          <AssigmentCreate closeAssigmentModal={closeAssigmentModal} />
        </DialogContent>
      </Dialog>

      <div className="assignment-list-header">
        <h4>課題一覧</h4>

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

        <button onClick={openAssigmentModal} className="create-assignment-button">
          {t("create assignment")}
        </button>
      </div>
      <div className="assignment-list">
        {assignmentList.length === 0 ? (
          <div className="no-assignment">
            {filters.all ? (
              <Alert variant="filled" severity="info">
                課題がありません。
              </Alert>
            ):(
              <Alert variant="filled" severity="info">
                指定した条件に一致する課題が見つかりませんでした。
              </Alert>
            )}
          </div>
        ) : (
          <table className="teacher-assigmnet-table">
            <thead>
              <tr>
                <th>{t("task")}</th>
                <th>{t("status")}</th>
                <th>{t("submitted")}</th>
                <th>{t("start date")}</th>
                <th>{t("deadline")}</th>
                <th>Visibility</th>
              </tr>
            </thead>
            <tbody>
              {assignmentList.map((assignment) => (
                <tr key={assignment.id}>
                  <td>
                    <Link to={`/assignment/${subject_code}/${assignment.id}`} className="assignment-link">
                      {assignment.title}
                    </Link>
                  </td>
                  <td className={assignment.is_active ? "active-assignment" : "inactive"}>
                    <span className={assignment.is_active ? "status-green" : "status-red"}>
                      {assignment.is_active ? "Available" : "Not Available"}
                    </span>
                  </td>
                  <td>
                    {assignment.submission_count} / {totalStudents}
                  </td>
                  <td>{formatDate(assignment.posted_date)}</td>
                  <td className={new Date(assignment.deadline) > new Date() ? "date-green" : "date-red"}>
                    {formatDate(assignment.deadline)}
                  </td>
                  <td>
                    <Switch
                      defaultChecked={assignment.is_published}
                      disabled={new Date(assignment.deadline) > new Date()}
                      onChange={(event) =>
                        handleVisibilityChange(assignment.id, event.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AssignmentList;
