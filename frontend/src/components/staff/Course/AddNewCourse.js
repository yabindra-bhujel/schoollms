import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
  import { FormHelperText, TextField, Button, Container, Grid, Snackbar } from '@mui/material';
import { Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AdminLayout from "../navigation/NavigationLayout";


import instance from "../../../api/axios";

import { getTeacherList , getDepartmentList, adminCourseAdd} from "./CourseService";


const AdminCourseAdd = () => {
    const [courseData, setCourseData] = useState({
        course_id: '',
        course_name: '',
        weekday: '',
        class_period: '',
        course_department: '',
        teacher_name: '',
    });
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [teacherList, setTeacherList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const navigator = useNavigate();
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleSnackbarClose = () => {
        setSnackbar(false);
    }





    useEffect(() => {
        const fetchTeacherList = async () => {
            const response = await getTeacherList();
            const full_name = response.map((teacher) => {  
                return teacher.first_name + " " + teacher.last_name  + " " + teacher.TeacherID;
            }
            );
            setTeacherList(full_name);

            const department_response = await getDepartmentList();
            const department_name = department_response.map((department) => {       
                return department.Department_name;
            }
            );
            setDepartmentList(department_name);
        }
        fetchTeacherList();
    }, []);



    const handleChange = (event) => {
        setCourseData({
            ...courseData,
            [event.target.name]: event.target.value
        });
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validation rules
        if (!courseData.course_id.trim()) {
            newErrors.course_id = 'Course Code is required';
            isValid = false;

        }

        if (!courseData.course_name.trim()) {
            newErrors.course_name = 'Course Name is required';
            isValid = false;

        }

 

        setErrors(newErrors);
        return isValid;
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {

            
            try {
                const response = await adminCourseAdd(courseData);
                if (response.status === 201) {
                    navigator('/admin/course');


                }else{
                    setSnackbar(true);
                    setSnackbarMessage("Error Adding Course Please Try Again");


                }

            } catch (error) {
                setSnackbar(true);
                setSnackbarMessage("Error Adding Course Please Try Again");
            }
        }
    }



    return (
        <AdminLayout>
            <div className="admin-course">
                <h1>Add New Course</h1>
            </div>

            <Container
                sx={{
                    marginTop: 10,
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="course_id"
                            name="course_id"
                            label="Course Code"
                            fullWidth
                            error={!!errors.course_id}
                            helperText={errors.course_id}
                            value={courseData.course_id}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="course_name"
                            name="course_name"
                            label="Course Name"
                            fullWidth
                            error={!!errors.course_name}
                            helperText={errors.course_name}
                            value={courseData.course_name}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <InputLabel id="weekday-label">Weekday</InputLabel>
                            <Select
                                labelId="weekday-label"
                                id="weekday"
                                name="weekday"
                                value={courseData.weekday}
                                label="Weekday"
                                onChange={handleChange}
                            >
                                {weekdays.map((day, index) => (
                                    <MenuItem key={index} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <InputLabel id="class-period-label">Class Time</InputLabel>
                            <Select
                                labelId="class-period-label"
                                id="class_period"
                                name="class_period"
                                value={courseData.class_period}
                                label="Class Time"
                                onChange={handleChange}
                            >
                                {[1, 2, 3, 4, 5].map((period) => (
                                    <MenuItem key={period} value={period}>{period}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>



                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <InputLabel id="course-department-label">Course Department</InputLabel>
                            <Select

                                labelId="course-department-label"
                                id="course_department"
                                name="course_department"
                                value={courseData.course_department}
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
                                value={courseData.teacher_name}
                                label="Teacher Name"
                                onChange={handleChange}
                            >
                                {teacherList.map((teacher, index) => (
                                    <MenuItem key={index} value={teacher}>{teacher}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Add Course
                        </Button>

                    </Grid>
                </Grid>
            </Container>
        </AdminLayout>
    )
}


export default AdminCourseAdd;
