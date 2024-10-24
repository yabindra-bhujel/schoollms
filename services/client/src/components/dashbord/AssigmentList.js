import React, { useState, useEffect } from 'react';
import './style/AssignmentList.css';
import { FaCheckCircle } from 'react-icons/fa';
import instance from '../../api/axios';
import getUserInfo from '../../api/user/userdata';
import { format } from 'date-fns-tz';
import { Link } from 'react-router-dom';


const AssignmentsTable = () => {
  const isTeacher = getUserInfo().isTeacher;
  const [assignments, setAssignments] = useState([]);

  const getUpcomingAssignmentsDeadlines = async () => {
    try {
      const endpoint = isTeacher ? `teachers/teacher/upcoming_assignment_deadlines/` : `students/upcoming_or_recent_assignment_deadlines/`;
      const response = await instance.get(endpoint);
      setAssignments(response.data);

    } catch (error) {
    }
  }

  useEffect(() => {
    getUpcomingAssignmentsDeadlines();
  }, []);

  const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    return format(inputDate, 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Tokyo' });
};

function truncateText(text, length) {
  return text.length > length ? `${text.slice(0, length)}..` : text;
}

  return (
    <div className="assignments-container">
      <h2>Assignments</h2>
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Title</th>
            <th>Earliest Deadline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr
              key={index}
              className={index % 2 === 1 ? 'highlight-row' : ''}
            >
              <td>{assignment.subject}</td>
              <td>{truncateText(assignment.title, 10)}</td>
              <td>{formatDate(assignment.deadline)}</td>
              <td>
                {assignment.is_complete ? (
                  <div className="checkmark">
                    <FaCheckCircle />
                  </div>
                ) : (
                  <Link
                  to={`/${isTeacher ? `assignment/${assignment.subject_code}/${assignment.id}` : `studentassignment/${assignment.id}/${assignment.subject_code}`} `}
                  className="assignment-link"
                >
                  View
                </Link>

                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsTable;
