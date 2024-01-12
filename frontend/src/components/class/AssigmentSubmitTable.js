import React, { useState } from 'react';
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import './style/table.css';
import { updateSubmission } from './AssigemntService';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';



export default function DataTable({ submissions }) {
  const { t } = useTranslation();
  const [editingRows, setEditingRows] = useState({});
  const [successMessage, setSuccessMessage] = useState("")

  const CustomToolbar = () => (
    <div style={{ padding: '10px' }}>
      <GridToolbarExport csvOptions={{ fileName: `${submissions.assignment_title}` }} />
      <button  className='score-edit-btn' onClick={handleEditCellSubmit}>{t("update_edite_sale")}</button>
    </div>
  );

  const handleEditCellChange = ({ id, field, props }) => {
    if (field === 'grade') {
      setEditingRows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          grade: props.value,
        },
      }));
    }
  };
  

  const handleEditCellSubmit = () => {
    const editedSubmissions = Object.entries(editingRows).map(([id, editData]) => {
      const submission = submissions.find(s => s.id.toString() === id);
      return {
        ...submission,
        ...editData,
      };
    });

    // if data is null then stop
    if (editedSubmissions.length === 0) {
      return;
    }

    try{
      updateSubmission(editedSubmissions);
      setSuccessMessage("Grades updated successfully!")
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      
      } catch (err) {
        alert("Error updating grades!");
    }
  };

  const columns = [
    { field: 'student_id', headerName: t('studentId'), width: 150, headerClassName: 'headerStyle' },
    { field: 'student_name', headerName: t('fullName'), sortable: false, width: 150, headerClassName: 'headerStyle' },
    { field: 'submission_datetime', headerName: t('submissionDate'),sortable: false, width: 140, headerClassName: 'headerStyle' },
    { field: 'is_submitted', headerName: t('status'), sortable: false, width: 130, headerClassName: 'headerStyle' },
    {
      field: 'is_graded',
      headerName: t('is_graded'),
      width: 100,
      headerClassName: 'headerStyle',
      sortable: false,
      renderCell: (params) => (
        <input type="checkbox" checked={params.value} readOnly style={{ background: params.value ? 'green' : 'red' }} />
      ),
    },
    {
      field: 'grade',
      headerName: t('score'),
      width: 100,
      headerClassName: 'headerStyle',
      sortable: false,
      editable: true,
      renderCell: (params) => (
        <input
          type="number"
          style={{ width: '50px' }}
          value={params.value}
          onChange={(e) => handleEditCellChange({ id: params.id, field: 'grade', props: { value: e.target.value } })}
        />
      ),
    },
    {
      field: 'file',
      headerName: t('submittedFileHeader'),
      width: 200,
      headerClassName: 'headerStyle',
      sortable: false,
      renderCell: (params) => (
        <>
          {params.value?.map((fileObj, index) => (
            <div key={index}>
              <a href={fileObj.url} target="_blank" rel="noopener noreferrer">
                {fileObj.name}
              </a>
            </div>
          ))}
        </>
      ),
    },
  ];

  const rows = submissions.map(submission => ({
    id: submission.id,
    student_id: submission.student_id,
    student_name: submission.student_name,
    submission_datetime: submission.submission_datetime,
    is_submitted: submission.is_submitted ? 'Submitted' : 'Not Submitted',
    is_graded: submission.is_graded,
    grade: editingRows[submission.id]?.grade ?? submission.grade,
    file: submission.assignment_submission_file_url?.map((fileObj) => ({
      name: fileObj.file.split('/').pop(),
      url: fileObj.file,
    })),
  }));

  return (
    <>
    <div>
      {successMessage && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="success">{successMessage}</Alert>
        </Stack>
      )}
      </div>
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={15}
        onEditCellChange={handleEditCellChange}
        editMode="row"
        isCellEditable={(params) => params.row.is_graded && params.row.grade == null}
        components={{
          Toolbar: CustomToolbar,
        }}
        pageSizeOptions={[15, 20]}
      />
    </div>
    </>

  );
}
