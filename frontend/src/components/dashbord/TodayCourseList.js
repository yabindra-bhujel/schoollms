import React, { useState, useEffect } from "react";
import { Typography, Paper, List, ListItem, ListItemText, Box } from "@mui/material";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";

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
        marginBottom: 1,
        padding: 2,
        backgroundColor: bgColor,
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <ListItemText
        primary={
          <Typography variant="h6" fontWeight="bold">
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
  const getTodayCourse = async () => {
    const endpoint = isTeacher ? `/teacher/get_teacher_today_class/${username}/` : `/student/get_student_today_class/${username}/`;

    try {
      const response = await instance.get(endpoint);
      if (response.status === 200) {
        setTodayCourseList(response.data.map((course, index) => ({ ...course, color: "" })));
      }
    } catch (error) {
      console.error("Error fetching today's courses", error);
    }
  };

  useEffect(() => {
    getTodayCourse();
  }, []);

  return (
    <Box m={1}>
      <Typography variant="h5" gutterBottom>
        <strong>Today's Courses</strong>
      </Typography>
      {todayCourseList.length > 0 ? (
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
  );
};

export default TodayCourseList;
