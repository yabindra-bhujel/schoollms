import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import "./style/style.css";
import AdminLayout from "../navigation/NavigationLayout";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import { getTeacherList, deleteTeacher, uploadTeahcerFile } from "./TeacherService";
import Avatar from '@mui/material/Avatar';

const AdminTeacher = () => {
  const [teacherList, setTeacherList] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fileInputRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      uploadTeacherFile(file);
    } else {
      setSnackbarMessage("Please select a CSV file.");
      setOpenSnackbar(true);
    }
  };

  const uploadTeacherFile = async (file) => {
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", file);

      await uploadTeahcerFile(formData);

      setSnackbarMessage("Teacher successfully added.");
      setOpenSnackbar(true);
      fetchData();


    } catch (err) {
      setSnackbarMessage("Failed to add teacher.");
      setOpenSnackbar(true);
    } finally {
      setUploadingFile(false);
    }
  };


  const fetchData = async () => {
    try {
      const response = await getTeacherList();
      setTeacherList(response);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchData();
  }, [])


  const handleTeacherDelete = (teacherID) => {
    setTeacherToDelete(teacherID);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTeacher(teacherToDelete);
      setTeacherList((prevList) =>
        prevList.filter((teacher) => teacher.teacher_id !== teacherToDelete)
      );
      setSnackbarMessage("Teacher successfully deleted.");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete teacher.");
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
    setTeacherToDelete(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTeacherToDelete(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };


  const generateSampleCSV = () => {
    const sampleData = [
      [
        "teacher_id",
        "first_name",
        "last_name",
        "date_of_birth",
        "gender",
        "email",
      ],
      ["33", "Teacher", "Sensei", "2024-11-03", "Male", "33@gmail.com"],
    ];

    // Convert data to CSV format
    const csvContent = sampleData.map((e) => e.join(",")).join("\n");

    // Create a Blob from the CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_teacher_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  return (
    <AdminLayout>
      <div className="admin-teacher">
        <div className="admin-teacher-header">
          <h2>Teacher List</h2>

          <div className="add-new-teacher">
          <a href="#" onClick={generateSampleCSV}>
              Download Sample CSV
            </a>
            <input
              type="file"
              style={{ display: 'none' }}
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
              {uploadingFile ? 'Uploading...' : 'Read File'}
            </Button>

            <Link to="/admin/teacher/add">
              <Button variant="contained" color="primary">
                Add New Teacher
              </Button>
            </Link>
          </div>
        </div>

        <div className="admin-student-table">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>

                  </TableCell>
                  <TableCell>Teacher ID</TableCell>
                  <TableCell>Teacher Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teacherList.map((teacher) => (
                  <TableRow key={teacher.teacher_id}>
                    <TableCell>
                      {/* image */}
                      <Avatar alt={teacher.first_name} src={teacher.image}
                        sx={{ width: 40, height: 40 }}
                      />

                    </TableCell>
                    <TableCell>{teacher.teacher_id}</TableCell>
                    <TableCell>
                      {teacher.first_name} {teacher.last_name}
                    </TableCell>
                    <TableCell>
                      <p>{teacher.email}</p>
                    </TableCell>
                    <TableCell>{teacher.date_of_birth}</TableCell>
                    <TableCell>{teacher.gender}</TableCell>
                    <TableCell>
                      <div className="action-btn">
                        <Button
                          onClick={() => handleTeacherDelete(teacher.teacher_id)}
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
        </div>

      </div>



      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Teacher"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this teacher ? This
            action cannot be undone. And also may can delete teacher related data .
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

  )
}
export default AdminTeacher;