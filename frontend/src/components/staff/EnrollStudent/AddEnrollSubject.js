import React, { useState, useEffect } from "react";
import AdminLayout from "../navigation/NavigationLayout";
import { FormHelperText, TextField, Button, Container, Grid } from '@mui/material';
import { Input, FormControl, InputLabel, Select, MenuItem, List, ListItem } from '@mui/material';
import { getTeacherList } from "../Course/CourseService";
import { AdminCourseList } from "../Course/CourseService";
import { StudentList } from "../Student/StudentService";
import { addEnrollSubject } from "./EnrollService";


const AddEnrollSubject = () => {
    const [teacherList, setTeacherList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleSelectStudent = (student) => {
        if (!selectedStudents.includes(student)) {
            setSelectedStudents([...selectedStudents, student]);
            setStudentList(studentList.filter(s => s !== student));
        }
    };

    const handleDeselectStudent = (student) => {
        setSelectedStudents(selectedStudents.filter(s => s !== student));
        setStudentList([...studentList, student]);
    };




    const [enrollSubjectData, setEnrollSubjectData] = useState({
        subject_name: '',
        subject_teacher: '',
        student: []

    });

    const [errors, setErrors] = useState({});


    useEffect(() => {
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

            const student_response = await StudentList("admin");
            const student_name = student_response.map((student) => {
                return student.first_name + " " + student.last_name + " " + student.studentID;
            }

            );
            setStudentList(student_name);
        }
        fetchTeacherList();
    }, []);


    const handleChange = (event) => {
        setEnrollSubjectData({
            ...enrollSubjectData,
            [event.target.name]: event.target.value
        });

    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            subject_name: enrollSubjectData.subject_name,
            subject_teacher: enrollSubjectData.subject_teacher,
            student: selectedStudents
        }
        try {
            const response = await addEnrollSubject("admin", data);
        } catch (error) {
            console.log(error);
            setErrors(error.response.data);
        }
    }


    return (
        <AdminLayout>
            <div className="enroll-student-header">
                <h1> Add Enroll Subject</h1>


            </div>

            {/*  */}
            <Container
                sx={{
                    marginTop: 3,
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth >
                            <InputLabel id="course-department-label">Course Department</InputLabel>
                            <Select

                                labelId="course-department-label"
                                id="course_department"
                                name="subject_name"
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
                    <Grid item xs={12} sm={6} sx={{ bgcolor: 'background.paper' }}> {/* or any color value */}
                        <FormControl fullWidth>
                            <InputLabel id="teacher-name-label">Teacher</InputLabel>
                            <Select
                                labelId="teacher-name-label"
                                id="teacher_name"
                                name="subject_teacher"
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




                    <div className="enroll-student-selector">
                        <Grid item xs={6}>
                            <strong>All Students</strong>
                            {studentList.length > 0 ? (
                                <div className="all-student-list">
                                    <FormControl fullWidth>
                                        <List>
                                            {studentList.map((student, index) => (
                                                <ListItem
                                                    key={index}
                                                    button
                                                    onClick={() => handleSelectStudent(student)}
                                                >
                                                    {student}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </FormControl>
                                </div>
                            ) : (
                                <></>
                            )}
                        </Grid>


                        {/* Selected Students */}
                        <Grid item xs={6}>
                            <strong>Selected Students</strong>

                            {selectedStudents.length === 0 ? (
                                <p></p>
                            ) : (
                                <div className="selected-student-list">
                                    <FormControl fullWidth>
                                        <List>
                                            {selectedStudents.map((student, index) => (
                                                <ListItem
                                                    key={index}
                                                    button
                                                    onClick={() => handleDeselectStudent(student)}
                                                >
                                                    {student}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </FormControl>
                                </div>
                            )}

                        </Grid>
                    </div>



                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>

                    </Grid>








                </Grid>

            </Container>


        </AdminLayout>
    );
}

export default AddEnrollSubject;