import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styled from "styled-components";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import { format } from 'date-fns-tz';
import { Link } from "react-router-dom";

const Container = styled.div`
  margin: 5px;
  max-height: 300px; 
  overflow-y: auto; 
`;

const UpcomingAssigmentDeadlines = () => {
    const isTeacher = getUserInfo().isTeacher;
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        getUpcomingAssignmentsDeadlines();
    }, []);

    const getUpcomingAssignmentsDeadlines = async () => {
        try {
            const endpoint = isTeacher ? `teachers/teacher/upcoming_assignment_deadlines/` : `students/upcoming_assignment_deadlines/`;
            const response = await instance.get(endpoint);
            console.log(response.data);
            setAssignments(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    const formatDate = (dateString) => {
        const inputDate = new Date(dateString);
        return format(inputDate, 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Tokyo' });
    };

    return (
        <Container>
            <Typography variant="p" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
                Upcoming Assignment Deadlines
            </Typography>
            {assignments.length === 0 ? (
                <Typography variant="h5" style={{ color: "#666" }}>No upcoming assignments.</Typography>
            ) : (
                <List>
                    {assignments.map((assignment) => (
                        <ListItem key={assignment.id} style={{ backgroundColor: "#f0f0f0", marginBottom: "8px" }}>
                            <Link
                                to={isTeacher ? `/assignment/${assignment.id}` : `/studentassignment/${assignment.id}/${assignment.subject_code}`}
                                style={{ textDecoration: "none", color: "black" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <ListItemIcon>
                                        <CalendarMonthIcon style={{ color: "#3f51b5" }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#333" }}>
                                                {assignment.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography variant="body2" style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem", fontStyle: "italic" }}>
                                                    {formatDate(assignment.deadline)}
                                                </Typography>
                                                <Typography variant="body2" style={{ color: "gray", fontSize: "0.8rem" }}>
                                                    {assignment.subject}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </div>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default UpcomingAssigmentDeadlines;
