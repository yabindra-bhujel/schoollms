import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import AdminLayout from "../navigation/NavigationLayout";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { StudentList, deleteStudent, addStudentFile } from "./StudentService";
import { Link } from "react-router-dom";
import "./style/student.css";
import Avatar from "@mui/material/Avatar";

const AdminStudent = () => {
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
        prevList.filter((student) => student.student_id !== studentToDelete)
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

  const generateSampleCSV = () => {
    const sampleData = [
      [
        "student_id",
        "first_name",
        "last_name",
        "date_of_birth",
        "gender",
        "department",
        "email",
      ],
      ["33", "gakusei", "student", "2024-11-03", "Male", "201", "33@gmail.com"],
    ];

    // Convert data to CSV format
    const csvContent = sampleData.map((e) => e.join(",")).join("\n");

    // Create a Blob from the CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_student_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AdminLayout>
      <div className="admin-student">
        <div className="admin-student-header">
          <h2>All Student List</h2>

          <div className="student-add-btn">
            <a href="#" onClick={generateSampleCSV}>
              Download Sample CSV
            </a>
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
                <TableHead className="admin-student-table-header">
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className="admin-student-table-body">
                  {studentList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow key={student.student_id}>
                        <TableCell>
                          <Avatar
                            alt={student.first_name}
                            src={student.image}
                            sx={{ width: 40, height: 40 }}
                          />
                        </TableCell>
                        <TableCell>{student.student_id}</TableCell>
                        <TableCell>
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell>
                          <p>{student.email}</p>
                        </TableCell>
                        <TableCell>{student.date_of_birth}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <div className="action-btn">
                            <Button
                              onClick={() =>
                                handleStudentDelete(student.student_id)
                              }
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
          </Paper>
          <TablePagination
            className="pagination"
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={studentList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
