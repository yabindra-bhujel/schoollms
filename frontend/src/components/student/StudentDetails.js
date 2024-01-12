import React, { useState, useEffect } from "react";
import Layout from "../navigations/Layout";
import { useParams } from "react-router-dom";
import "./style/studentdetails.css";
import instance from "../../api/axios";


const StudentDetails = () => {
  const params = useParams();
  const studentID = params.studentID;

  const [student, setStudent] = useState({});
  const [parents, setParents] = useState([]);

  useEffect(() => {
    getStudentData();
  }, []);

  const getStudentData = async () => {
    try {
      const endpoint = `/student/${studentID}/`;
      const response = await instance.get(endpoint);

      setStudent(response.data.student);
      setParents(response.data.student.parents);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout>
      <div className="student-details">
        <div class="top-bar-view">
          <div className="student-info">
            <div className="student-profile">
              <div className="student-image">
                <img src={student.image} alt="" />
              </div>
              <div className="student-info">
                <h1>
                  {student.first_name} {student.last_name}
                </h1>
                <p>Student ID: {student.studentID}</p>
              </div>
            </div>
          </div>
          <div className="button">
            <button>
             Export XLS
            </button>
            <button>
       Export CSV
            </button>
          </div>
        </div>
        <div className="other-info">
          <div className="general-info">
            <h3>First Name</h3>
            <h2>{student.first_name}</h2>

            <h3>Last Name</h3>
            <h2>{student.last_name}</h2>

            <h3>Meddel Name</h3>
            <h2>{student.middle_name}</h2>

            <h3>Date of birth</h3>
            <h2>{student.date_of_birth}</h2>
          </div>

          <div className="gender-info">
            <h3>Gender</h3>
            <h2>{student.gender}</h2>

            <h3>Student ID</h3>
            <h2>{student.studentID}</h2>

            <h3>Phone Number</h3>
            <h2>{student.phone}</h2>

            <h3>Email</h3>
            <h2>{student.email}</h2>
          </div>

          <div className="address-info">
            <h3>Country</h3>
            <h2>{student.country}</h2>

            <h3>City</h3>
            <h2>{student.city}</h2>

            <h3>State</h3>
            <h2>{student.state}</h2>

            <h3>Zip Code</h3>
            <h2>{student.zip_code}</h2>
          </div>

          <div className="parents-info">
            <h2>Parents' Information</h2>
            {parents.map((parent, index) => (
              <div key={index} className="parent-info">
                <h3>Father Name</h3>
                <h2>{parent.father_name}</h2>

                <h3>Mother Name</h3>
                <h2>{parent.mother_name}</h2>

                <h3>Parent Phone Number</h3>
                <h2>{parent.parent_phone}</h2>

                <h3>Parent Email</h3>
                <h2>{parent.parent_email}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDetails;
