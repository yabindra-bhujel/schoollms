import React, { useState, useEffect} from "react";

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
    const [search, setSearch] = useState("");

    const getEnrollSubjectList = async () => {
        const response = await getEnrollSubjetList("admin");
        setEnrollSubjectList(response.data);
    }

    useEffect(() => {
        getEnrollSubjectList();
    }
    , []);



    return (
        <AdminLayout>
            <div className="enroll-student-header">
                <h1>Enroll Subject</h1>

                <Link to="/admin/enroll/add">
                <Button variant="contained" color="primary" href="/admin/enroll-student/add">
                    Add Enroll Subject
                </Button>


                </Link>
               
                </div>


                <div className="enroll-subject">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject </TableCell>
                                    <TableCell>Teacher</TableCell>
                                    <TableCell>Total Student</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {enrollSubjectList?.map((enrollSubject) => (
                                    <TableRow key={enrollSubject.id}>
                                        <TableCell>{enrollSubject.subject_name}</TableCell>
                                        <TableCell>{enrollSubject.teacher_name}</TableCell>
                                        <TableCell>{enrollSubject.total_students}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </div>







                
                
        </AdminLayout>
    );
}

export default EnrollStudent;