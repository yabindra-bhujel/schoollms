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
  Snackbar,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./style.css";
import { AdminCourseList, DeleteCourse } from "./CourseService";
import { Link } from "react-router-dom";
const AdminCourse = () => {
  const [courseList, setCourseList] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDeleteDialog = (course_id) => {
    setDeleteDialog(true);
    setDeleteCourseId(course_id);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      await DeleteCourse(deleteCourseId);
      setDeleteDialog(false);
      setSnackbar(true);
      setSnackbarMessage("Course Deleted Successfully");
      getCourseList();
    } catch (error) {
      setDeleteDialog(false);
      setSnackbar(true);
      setSnackbarMessage("Failed to delete course");
    }finally{
        setTimeout(() => {
            setSnackbar(false);
            setSnackbarMessage("");
        }, 3000);
    }
  };

  const getCourseList = async () => {
    const response = await AdminCourseList();
    setCourseList(response);
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <AdminLayout>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(false)}
        message={snackbarMessage}
      />

      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this course? may be you will lost some
          data related to this course
          <strong> This action cannot be undone.</strong>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteDialogClose}
          >
            No
          </Button>
          <Button variant="contained" color="primary" onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <div className="admin-course">
        <h1>All Course List.</h1>

        <Link to="/admin/course/add">
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "20px" }}
          >
            Add New Course
          </Button>
        </Link>
      </div>

      <div className="admin-course-list">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject Name</TableCell>
                <TableCell>Subject Code</TableCell>
                <TableCell>Weekday</TableCell>
                <TableCell>Class Start Time</TableCell>
                <TableCell>Class End Time</TableCell>
                <TableCell>Class Room</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Faculty</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {courseList?.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Link to={`/admin/course/${course.subject_code}`}>
                      {course.subject_name}
                    </Link>
                  </TableCell>
                  <TableCell>{course.subject_code}</TableCell>
                  <TableCell>{course.weekday}</TableCell>
                  <TableCell>{course.start_time}</TableCell>
                  <TableCell>{course.end_time}</TableCell>
                  <TableCell>{course.class_room}</TableCell>
                  <TableCell>{course.subject_teacher}</TableCell>
                  <TableCell>{course.subject_faculty}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteDialog(course.subject_code)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </AdminLayout>
  );
};
export default AdminCourse;
