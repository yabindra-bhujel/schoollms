import React, { useState, useEffect } from "react";
import AdminLayout from "../navigation/NavigationLayout";
import { FormHelperText, TextField, Button, Container, Grid } from '@mui/material';
import {Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getTeacherList } from "../Course/CourseService";
import { AdminCourseList } from "../Course/CourseService";

const AddEnrollSubject = () => {
    const [teacherList, setTeacherList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    const [enrollSubjectData, setEnrollSubjectData] = useState({
        subject_name: '',
        subject_teacher: '',
        student: []

    });

    const [errors, setErrors] = useState({});


    useEffect(() =>{
        const fetchTeacherList = async () => {
            const response = await getTeacherList("admin");
            const full_name = response.map((teacher) => {
                return teacher.first_name + " " + teacher.last_name + " " + teacher.TeacherID;
            }
            );
            setTeacherList(full_name);

            const course_response = await AdminCourseList();
            const department_name = course_response.map((course) => {
                return course.subject_name;
            }
            );
            setDepartmentList(department_name);
        }
        fetchTeacherList();
    }, []);


    const handleChange = (event) => {
        setEnrollSubjectData({
            ...enrollSubjectData,
            [event.target.name]: event.target.value
        });

    }


    return (
        <AdminLayout>
            <div className="enroll-student-header">
                <h1> Add Enroll Subject</h1>
                

                </div>

                {/*  */}
                <Container>
                    <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <InputLabel id="course-department-label">Course Department</InputLabel>
                            <Select

                                labelId="course-department-label"
                                id="course_department"
                                name="course_department"
                                value={enrollSubjectData.subject_name}
                                label="Course Department"
                                onChange={handleChange}
                            >
                                {departmentList.map((department, index) => (
                                    <MenuItem key={index} value={department}>{department}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <InputLabel id="teacher-name-label">Teacher</InputLabel>
                            <Select
                                labelId="teacher-name-label"
                                id="teacher_name"
                                name="teacher_name"
                                value={enrollSubjectData.subject_teacher}
                                label="Teacher Name"
                                onChange={handleChange}
                            >
                                {teacherList.map((teacher, index) => (
                                    <MenuItem key={index} value={teacher}>{teacher}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                        </Grid>

                    </Container>


                </AdminLayout>
    );
}

export default AddEnrollSubject;