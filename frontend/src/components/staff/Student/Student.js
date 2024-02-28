import React, { useEffect, useState, useRef } from "react";
import {
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminLayout from "../navigation/NavigationLayout";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import Alert from "@mui/material/Alert";
import { StudentList, deleteStudent, addStudentFile } from "./StudentService";
import { Link } from "react-router-dom";
import "./style/student.css";
import Avatar from '@mui/material/Avatar';


const AdminStudent = () => {
  const [searchText, setSearchText] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);




  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      uploadStudentFile(file);
    } else {
      setSnackbarMessage("Please select a CSV file.");
      setOpenSnackbar(true);
    }
  };

  const uploadStudentFile = async (file) => {
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", file);

      await addStudentFile(formData);
      fetchData();
      setSnackbarMessage("Student successfully added.");
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMessage("Failed to add student. Check your CSV file.");
      setOpenSnackbar(true);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleReadFileButtonClick = () => {
    if (selectedFile) {
      uploadStudentFile();
    } else {
      setSnackbarMessage("Please select a CSV file.");
      setOpenSnackbar(true);
    }
  };

  const handleStudentDelete = (studentID) => {
    setStudentToDelete(studentID);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStudent(studentToDelete);
      setStudentList((prevList) =>
        prevList.filter((student) => student.studentID !== studentToDelete)
      );
      setSnackbarMessage("Student successfully deleted.");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete student.");
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
    setStudentToDelete(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setStudentToDelete(null);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await StudentList();
      setStudentList(response.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setSnackbarMessage("You are not authorized to view this page.");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("An error occurred while fetching data.");
        setOpenSnackbar(true);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <AdminLayout>
      <div className="admin-student">
        <div className="admin-student-header">
          <h2>All Student List</h2>

          <div className="student-add-btn">
            <input
              type="file"
              style={{ display: "none" }}
              accept=".csv"
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingFile}
            >
              {uploadingFile ? "Uploading..." : "Read File"}
            </Button>

            <Link to="/admin/student/add">
              <Button variant="contained" color="primary">
                Add New Student
              </Button>
            </Link>
          </div>
        </div>

        <div className="admin-student-table">
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                    </TableCell>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow key={student.studentID}>
                        <TableCell>
                          <Avatar
                            alt={student.first_name}
                            src={student.image}
                            sx={{ width: 40, height: 40 }}
                          />
                          
                        </TableCell>
                        <TableCell>{student.studentID}</TableCell>
                        <TableCell>
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>
                          <p>{student.email}</p>
                        </TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{student.date_of_birth}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <div className="action-btn">
                            <Button
                              onClick={() => handleStudentDelete(student.studentID)}
                              variant="outlined"
                              color="secondary"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={studentList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Student"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this student? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </AdminLayout>
  );
};

export default AdminStudent;
