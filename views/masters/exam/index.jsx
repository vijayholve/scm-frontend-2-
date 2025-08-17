import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { Grid, Box, Typography } from '@mui/material';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';

// Define the columns for exams
const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'examName', headerName: 'Exam Name', flex: 1 },
  { field: 'academicYear', headerName: 'Year', width: 100 },
  { field: 'examType', headerName: 'Exam Type', flex: 1 },
  { field: 'maxMarksOverall', headerName: 'Total Marks', width: 130 },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 180,
    valueFormatter: (params) => {
      if (!params || !params.value) return 'N/A';
      return new Date(params.value).toLocaleString();
    }
  }
];

const Exams = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();

  // Custom actions for exams
  const customActions = [
    {
      icon: <span>👁️</span>,
      label: 'View Exam',
      tooltip: 'View exam details',
      color: 'info',
      onClick: (row) => {
        navigate(`/masters/exam/view/${row.id}`);
      }
    },
    {
      icon: <span>📝</span>,
      label: 'Edit Exam',
      tooltip: 'Edit exam details',
      color: 'primary',
      onClick: (row) => {
        navigate(`/masters/exam/edit/${row.id}`);
      }
    },
    {
      icon: <span>🗑️</span>,
      label: 'Delete Exam',
      tooltip: 'Delete exam',
      color: 'error',
      onClick: (row) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
          console.log('Deleting exam:', row.id);
        }
      }
    }
  ];

  // Data transformation function
  const transformExamData = (exam) => ({
    ...exam,
    startDate: exam.startDate || new Date().toISOString()
  });

  return (
    <MainCard
      // title="Exams Management"
      // secondary={<SecondaryAction icon={<AddIcon />} link="/masters/exam/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            title="Exams Management"
            fetchUrl={`/api/exams/getAll/${accountId}`}
            columns={columnsConfig}
            editUrl="/masters/exam/edit"
            deleteUrl="/api/exams/delete"
            addActionUrl="/masters/exam/add"
            viewUrl="/masters/exam/view"
            entityName="EXAM"
            isPostRequest={true}
            customActions={customActions}
            searchPlaceholder="Search exams by name, type, or year..."
            showSearch={true}
            showRefresh={true}
            showFilters={true}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={10}
            height={600}
            transformData={transformExamData}
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

export default Exams;