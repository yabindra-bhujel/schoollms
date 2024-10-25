import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../../api/axios';
import { useTranslation } from 'react-i18next';
import './style/attendance.css';
import Alert from '@mui/material/Alert';

const StudentAttendance = () => {
  const { id } = useParams();
  const [attendanceList, setAttendanceList] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading]= useState(false);

  useEffect(() => {
    getAttendanceList();
  }, []);

  const getAttendanceList = async () => {
    try {
      const endpoint = `attendance/get_attendance_by_student/${id}/`;
      setLoading(true);
      const response = await instance.get(endpoint);
      if (response.data && response.data.attendance) {
        const formattedData = response.data.attendance.map((item, index) => ({
          id: index + 1,
          date: item.date,
          status: item.is_present ? t('studentAssigemnt.present') : t('studentAssigemnt.absent'),
          subject: item.course
        }));
        setAttendanceList(formattedData);
        setLoading(false);
      } else {
      }
    } catch (error) {
    }
  };

  return (
    <div className="attendance-container">
      <div  className='student-attendance-header'>
        <h2>出席一覧</h2>
        <div></div>
      </div>
      {loading && <div className="loading-container">
        <div className="spinner"></div>
        </div>}

      {attendanceList.length === 0 &&   <Alert variant="filled" severity="info">
        出席データがありません。
      </Alert>}
      <table className="student-attendance-table">
        <thead>
          <tr>
            <th>科目名</th>
            <th>日付</th>
            <th>
              出席状況
            </th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((attendance) => (
            <tr key={attendance.id}>
              <td>{attendance.subject}</td>
              <td>{attendance.date}</td>
              <td className={attendance.status === t('studentAssigemnt.absent') ? 'absent-cell' : ''}>
                {attendance.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAttendance;
