import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

const columnsConfig = [
  { field: 'rollno', headerName: 'Roll No', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
  { field: 'address', headerName: 'Address', width: 110, flex: 1 },
  { field: 'className', headerName: 'Class', width: 110, flex: 1 },
  { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 }
];

const Students = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const [classNames, setClassNames] = useState({});
  const [divisionNames, setDivisionNames] = useState({});

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const classResponse = await api.post(`/api/schoolClasses/getAll/${accountId}`, {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        });

        const classMap = {};
        (classResponse.data.content || []).forEach((cls) => {
          classMap[cls.id] = cls.name;
        });
        setClassNames(classMap);

        const divisionResponse = await api.post(`/api/divisions/getAll/${accountId}`, {
          page: 0,
          size: 1000,
          sortBy: 'id',
          sortDir: 'asc'
        });

        const divisionMap = {};
        (divisionResponse.data.content || []).forEach((div) => {
          divisionMap[div.id] = div.name;
        });
        setDivisionNames(divisionMap);
      } catch (error) {
        console.error('Failed to fetch class/division names:', error);
      }
    };

    fetchNames();
  }, [accountId]);

  const transformStudentData = (student) => ({
    ...student,
    rollno: student.rollNo || student.id,
    name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.userName,
    className: classNames[student.classId] || `Class ID: ${student.classId}` || 'N/A',
    divisionName: divisionNames[student.divisionId] || `Division ID: ${student.divisionId}` || 'N/A'
  });

  const customActions = [
    {
      icon: <span>📚</span>,
      label: 'View Assignments',
      tooltip: 'View student assignments',
      color: 'info',
      onClick: (row) => {
        navigate(`/masters/assignments/student/${row.id}`);
      }
    },
    {
      icon: <span>📊</span>,
      label: 'View Attendance',
      tooltip: 'View student attendance',
      color: 'secondary',
      onClick: (row) => {
        navigate(`/masters/attendance/student/${row.id}`);
      }
    }
  ];
  


  return (
    <MainCard
      title="Students Management"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/student/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            fetchUrl={`/api/users/getAll/${accountId}?type=STUDENT`}
            columns={columnsConfig}
            editUrl="/masters/student/edit"
            deleteUrl="/api/users/delete"
            addActionUrl="/masters/student/add"
            viewUrl="/masters/students/view"
            entityName="STUDENT"
            isPostRequest={true}
            // customActions={customActions}
            searchPlaceholder="Search students by name, email, or roll number..."
            showSearch={true}
            showRefresh={true}
            showFilters={true}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={10}
            height={600}
            transformData={transformStudentData}
            onRowClick={(params) => {
              navigate(`/masters/students/view/${params.row.id}`);
            }}
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={true}
            showDivisionFilter={true}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Students;