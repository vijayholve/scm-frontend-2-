import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { Grid, Box, Typography } from '@mui/material';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

// Define the columns for exams
const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'examName', headerName: 'Exam Name', flex: 1 },
  { field: 'academicYear', headerName: 'Year', width: 100 },
  { field: 'examType', headerName: 'Exam Type', flex: 1 },
  { field: 'schoolName', headerName: 'School', flex: 1 },
  { field: 'className', headerName: 'Class', flex: 1 },
  { field: 'divisionName', headerName: 'Division', flex: 1 },
  { field: 'maxMarksOverall', headerName: 'Total Marks', width: 130 },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 180,
    valueFormatter: (params) => {
      if (!params || !params.startDate) return 'N/A';
      return new Date(params.startDate).toLocaleString();
    }
  }
];

const Exams = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const [allExams, setAllExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllExams = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/api/exams/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
        setAllExams(response.data.content || []);
        setFilteredExams(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
        setAllExams([]);
        setFilteredExams([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllExams();
  }, [accountId]);

  const handleFilterChange = useCallback((newFilters) => {
    let tempFiltered = allExams;
    if (newFilters.schoolId) {
      tempFiltered = tempFiltered.filter(exam => exam.schoolId == newFilters.schoolId);
    }
    if (newFilters.classId) {
      tempFiltered = tempFiltered.filter(exam => exam.classId == newFilters.classId);
    }
    if (newFilters.divisionId) {
      tempFiltered = tempFiltered.filter(exam => exam.divisionId == newFilters.divisionId);
    }
    setFilteredExams(tempFiltered);
  }, [allExams]);

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
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            title="Exams Management"
// <<<<<<< HEAD
            data={filteredExams}
            loading={loading}
            onFiltersChange={handleFilterChange}
            fetchUrl={null}
            isPostRequest={false}
// =======
            // fetchUrl={`/api/exams/getAllBy/${accountId}`}
            columns={columnsConfig}
            editUrl="/masters/exam/edit"
            deleteUrl="/api/exams/delete"
            addActionUrl="/masters/exam/add"
            viewUrl="/masters/exam/view"
            entityName="EXAM"
            customActions={customActions}
            searchPlaceholder="Search exams by name, type, or year..."
            showSearch={true}
            showRefresh={false}
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