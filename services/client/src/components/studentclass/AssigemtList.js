import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../api/axios";
import { format } from 'date-fns-tz';
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import getUserInfo from "../../api/user/userdata";

const AssignmentList = () => {
  const { id } = useParams();
  const [assignmentList, setAssignmentList] = useState([]);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const username = getUserInfo().username;

  console.log(assignmentList);

  useEffect(() => {
    getAssignmentList();
  }, []);

  const getAssignmentList = async () => {
    try {
      const endpoint = `assignments/student-assignment/${id}/`;
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
  
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        message={message}
        onClose={() => setOpen(false)}
      />
      <div className="assignment-list">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">{t("task")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{t("status")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{t("start date")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{t("deadline")}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{t("studentAssigemnt.submit")}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignmentList.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <Typography>
                      <Link to={`/studentassignment/${assignment.id}/${id}`}>
                        {assignment.title}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography style={
                      assignment.is_active ? { color: "green" } : { color: "red" }
                    }>
                      {assignment.is_active ? "可" : "不可"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{formatDate(assignment.posted_date)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{formatDate(assignment.deadline)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography style={
                      assignment.has_submitted ? { color: "green" } : { color: "red" }
                    }>
                      {assignment.has_submitted ? t("studentAssigemnt.submit") : t("studentAssigemnt.notsubmit")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AssignmentList;