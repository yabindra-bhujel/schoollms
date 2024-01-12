import React from 'react';
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

export default function DataTable({ attendanceData, newcolumns, setColumns, setStudentIds, studentIds }) {
  const CustomToolbar = () => (
    <div style={{ padding: '10px' }}>
      <GridToolbarExport csvOptions={{ fileName: `${attendanceData.course}` }} />
      <hr />
    </div>
  );

  const { t } = useTranslation();

  const uniqueDates = attendanceData
    ? Array.from(new Set(attendanceData.map((entry) => entry.date)))
    : [];

  const rows = attendanceData
    ? attendanceData.reduce((acc, entry) => {
        entry.students_attended?.forEach((student) => {
          const existingRow = acc.find((row) => row.id === student.student_id);

          if (existingRow) {
            existingRow[entry.date] = student.is_present;
          } else {
            const newRow = {
              id: student.student_id,
              fullName: student.full_name,
              course: entry.course,
              [entry.date]: student.is_present,
            };
            acc.push(newRow);
          }
        });

        return acc;
      }, [])
    : [];

  let final_data = [];

  if (rows && rows.length > 0) {
    final_data = rows;

  } else if (attendanceData) {
    final_data = attendanceData.map((student) => ({
      id: student.student_id,
      fullName: student.full_name,
      course: student.course,
    }));
  }


  // Existing columns (id, fullName, course, dates)
  let existingColumns = [
    { field: 'id', headerName: t('teacherAttdance.studentNumber'), width: 200 },
    { field: 'fullName', headerName: t('teacherAttdance.studentName'), width: 200, sortable: false },
    { field: 'course', headerName: t('teacherAttdance.courseName'), width: 200, sortable: false },
    ...(rows && rows.length > 0
      ? uniqueDates.map((date) => ({
          field: date,
          headerName: date,
          width: 200,
          sortable: false,
          renderCell: (params) => (
            <span>
              {params.row[date] ? (
                <strong style={{ color: 'green' }}>{t('teacherAttdance.present')}</strong>
              ) : (
                <strong style={{ color: 'red' }}>{t('teacherAttdance.absent')}</strong>
              )}
            </span>
          ),
        }))
      : []),
    ... newcolumns.map((column, columnIndex) => ({
    field: column.columnName,
    headerName: column.columnName,
    width: 200,
    sortable: false,
    renderCell: (params) => {
      const studentId = params.row.id; 
      const isChecked = column.values[studentId];
      const handleCheckboxChange = (event) => {
        let updatedColumns = [...newcolumns];
        // Ensure that the values object exists for the column
        if (!updatedColumns[columnIndex].values) {
          updatedColumns[columnIndex].values = {};
        }
        // Update the value for this specific student ID

        updatedColumns[columnIndex].values[studentId] = event.target.checked;
        // Update the state with the new columns array

        setStudentIds({ ...studentIds, [studentId]: event.target.checked });
        setColumns(updatedColumns);
        console.log(updatedColumns)
      };

      return (
        <input
          type="checkbox"
          checked={isChecked || false}
          onChange={handleCheckboxChange}
        />
      );
    },
  }))
];


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={final_data}
        columns={existingColumns}
        pageSize={5}
        components={{
          Toolbar: CustomToolbar,
        }}
        pagination
        rowsPerPageOptions={[5, 10]}
      />
    </div>
  );
}
