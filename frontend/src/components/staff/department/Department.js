import React, { useEffect, useState } from "react";
import AdminLayout from "../navigation/NavigationLayout";
import instance from "../../../api/axios";
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
  Snackbar
} from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions ,  Grid,} from "@mui/material";
import "./style.css";

const Department = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const [editedRow, setEditedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); 
  const [departmentName, setDepartmentName] = useState("");
    const [departmentCode, setDepartmentCode] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };


  const handleDeleteDialogOpen = (id) => {
    setOpenDeleteDialog(true);
    setDepartmentToDelete(id);

  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };



  const getDepartmentList = async () => {
    try {
      const endpoint = "/course/department_list/";
      const response = await instance.get(endpoint);
      setDepartmentList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartmentList();
  }, []);

  const handleEditClick = (departmentId) => {
    setEditedRow(departmentId);
  };

  const handleSaveClick = async (departmentId, updatedData) => {
    const username = "admin";

    try {
      const endpoint = `/course/update_department/${username}/${departmentId}/`;
      await instance.put(endpoint, updatedData);
      setEditedRow(null);
      setOpenSnackbar(true);
        setSnackbarMessage("Department successfully updated.");
      getDepartmentList();
    } catch (error) {
      console.log(error);
    }
  };


  const handlePost = async () => {
    const username = "admin";

    try {
      const endpoint = `/course/add_department/${username}/`;
      await instance.post(endpoint, {
        Department_name: departmentName,
        Department_code: departmentCode,
      });
      setDepartmentName("");
      setDepartmentCode("");
      getDepartmentList();
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  }


  const deleteDepartment = async (departmentId) => {
    const username = "admin";

    try {
      const endpoint = `/course/delete_department/${departmentId}/${username}/`;
      await instance.delete(endpoint);
      getDepartmentList();
        setOpenDeleteDialog(false);
        setSnackbarMessage("Department successfully deleted.");
        setOpenSnackbar(true);

    } catch (error) {
      console.log(error);
    }
  }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSnackbar(false);
    }



  return (
    <AdminLayout>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "buttom", horizontal: "center" }}
        />

        <Dialog
            open={openDeleteDialog}
            onClose={handleDeleteClose}
            fullWidth
            maxWidth="sm"
            >
            <DialogTitle>Delete Department</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to delete this department?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteClose} color="secondary">
                Cancel
                </Button>
                <Button
                color="primary"
                onClick={() => {
                    deleteDepartment(departmentToDelete);
                    setOpenDeleteDialog(false);
                }}
                >
                Delete
                </Button>
            </DialogActions>
        </Dialog>

         <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Department</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Department Name"
                  fullWidth
                    variant="standard"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Department Code"
                  fullWidth
                  variant="standard"
                    value={departmentCode}
                    onChange={(e) => setDepartmentCode(e.target.value)}

                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button
              color="primary"
                onClick={handlePost}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      <div>
        <div className="admin-department-header">
        <h1>Department</h1>

        <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: '10px' }}
        onClick={handleDialogOpen}
        >
            Add New Department
        </Button>

        </div>

        <div className="admin-student-table">
          <TableContainer>
            <Table>
              <TableHead
                style={{
                  backgroundColor: "#F5F6FA",
                  color: "#000000",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                <TableRow>
                  <TableCell>Department Name</TableCell>
                  <TableCell>Department Code</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentList.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      {editedRow === department.id ? (
                        <TextField
                          value={department.Department_name}
                          onChange={(e) =>
                            setDepartmentList((prevList) =>
                              prevList.map((d) =>
                                d.id === department.id
                                  ? { ...d, Department_name: e.target.value }
                                  : d
                              )
                            )
                          }
                        />
                      ) : (
                        department.Department_name
                      )}
                    </TableCell>

                    <TableCell>
                      {editedRow === department.id ? (
                        <TextField
                          value={department.Department_code}
                          onChange={(e) =>
                            setDepartmentList((prevList) =>
                              prevList.map((d) =>
                                d.id === department.id
                                  ? { ...d, Department_code: e.target.value }
                                  : d
                              )
                            )
                          }
                        />
                      ) : (
                        department.Department_code
                      )}
                    </TableCell>

                    <TableCell>
                      {editedRow === department.id ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleSaveClick(department.id, {
                              Department_name: department.Department_name,
                              Department_code: department.Department_code,
                            })
                          }
                        >
                          Save
                        </Button>
                      ) : (
                        <>
                        <Button
                        style={{ marginRight: '10px' }}
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEditClick(department.id)}
                        >
                          Edit
                        </Button>


                        <Button
                          variant="outlined"
                        color="secondary"
                          onClick={() => handleDeleteDialogOpen(department.id)}
                        >
                          Delete
                        </Button>

                        </>


                        



                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Department;
