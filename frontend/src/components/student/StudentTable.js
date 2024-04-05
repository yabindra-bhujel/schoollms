import * as React from 'react';
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid';
import "./style/table.css";
import { useTranslation } from 'react-i18next';


export default function DataTable({ studentList }) {
    const todayDate =  new Date().toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const CustomToolbar = () => (
        <div style={{ padding: '10px' }}>
            <GridToolbarExport csvOptions={{ fileName: `${todayDate}` }} />
        </div>
    );
    const { t } = useTranslation();
    const columns = [
        { field: 'studentID', headerName: t('studentInfo.idNumber'), headerClassName:"student-col", width: 170 },
        { field: 'fullName', headerName: t('studentInfo.studentName'), width: 200, sortable: false, disableColumnMenu: true, headerClassName: "student-col",
            valueGetter: (params) => `${params.row.first_name || ''} ${params.row.last_name || ''}`,
        },
        { field: 'email', headerName: t('studentInfo.mail'), width: 300, disableColumnMenu: true, sortable: false, headerClassName: "student-col" },
        { field: 'gender', headerName: t('studentInfo.gender'), width: 150, disableColumnMenu: true, sortable: false, headerClassName: "student-col" },
        { field: 'phone', headerName: t('studentInfo.phone'), width: 180, disableColumnMenu: true, sortable: false, headerClassName: "student-col" },
        {
            field: 'departmentName',
            headerName: t('studentInfo.department'),
            width: 160,
            sortable: false,
            disableColumnMenu: true,
            headerClassName: "student-col",
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
        id: index,
        studentID: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        gender: student.gender,
        phone: student.phone,
        department: student.department,
    }));

    return (
        <div className='student-table'>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                pageSizeOptions={[5, 10]}
                components={{ Toolbar: CustomToolbar }}
            />
        </div>
    );
}
