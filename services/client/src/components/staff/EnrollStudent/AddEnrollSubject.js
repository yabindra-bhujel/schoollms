import React, { useState, useEffect } from "react";
import AdminLayout from "../navigation/NavigationLayout";
import { Button, Container, Grid, Snackbar, FormHelperText } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
} from "@mui/material";
import { getTeacherList } from "../Course/CourseService";
import { AdminCourseList } from "../Course/CourseService";
import { StudentList } from "../Student/StudentService";
import { addEnrollSubject } from "./EnrollService";

const AddEnrollSubject = () => {
  const [teacherList, setTeacherList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [enrollSubjectData, setEnrollSubjectData] = useState({
    subject_name: "",
    subject_teacher: "",
    student: [],
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSelectStudent = (student) => {
    if (!selectedStudents.includes(student)) {
      setSelectedStudents([...selectedStudents, student]);
      setStudentList(studentList.filter((s) => s !== student));
    }
  };

  const handleDeselectStudent = (student) => {
    setSelectedStudents(selectedStudents.filter((s) => s !== student));
    setStudentList([...studentList, student]);
  };

  const fatchData = async () => {
    try {
      const teacherresponse = await getTeacherList();
      const full_name = teacherresponse.map((teacher) => {
        return (
          teacher.first_name +
          " " +
          teacher.last_name +
          " " +
          teacher.teacher_id
        );
      });
      setTeacherList(full_name);

      const course_response = await AdminCourseList();
      const department_name = course_response.map((course) => {
        return course.subject_name;
      });
      setDepartmentList(department_name);

      const response = await StudentList();
      const student = response.data;
      const student_name_id = student.map(
        (student) =>
          student.first_name +
          " " +
          student.last_name +
          " " +
          student.student_id
      );
      setStudentList(student_name_id);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  useEffect(() => {
    fatchData();
  }, []);

  const handleChange = (event) => {
    setEnrollSubjectData({
      ...enrollSubjectData,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!enrollSubjectData.subject_name.trim()) {
      newErrors.subject_name = "Course department is required";
      isValid = false;
    }

    if (!enrollSubjectData.subject_teacher.trim()) {
      newErrors.subject_teacher = "Teacher name is required";
      isValid = false;
    }

    if (selectedStudents.length === 0) {
      newErrors.student = "Student is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      subject_name: enrollSubjectData.subject_name,
      subject_teacher: enrollSubjectData.subject_teacher,
      student: selectedStudents,
    };
    try {
      if (validateForm()) {
        const response = await addEnrollSubject(data);
        if (response.status === 201) {
          setSnackbarMessage("Enroll subject added successfully");
          setOpenSnackbar(true);
          setEnrollSubjectData({
            subject_name: "",
            subject_teacher: "",
            student: [],
          });
          setSelectedStudents([]);
          fatchData();
        }
      }
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <AdminLayout>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

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
            <FormControl fullWidth error={!!errors.subject_name}>
              <InputLabel id="course-department-label">
                Course Department
              </InputLabel>
              <Select
                labelId="course-department-label"
                id="course_department"
                name="subject_name"
                value={enrollSubjectData.subject_name}
                label="Course Department"
                onChange={handleChange}
              >
                {departmentList.map((department, index) => (
                  <MenuItem key={index} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
              {errors.subject_name && (
                <FormHelperText>{errors.subject_name}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ bgcolor: "background.paper" }}>
            {" "}
            {/* or any color value */}
            <FormControl fullWidth error={!!errors.subject_teacher}>
              <InputLabel id="teacher-name-label">Teacher</InputLabel>
              <Select
                labelId="teacher-name-label"
                id="teacher_name"
                name="subject_teacher"
                value={enrollSubjectData.subject_teacher}
                label="Teacher Name"
                onChange={handleChange}
                error={!!errors.subject_teacher}
                helperText={errors.subject_teacher}
              >
                {teacherList.map((teacher, index) => (
                  <MenuItem key={index} value={teacher}>
                    {teacher}
                  </MenuItem>
                ))}
              </Select>
              {errors.subject_teacher && <FormHelperText>{errors.subject_teacher}</FormHelperText>}

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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default AddEnrollSubject;
