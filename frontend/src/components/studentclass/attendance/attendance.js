import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import instance from '../../../api/axios';
import { useParams } from 'react-router-dom';
import getUserInfo from '../../../api/user/userdata';
import { useTranslation } from 'react-i18next';

const StudentAttendance = () => {
  const { id } = useParams();
  const [attendanceList, setAttendanceList] = React.useState([]);
  const studentID = getUserInfo().username;
  const { t } = useTranslation();

  React.useEffect(() => {
    getAttendanceList();
  }, []);

  const getAttendanceList = async () => {
    try {
      const endpoint = `attendance/get_attendance_by_student/${id}/`;
      const response = await instance.get(endpoint);
      if (response.data && response.data.attendance) {
        const formattedData = response.data.attendance.map((item, index) => ({
          id: index + 1,
          date: item.date,
          status: item.is_present ? t('studentAssigemnt.present') : t('studentAssigemnt.absent'),
          subject: item.course
        }));
        setAttendanceList(formattedData);
      } else {
        console.log(t('studentAssigemnt.noAttendanceData'));
      }
    } catch (error) {
      console.error(t('studentAssigemnt.errorFetchingData'), error);
    }
  }

  const columns = [
    { field: 'subject', headerName: t('studentAssigemnt.subject'), width: 200, sortable: false },
    { field: 'date', headerName: t('studentAssigemnt.date'), width: 200, sortable: false },
    {
      field: 'status',
      headerName: t('studentAssigemnt.status'),
      width: 200,
      sortable: false,
      cellClassName: (params) => params.value === t('absent') ? 'absent-cell' : ''
    }
  ];

  const gridStyles = {
    height: '100%',
    width: '50%',
    '& .absent-cell': { 
      color: 'red',
    },
  };

  return (
    <div style={gridStyles}>
      <DataGrid rows={attendanceList} columns={columns} />
    </div>
  );
};

export default StudentAttendance;
