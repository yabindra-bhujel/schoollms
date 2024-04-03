import React, { useState, useEffect } from "react";
import AdminLayout from "../navigation/NavigationLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import "./style.css";
import { getEnrollSubjetList } from "./EnrollService";
import { Link } from "react-router-dom";

const EnrollStudent = () => {
  const [enrollSubjectList, setEnrollSubjectList] = useState([]);

  const getEnrollSubjectListData = async () => {
    const response = await getEnrollSubjetList();
    setEnrollSubjectList(response.data);
  };

  useEffect(() => {
    getEnrollSubjectListData();
  }, []);

  return (
    <AdminLayout>
      <div className="enroll-student-header">
        <h1>Enroll Subject</h1>
        <Link to="/admin/enroll/add">
          <Button
            variant="contained"
            color="primary"
            href="/admin/enroll-student/add"
          >
            Add Enroll Subject
          </Button>
        </Link>
      </div>

      <div className="enroll-subject">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Weekday</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Total Student</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollSubjectList.map((enrollSubject) => (
                <TableRow key={enrollSubject.id}>
                  <TableCell>{enrollSubject.subject.subject_name}</TableCell>
                  <TableCell>{enrollSubject.subject.weekday}</TableCell>
                  <TableCell>{enrollSubject.teacher}</TableCell>
                  <TableCell>{enrollSubject.student.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </AdminLayout>
  );
};

export default EnrollStudent;
