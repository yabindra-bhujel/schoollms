import React from 'react';
import './style/AttendanceReport.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AttendanceReport = () => {
  const data = [
    { label: 'Live Class', value: 80, total: '12 out of 15', color: '#26a69a' },
    { label: 'Mentor Sessions', value: 70, total: '1 out of 4', color: '#f08080' },
    { label: 'Class Events', value: 20, total: '5 out of 5', color: '#4169e1' },
  ];

  return (
    <div className="attendance-report">
      <h3>Attendance Report</h3>
      <div className="circles-container">
        {data.map((item, index) => (
        <div className='outer-circle'>

          <div className="circle-item" key={index}>
            <CircularProgressbar
              value={item.value}
              text={`${item.value}%`}
              styles={buildStyles({
                textColor: '#000',
                pathColor: item.color,
                trailColor: '#eee',
              })}
            />
          </div>
          </div>
        ))}
      </div>
      <div className="details-container">
        {data.map((item, index) => (
          <div className="detail-item" key={index}>
            <span className="dot" style={{ backgroundColor: item.color }}></span>
            <span>{item.label}: {item.total}</span>
          </div>
        ))}
      </div>
      <a href="#" className="view-all">View All</a>
    </div>
  );
};

export default AttendanceReport;
