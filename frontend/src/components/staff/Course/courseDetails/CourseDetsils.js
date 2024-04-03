import React, { useEffect, useState } from "react";
import { Typography, Box, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import AdminLayout from "../../navigation/NavigationLayout";
import instance from "../../../../api/axios";
import Snackbar from "@mui/material/Snackbar";
import Syllabus from "./Syllabus";

const CourseDetails = () => {
    const { id } = useParams();
    const [courseDetails, setCourseDetails] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const CLASS_PERIOD = [
        { label: "1限", value: "1" },
        { label: "2限", value: "2" },
        { label: "3限", value: "3" },
        { label: "4限", value: "4" },
        { label: "5限", value: "5" },
        { label: "6限", value: "6" },
    ];

    const fetchData = async () => {
        try {
            const response = await instance.get(`admin/subject/${id}/`);
            setCourseDetails(response.data);
            console.log(response.data);
        } catch (error) {
            setSnackbar(true);
            setSnackbarMessage("Error fetching course details");
        }
    };

    const updateCourseDetails = async () => {
        try {
            const response = await instance.put(`/course/update_course/${id}/`, courseDetails);
            setSnackbar(true);
            setSnackbarMessage("Course details updated successfully");
            setIsEditable(false);
            fetchData();
        } catch (error) {
            setSnackbar(true);
            setSnackbarMessage("Error updating course details");
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = () => {
        setIsEditable(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseDetails({ ...courseDetails, [name]: value });
    };
    return (
        <AdminLayout>
            <Snackbar
                open={snackbar}
                autoHideDuration={4000}
                onClose={() => setSnackbar(false)}
                message={snackbarMessage}
            />
            <Box style={{ overflowY: "auto"}} >
                <Typography 
                    sx={{ marginLeft: "20px", marginTop: "20px"}}
                    variant="h4" gutterBottom>
                    科目詳細
                </Typography>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Subject Name"
                                name="subject_name"
                                value={courseDetails.subject_name || ""}
                                onChange={handleChange}
                                disabled={!isEditable}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Subject Code"
                                name="subject_code"
                                value={courseDetails.subject_code || ""}
                                onChange={handleChange}
                                disabled={!isEditable}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Class Room"
                                name="class_room"
                                value={courseDetails.class_room || ""}
                                onChange={handleChange}
                                disabled={!isEditable}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Period Start Time"
                                name="class_room"
                                value={courseDetails.period_start_time || ""}
                                disabled
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="Period End Time"
                                name="class_room"
                                value={courseDetails.period_end_time || ""}
                                disabled
                                fullWidth
                                margin="normal"
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="class-period-label">Class Period</InputLabel>
                                        <Select
                                            labelId="class-period-label"
                                            id="class-period"
                                            name="class_period"
                                            value={courseDetails.class_period || ""}
                                            onChange={handleChange}
                                            disabled={!isEditable}
                                        >
                                            {CLASS_PERIOD.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="weekday-label">Weekday</InputLabel>
                                        <Select
                                            labelId="weekday-label"
                                            id="weekday"
                                            name="weekday"
                                            value={courseDetails.weekday || ""}
                                            onChange={handleChange}
                                            disabled={!isEditable}
                                        >
                                            <MenuItem value="Monday">Monday</MenuItem>
                                            <MenuItem value="Tuesday">Tuesday</MenuItem>
                                            <MenuItem value="Wednesday">Wednesday</MenuItem>
                                            <MenuItem value="Thursday">Thursday</MenuItem>
                                            <MenuItem value="Friday">Friday</MenuItem>
                                            <MenuItem value="Saturday">Saturday</MenuItem>
                                            <MenuItem value="Sunday">Sunday</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                    {isEditable ? (
                        <>
                            <Button variant="contained" color="primary" onClick={updateCourseDetails} style={{ marginRight: 10 }}>Save</Button>
                            <Button onClick={() => setIsEditable(false)}variant="contained" color="secondary">Cancel</Button>
                        </>) : (
                        <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginRight: 10 }}>Edit</Button>)}
                </form>
            </Box>

            <Box>
            <Typography 
                    sx={{ marginLeft: "20px", marginTop: "20px"}}
            variant="h4" gutterBottom>
                シラバス
                </Typography>

                <Syllabus/>
            </Box>
        </AdminLayout>
    );
};

export default CourseDetails;
