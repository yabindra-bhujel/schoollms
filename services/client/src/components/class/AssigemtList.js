import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from 'date-fns-tz';
import { useTranslation } from "react-i18next";
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import instance from "../../api/axios";

const AssignmentList = () => {
  const params = useParams();
  const subject_code = params.subject_code;
  const [assignmentList, setAssignmentList] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAssignmentList();
  }, []);

  const getAssignmentList = async () => {
    try {
      const endpoint = `assignments/assignment-list/${subject_code}/`;
      setIsLoading(true);
      const response = await instance.get(endpoint);
      if (response.data && response.data.length > 0) {
        const assignments = response.data;
        setAssignmentList(assignments);
        const studentSet = new Set();
        assignments.forEach(assignment => {
          assignment.students.forEach(studentId => studentSet.add(studentId));
        });
        const totalUniqueStudents = studentSet.size;
        setTotalStudents(totalUniqueStudents);
      }
    } catch (error) {
      setError("Error fetching assignment list.");
      setTimeout(() =>{
        setOpen(false);
        setError("")
      }, 5000)
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    return format(inputDate, 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Tokyo' });
  };

  const handleVisibilityChange = async (assignmentId, newValue) => {
    try {
      const assignment = assignmentList.find(assignment => assignment.id === assignmentId);
      const deadline = new Date(assignment.deadline);
      const currentDate = new Date();
      if (currentDate <= deadline) {
        setError("The assignment deadline has not yet passed. You cannot change visibility.");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          setError("");
        }, 5000);
        return;
      }
  
      const updatedAssignments = assignmentList.map(assignment => {
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

  if (isLoading) return <Snackbar open={true} message="Fetching data..." />;

  return (
    <div>
      <Snackbar 
        open={open}
        autoHideDuration={5000} 
        onClose={handleCloseSnackbar}
        message={error} />
      <div className="assignment-list">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>{t("task")}</Typography></TableCell>
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>{t("status")}</Typography></TableCell>
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>{t("submitted")}</Typography></TableCell>
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>{t("start date")}</Typography></TableCell>
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>{t("deadline")}</Typography></TableCell>
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>Visibility</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignmentList.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <Link to={`/assignment/${assignment.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <Typography variant="body1" style={{ fontSize: '25px' }}>{assignment.title}</Typography>
                  </Link>
                </TableCell>
                <TableCell className={assignment.is_active ? "active-assignment" : "inactive"}>
                  <Typography variant="body1" style={{ fontSize: '20px', color: assignment.is_active ? 'green' : 'red' }}>{assignment.is_active ? "Available" : "Not Available"}</Typography>
                </TableCell>
                <TableCell><Typography variant="body1" style={{ fontSize: '20px' }}>{assignment.submission_count} / {totalStudents}</Typography></TableCell>
                <TableCell><Typography variant="body1" style={{ fontSize: '20px' }}>{formatDate(assignment.posted_date)}</Typography></TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontSize: '20px', color: new Date(assignment.deadline) > new Date() ? 'green' : 'red' }}>{formatDate(assignment.deadline)}</Typography>
                </TableCell>
                <TableCell>
                  <Switch 
                    defaultChecked={assignment.is_published}
                    disabled={new Date(assignment.deadline) > new Date()}
                    onChange={(event) => handleVisibilityChange(assignment.id, event.target.checked)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssignmentList;
