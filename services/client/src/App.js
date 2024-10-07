import React from "react";
import "./app.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./user/login";
import ProtectedRoute from "./api/user/PrivateRoute";
import ResetPassword from "./user/PasswordReset";
import ResetPasswordConform from "./user/PasswordResetConform";
import Dashboard from "./components/dashbord/Dashbord"
import Student from "./components/student/Student";
import Class from "./components/class/class";
import Survey from "./components/class/survey/survey";
import Setting from "./components/setting/setting";
import CalendarComponent from "./components/calender/Calender";
import ClassDetails from "./components/class/Classdetails";
import AssigmentDetalis from "./components/class/AssigmentDetalis";
import AboutProblems from "./components/codeediter/AboutProblems"
import Chat from "./components/chat/Chat";
import Attendace from "./components/class/attendance/Attendace";
import Notes from "./components/notes/notes";
import StudentTableComponent from "./components/studentclass/Studentclass";
import StudentClassDetails from "./components/studentclass/StudentClassdetails";
import StudentAssigmentDetalis from "./components/studentclass/StudentAssigmentDetalis";
import TakeExamPage from "./components/studentclass/Exam/TakeExam";
import Exma from "./components/studentclass/Exam/Exam";
import './i18n';
import { WebSocketProvider } from './WebSocketContext';
import AdminTeacher from "./components/staff/Teacher/Teacher";
import AdminStudent from "./components/staff/Student/Student";
import User from "./components/staff/User/User";
import AddStudent from "./components/staff/Student/AddStudent";
import AddTeacher from "./components/staff/Teacher/AddTeacher";
import Department from "./components/staff/department/Department";
import AdminCourse from "./components/staff/Course/Course";
import AddNewCourse from "./components/staff/Course/AddNewCourse";
import EnrollStudent from "./components/staff/EnrollStudent/Enroll";
import AddEnrollSubject from "./components/staff/EnrollStudent/AddEnrollSubject";
import CourseDetails from "./components/staff/Course/courseDetails/CourseDetsils";

function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/reset_password/:uid/:token" element={<ResetPasswordConform />} />
          <Route path="/student" element={<ProtectedRoute allowedRoles={['teacher']}><Student /></ProtectedRoute>} />
          <Route path="/class" element={<ProtectedRoute allowedRoles={['teacher']} e><Class /></ProtectedRoute>} />
          <Route path="/class/:subject_code" element={<ProtectedRoute allowedRoles={['teacher']}><ClassDetails /></ProtectedRoute>} />
          <Route path="/assignment/:assignmentID" element={<ProtectedRoute allowedRoles={['teacher']}><AssigmentDetalis /></ProtectedRoute>} />
          <Route path="/attendance/:courseID" element={<ProtectedRoute allowedRoles={['teacher']}><Attendace /></ProtectedRoute>} />
          <Route path="/survey" element={<ProtectedRoute allowedRoles={['teacher']}><Survey /></ProtectedRoute>} />
          <Route path="/studentclass" element={<ProtectedRoute allowedRoles={['student']}><StudentTableComponent /></ProtectedRoute>} />
          <Route path="/studentclassdetails/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentClassDetails /></ProtectedRoute>} />
          <Route path="/studentassignment/:assignmentId/:courseId" element={<ProtectedRoute allowedRoles={['student']}><StudentAssigmentDetalis /></ProtectedRoute>} />
          <Route path="/exam/take/:id" element={<ProtectedRoute allowedRoles={['student']}><TakeExamPage /></ProtectedRoute>} />
          <Route path="/exam/student/:id" element={<ProtectedRoute allowedRoles={['student']}><Exma /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Dashboard /></ProtectedRoute>} />
          <Route path="/calender" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><CalendarComponent /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Notes /></ProtectedRoute>} />
          <Route path="/setting" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Setting /></ProtectedRoute>} />
          <Route path="/codeediter" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><AboutProblems /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute allowedRoles={['student', 'teacher']}><Chat /></ProtectedRoute>} />
          <Route path="/admin/student" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AdminStudent /></ProtectedRoute>
          } />
          <Route path="/admin/student/add" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AddStudent /></ProtectedRoute>
          } />
          <Route path="/admin/teacher" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AdminTeacher /></ProtectedRoute>
          } />
          <Route path="/admin/teacher/add" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AddTeacher /></ProtectedRoute>
          } />
          <Route path="/admin/user" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><User /></ProtectedRoute>
          } />
          <Route path="/admin/department" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><Department /></ProtectedRoute>
          } />
          <Route path="/admin/course" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AdminCourse /></ProtectedRoute>
          } />
          <Route path="/admin/course/add" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AddNewCourse /></ProtectedRoute>
          } />
          <Route path="/admin/enroll" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><EnrollStudent /></ProtectedRoute>
          } />
          <Route path="/admin/enroll/add" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><AddEnrollSubject /></ProtectedRoute>
          } />
          <Route path="/admin/course/:id" element={
            <ProtectedRoute allowedRoles={['staff', 'superuser']}><CourseDetails /></ProtectedRoute>
          } />
          <Route path="*" element={<div><h1>404</h1></div>} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>

  );
}

export default App;
