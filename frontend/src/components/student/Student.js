import React, { useState, useEffect } from 'react';
import Layout from "../layout/Layout";
import "./style/student.css";
import instance from "../../api/axios";
import getUserInfo from "../../api/user/userdata";
import StudentTable from './StudentTable';

const Student = () => {
  const [studentList, setStudentList] = useState([]);
  const user = getUserInfo();
  const teacher_id = user.username;
  useEffect(() => {
    getStudentList();
  }, []);
  const getStudentList = async () => {
    try {
      const endpoint = `/teacher/${teacher_id}/`;
      const response = await instance.get(endpoint);
      if (response.data.subjects && response.data.subjects.length > 0) {
        const studentData = [];
        const uniqueStudents = {}; 

        response.data.subjects.forEach((subject) => {
          if (subject.students && subject.students.length > 0) {
            subject.students.forEach((student) => {
              const studentId = student.studentID;

              if (!uniqueStudents[studentId]) {
                uniqueStudents[studentId] = true;
                studentData.push({
                  ...student,
                });
              }
            });
          }
        });
        setStudentList(studentData);
      }
    } catch (error) {
    }
  };

  return (
    <Layout>
      <section className="student-container">
        <div className="student-list">
          <StudentTable studentList={studentList} />
        </div>
      </section>
    </Layout>
  );
};

export default Student;
