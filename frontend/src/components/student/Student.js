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
      const endpoint = `teachers/stduent_list_byteacher/`;
      const response = await instance.get(endpoint);
        setStudentList(response.data);
    } catch (error) {
    }
  };

  console.log(studentList);

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
