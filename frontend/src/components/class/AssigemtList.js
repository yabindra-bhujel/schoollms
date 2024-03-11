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
      const endpoint = `/course/${subject_code}/`;
      setIsLoading(true);
      const response = await instance.get(endpoint);
      if (response.data[0] && response.data[0].assignments) {
        const assignments = response.data[0].assignments;
        setAssignmentList(assignments);
        const studentSet = new Set();
        assignments.forEach(assignment => {
          assignment.student.forEach(studentId => studentSet.add(studentId));
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
      const deadline = new Date(assignment.assignment_deadline);
      const currentDate = new Date();
      // 課題の締め切りが過ぎていないかチェックする
      if (currentDate <= deadline) {
        setError("課題の締め切りがまだ過ぎていません。表示を変更できません。");
        setOpen(true);
        setTimeout(() =>{
          setOpen(false);
          setError("")
        }, 5000)

        return;
      }
  
      const updatedAssignments = assignmentList.map(assignment => {
        if (assignment.id === assignmentId) {
          assignment.is_visible = newValue;
        }
        return assignment;
      });
      setAssignmentList(updatedAssignments);
      // 課題の表示を更新するためのPATCHリクエストを送信
      const endpoint = `course/update_assignment_visibility/${assignmentId}/`;
      await instance.put(endpoint, { is_visible: newValue });
    } catch (error) {
      setError("課題の表示を更新する際にエラーが発生しました。");
      setOpen(true);
      setTimeout(() =>{
        setOpen(false);
        setError("")
      }, 5000)
    }
  };
  

  const handleCloseSnackbar = () => {
    setError(null);
  };

  if (isLoading) return <Snackbar open={true} message="データの取得中" />;



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
              <TableCell><Typography  style={{ fontSize: '25px', fontWeight: 'bold' }}>表示/非表示</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignmentList.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <Link to={`/assignment/${assignment.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <Typography variant="body1" style={{ fontSize: '25px' }}>{assignment.assignment_title}</Typography>
                  </Link>
                </TableCell>
                <TableCell className={assignment.is_active ? "active-assignment" : "inactive"}>
                  <Typography variant="body1" style={{fontSize: '20px', color: assignment.is_active ? 'green' : 'red'  }}>{assignment.is_active ? "提出可能" : "提出不可"}</Typography>
                </TableCell>
                <TableCell><Typography variant="body1" style={{ fontSize: '20px' }}>{assignment.submission_count} / {totalStudents}</Typography></TableCell>
                <TableCell><Typography variant="body1" style={{ fontSize: '20px' }}>{formatDate(assignment.assignment_posted_date)}</Typography></TableCell>
                <TableCell>
                <Typography variant="body1" style={{ fontSize: '20px', color:  assignment.is_active ? 'green' : 'red' }}>{formatDate(assignment.assignment_deadline)}
            </Typography>
                  </TableCell>
                <TableCell>
                  <Switch 
                    defaultChecked={assignment.is_visible}
                    disabled={new Date(assignment.assignment_deadline) > new Date()}
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
