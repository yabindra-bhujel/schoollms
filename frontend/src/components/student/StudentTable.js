import * as React from 'react';
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'; 
import "./style/table.css";


export default function DataTable({ studentList }) {
    const navigate = useNavigate();


    const todayDate =  new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

      // Function to handle row click
  const handleRowClick = (params) => {
    navigate(`/student/${params.row.studentID}`, { studentData: params.row });
  };




  const CustomToolbar = () => (
    
    <div style={{ padding: '10px' }}>
        
      <GridToolbarExport csvOptions={{ fileName: `${todayDate}` }} />
    </div>
  );


  const columns = [
    {
      field: 'image',
      headerName: '',
      sortable: false,
      width: 100,
      disableColumnMenu: true,
      headerClassName: "student-col",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Student"
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
      ),
    },
      
      { field: 'studentID', headerName: 'Student ID', headerClassName:"student-col", width: 170 },
    {
      field: 'fullName',
      headerName: 'Student Name',
      width: 200,
      sortable:false,
      disableColumnMenu: true,
      headerClassName:"student-col",
      valueGetter: (params) => `${params.row.first_name || ''} ${params.row.last_name || ''}`,
    },
    { field: 'email', headerName: 'Email', width: 300, disableColumnMenu: true, sortable:false, headerClassName:"student-col" },
    { field: 'gender', headerName: 'Gender', width: 150, disableColumnMenu: true, sortable:false, headerClassName:"student-col" },
    { field: 'phone', headerName: 'Phone', width: 180, disableColumnMenu: true, sortable:false, headerClassName:"student-col" },
    {
      field: 'departmentName',
      headerName: 'Department',
      width: 160,
      sortable:false,
      disableColumnMenu: true,
      headerClassName:"student-col",
      valueGetter: (params) => {
        const department = params.row.department;
        if (Array.isArray(department)) {
          return department.map((dept) => dept.Department_name).join(', ');
        }
        return department ? department.Department_name : '';
      },
    },
  ];




  const rows = studentList?.map((student, index) => ({
    id: index, // Use index as id if studentID is not unique
    studentID: student.studentID,
    first_name: student.first_name,
    last_name: student.last_name,
    email: student.email,
    gender: student.gender,
    phone: student.phone,
    department: student.department, // Assuming it can be an object or an array
    image: student.image,
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        pageSizeOptions={[5, 10]}
        components={
            {
                Toolbar: CustomToolbar,
            }
        }
        onRowClick={handleRowClick}
        checkboxSelection
      />
    </div>
  );
}
