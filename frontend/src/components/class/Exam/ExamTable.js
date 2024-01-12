import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import "../style/table.css";

export default function ExamSubmission() {
  const { t } = useTranslation();


const columns = [
  {
    field: 'id',
    headerName: t('examTable.studentID'),
    width: 200,
    headerClassName: 'headerStyle',
  },
  {
    field: 'fullName',
    headerName: t('examTable.studentName'),
    width: 200,
    headerClassName: 'headerStyle',
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'courseName',
    headerName: t('examTable.subjectName'),
    width: 200,
    headerClassName: 'headerStyle',
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'submissionTime',
    headerName: t('examTable.submissionTime'),
    width: 200,
    headerClassName: 'headerStyle',
  },
  {
    field: 'takenTime',
    headerName: t('examTable.takeTime'),
    width: 200,
    headerClassName: 'headerStyle',
  },
  {
    field: 'submissionfile',
    headerName: t('examTable.submissionFile'),
    width: 200,
    headerClassName: 'headerStyle',
  },
];


  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 15]}
        checkboxSelection
      />
    </div>
  );
}
