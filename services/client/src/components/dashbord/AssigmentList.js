import React from 'react';
import './style/AssignmentList.css';
import { FaCheckCircle } from 'react-icons/fa';

const assignments = [
  { subject: 'Maths', tasks: 2, deadline: '24 Oct', isCompleted: false },
  { subject: 'History', tasks: 1, deadline: '28 Oct', isCompleted: false },
  { subject: 'Science', tasks: 3, deadline: '28 Oct', isCompleted: false },
  { subject: 'Geography', tasks: 1, deadline: '30 Oct', isCompleted: false },
  { subject: 'English', tasks: 0, deadline: '---', isCompleted: true },
  { subject: 'Sanskrit', tasks: 0, deadline: '---', isCompleted: true },
  { subject: 'Hindi', tasks: 0, deadline: '---', isCompleted: true },
];

const AssignmentsTable = () => {
  return (
    <div className="assignments-container">
      <h2>Assignments</h2>
      <table className="assignments-table">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Pending</th>
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
              <td>{assignment.tasks} Task{assignment.tasks !== 1 ? 's' : ''}</td>
              <td>{assignment.deadline}</td>
              <td>
                {assignment.isCompleted ? (
                  <div className="checkmark">
                    <FaCheckCircle />
                  </div>
                ) : (
                  <button className="view-btn">View</button>
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
