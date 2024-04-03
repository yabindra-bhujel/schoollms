import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import Snackbar from "@mui/material/Snackbar";


const getRandomColor = (lastColor) => {
  const colors = ["#FFD700", "#FFA07A", "#98FB98", "#87CEEB", "#F08080", "#DDA0DD", "#ADD8E6", "#FFB6C1", "#20B2AA", "#BA55D3"];
  let newColor;
  do {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  } while (newColor === lastColor);
  return newColor;
};


const TodayCourseListItem = ({ course, lastColor }) => {
  const bgColor = getRandomColor(lastColor);

  return (
    <ListItem
      sx={{
        padding: 0.3,
        backgroundColor: bgColor,
        borderRadius: 1,
        marginBottom: 1,
      }}
    >
      <ListItemText
        primary={
          <Typography variant="body2" fontWeight="bold">
            {course.subject_name}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="textSecondary">
            {`Room: ${course.class_room}, Period: ${course.class_period}, Time: ${course.period_start_time}-${course.period_end_time}`}
          </Typography>
        }
      />
    </ListItem>
  );
};

const TodayCourseList = () => {
  const username = getUserInfo().username;
  const isTeacher = getUserInfo().isTeacher;
  const [todayCourseList, setTodayCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const getTodayCourse = async () => {
    const endpoint = isTeacher ? `/teachers/teacher_today_class/` : `/student/get_student_today_class/`;

    try {
      const response = await instance.get(endpoint);
      if (response.status === 200) {
        setTodayCourseList(response.data.map((course, index) => ({ ...course, color: "" })));
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarMessage("Failed to fetch today's courses.Contact admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodayCourse();
  }, []);

  return (
    <>
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={6000}
      onClose={() => setIsSnackbarOpen(false)}
      message={snackbarMessage}
    />
    <Box m={1}>
        <strong>Today's Courses</strong>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : todayCourseList.length > 0 ? (
        <List>
          {todayCourseList?.map((course, index) => (
            <TodayCourseListItem
              key={index}
              course={course}
              lastColor={index > 0 ? todayCourseList[index - 1].color : ""}
            />
          ))}
        </List>
      ) : (
        <Typography>No courses scheduled for today.</Typography>
      )}
    </Box>
    </>
  );
};

export default TodayCourseList;
