import React, { useState } from "react";
import "./app.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./user/login";
import ProtectedRoute from "./api/user/PrivateRoute";

// teacher navigation
import Dashboard from "./components/dashbord/Dashbord"
import Student from "./components/student/Student";
import StudentDetails from "./components/student/StudentDetails";
import Class from "./components/class/class";
import Survey from "./components/class/survey/survey";
import ExamDetails from "./components/class/Exam/ExamDetails";
import Setting from "./components/setting/setting";
import CalendarComponent from "./components/calender/Calender";
import ClassDetails from "./components/class/Classdetails";
import AssigmentDetalis from "./components/class/AssigmentDetalis";
import VideoDetails from "./components/learningSection/VideoDetails";
import VideoList from "./components/learningSection/VideoList";
import AboutProblems from "./components/codeediter/AboutProblems"
import FileManager from "./components/filemanager/FileManager";
import { Folder } from "./components/filemanager/Folder";
import Chat from "./components/chat/Chat";
import Attendace from "./components/class/attendance/Attendace";
import Notes from "./components/notes/notes";






import StudentTableComponent from "./components/studentclass/Studentclass";
import StudentClassDetails from "./components/studentclass/StudentClassdetails";
import StudentAssigmentDetalis from "./components/studentclass/StudentAssigmentDetalis";
import TakeExamPage from "./components/studentclass/Exam/TakeExam";
import Exma from "./components/studentclass/Exam/Exam";
import TextEditer from "./components/notes/TextEditer";
import ArticlePage from "./components/learningSection/Article";




import './i18n';
import { useTranslation } from 'react-i18next';
import { WebSocketProvider } from './WebSocketContext';

// admin pages 
import OtpInput from "./components/staff/Auth/OtpInput";
import AdminLayout from "./components/staff/navigation/NavigationLayout";
import AdminTeacher from "./components/staff/Teacher/Teacher";
import AdminStudent from "./components/staff/Student/Student";
import User from "./components/staff/User/User";
import AddStudent from "./components/staff/Student/AddStudent";
import AddTeacher from "./components/staff/Teacher/AddTeacher";
import Department from "./components/staff/department/Department";
import AdminCourse from "./components/staff/Course/Course";
import AddNewCourse from "./components/staff/Course/AddNewCourse";




function App() {
  


  const { t } = useTranslation();


 





  
  return (
    <WebSocketProvider>

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/otp-verification" element={<AdminNavigationBar/> }/> */}


        {/* Protected Routes for Authenticated Users */}

        {/* teacher only url */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['teacher']}><Student /></ProtectedRoute>} />
        <Route path="/student/:studentID" element={<ProtectedRoute allowedRoles={['teacher']}><StudentDetails/></ProtectedRoute>} />
        <Route path="/class" element={<ProtectedRoute allowedRoles={['teacher']}e><Class/></ProtectedRoute>} />
        <Route path="/class/:subject_code" element={<ProtectedRoute allowedRoles={['teacher']}><ClassDetails/></ProtectedRoute>} />
        <Route path="/assignment/:assignmentID" element={<ProtectedRoute allowedRoles={['teacher']}><AssigmentDetalis/></ProtectedRoute>} />
        <Route path="/attendance/:courseID" element={<ProtectedRoute allowedRoles={['teacher']}><Attendace/></ProtectedRoute>} />
        <Route path="/exam/:examID" element={<ProtectedRoute allowedRoles={['teacher']}><ExamDetails/></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute allowedRoles={['teacher']}><Survey/></ProtectedRoute>} />


        {/* student only url */}
        <Route path="/studentclass" element={<ProtectedRoute allowedRoles={['student']}><StudentTableComponent/></ProtectedRoute>} />
        <Route path="/studentclassdetails/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentClassDetails/></ProtectedRoute>} />
        <Route path="/studentassignment/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentAssigmentDetalis/></ProtectedRoute>} />
        <Route path="/exam/take/:id" element={<ProtectedRoute allowedRoles={['student']}><TakeExamPage/></ProtectedRoute>} />
        <Route path="/exam/student/:id" element={<ProtectedRoute allowedRoles={['student']}><Exma/></ProtectedRoute>} />

        {/* common url  for student and teacher only */}
        <Route path="/" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Dashboard/></ProtectedRoute>} />
        <Route path="/calender" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><CalendarComponent/></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Notes/></ProtectedRoute>} />
        <Route path="/textediter/:id" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><TextEditer/></ProtectedRoute>} />
        <Route path="/learningsection" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><VideoList/></ProtectedRoute>} />
        <Route path="/video/:id" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><VideoDetails/></ProtectedRoute>} />
        <Route path="/article/:id" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><ArticlePage/></ProtectedRoute>} />
        <Route path="/setting" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Setting/></ProtectedRoute>} />
        <Route path="/codeediter" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><AboutProblems/></ProtectedRoute>} />
        <Route path="/filemanager" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><FileManager/></ProtectedRoute>} />
        <Route path="/folder/:name" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Folder/></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Chat/></ProtectedRoute>} />


        {/* admin staff only page */}
        <Route path="/admin/student" element = { <AdminStudent/>}/>
        <Route path="/admin/student/add" element = { <AddStudent/>}/>
        <Route path="/admin/teacher" element = { <AdminTeacher/>}/>
        <Route path="/admin/teacher/add" element = { <AddTeacher/>}/>
        <Route path="/admin/user" element = { <User/>}/>
        <Route path="/admin/department" element = { <Department/>}/>
        <Route path="/admin/course" element = { <AdminCourse/>}/>
        <Route path="/admin/course/add" element = { <AddNewCourse/>}/>


        
        {/* Unprotected Route */}
        <Route path="*" element={<div><h1>404</h1></div>}/>
      </Routes>
    </BrowserRouter>
    </WebSocketProvider>

  );
}

export default App;