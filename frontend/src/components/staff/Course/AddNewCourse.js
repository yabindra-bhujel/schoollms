import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminCourseList, DeleteCourse } from "./CourseService";
import { FormHelperText, TextField, Button, Container, Grid } from '@mui/material';
import { Input, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


import AdminLayout from "../navigation/NavigationLayout";


import instance from "../../../api/axios";



const AdminCourseAdd = () => {
    const [courseData , setCourseData] = useState({
        course_id: '',
        course_name: '',
        weekday: '',
        class_period: '',
        course_department: '',
        teacher_name: '',
    });

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

        if (!courseData.weekday.trim()) {
            newErrors.weekday = 'Weekday is required';
            isValid = false;

        }

        if (!courseData.class_period.trim()) {
            newErrors.class_period = 'Class Time is required';
            isValid = false;

        }


        if (!courseData.course_department.trim()) {
            newErrors.course_department = 'Course Department is required';
            isValid = false;

        }

        if (!courseData.teacher_name.trim()) {
            newErrors.teacher_name = 'Teacher Name is required';
            isValid = false;

        }

        setErrors(newErrors);
        return isValid;
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
           console.log(courseData);
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
                            error = {!!errors.course_id}
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
                            error = {!!errors.course_name}
                            helperText={errors.course_name}
                            value={courseData.course_name}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="Weekday"
                            name="Weekday"
                            label="Weekday"
                            fullWidth
                            error = {!!errors.weekday}
                            helperText={errors.weekday}
                            value={courseData.weekday}
                            onChange={handleChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="Class_period"
                            name="Class_period"
                            label="Class Time"
                            fullWidth
                            error = {!!errors.class_period}
                            helperText={errors.class_period}
                            value={courseData.class_period}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="course_department"
                            name="course_department"
                            label="Course Department"
                            fullWidth
                            error = {!!errors.course_department}
                            helperText={errors.course_department}
                            value={courseData.course_department}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="teacher_name"
                            name="teacher_name"
                            label="Teacher"
                            fullWidth
                            error = {!!errors.teacher_name}
                            helperText={errors.teacher_name}
                            value={courseData.teacher_name}
                            onChange={handleChange}
                        />
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