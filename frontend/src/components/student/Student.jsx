// **********************************************************
// ****************************************************

// Import necessary dependencies and components for the 'Student' page.
// - React, useState, useEffect are imported from React for state management and side effects.
// - Layout is a custom navigation component.
// - The stylesheet "student.css" is imported for styling.
// - The 'instance' is imported from "axios" for making API requests.
// - The 'getUserInfo' function is imported from the user API to retrieve user information.
// - The 'StudentTable' component is imported to display the list of students.

import React, { useState, useEffect } from 'react';
import Layout from '../navigations/Layout';
import "./style/student.css";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import StudentTable from './StudentTable';

// The 'Student' functional component is defined.
const Student = () => {
  // State variables are declared using the 'useState' hook.
  // - 'departmants' state is for storing department data (initially an empty array).
  // - 'studentList' state is for storing the list of students (initially an empty array).

  const [departmants, setDepartmants] = useState([]);
  const [studentList, setStudentList] = useState([]);

  // The 'getUserInfo' function is called to retrieve user information.
  const user = getUserInfo();
  // The 'teacher_id' is extracted from the user information.
  const teacher_id = user.username;

  // The 'useEffect' hook is used to fetch the list of students when the component mounts.
  useEffect(() => {
    getStudentList();
  }, []);

  // The 'getStudentList' function is defined to fetch the list of unique students associated with the teacher.
  const getStudentList = async () => {
    try {
      // The API endpoint for fetching teacher data is constructed.
      const endpoint = `/teacher/${teacher_id}/`;
      // An API request is made using the 'instance' object from Axios.
      const response = await instance.get(endpoint);

      // If the response contains subjects with students, process the data.
      if (response.data.subjects && response.data.subjects.length > 0) {
        const studentData = [];
        const uniqueStudents = {}; // Use an object to keep track of unique students

        // Iterate through each subject and its students to create a unique list of students.
        response.data.subjects.forEach((subject) => {
          if (subject.students && subject.students.length > 0) {
            subject.students.forEach((student) => {
              const studentId = student.studentID;

              // Check if the studentId is already in the uniqueStudents object.
              if (!uniqueStudents[studentId]) {
                // Add the student to the uniqueStudents object and the studentData array.
                uniqueStudents[studentId] = true;
                studentData.push({
                  ...student,
                });
              }
            });
          }
        });

        // Set the 'studentList' state with the processed unique student data.
        setStudentList(studentData);
      }
    } catch (error) {
      // Handle errors if any occur during the API request.
      console.error('Error fetching Student data:', error);
    }
  };

  // The 'Student' component returns JSX for rendering the page layout and displaying the list of students.
  return (
    <Layout>
      <section className="student-container">
        <div className="student-list">
          {/* Render the 'StudentTable' component with the 'studentList' data. */}
          <StudentTable studentList={studentList} />
        </div>
      </section>
    </Layout>
  );
};

// Export the 'Student' component as the default export.
export default Student;
