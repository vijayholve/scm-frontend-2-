import React, { useState, useEffect, useCallback } from 'react';
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
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
  { field: 'address', headerName: 'Address', width: 110, flex: 1 }
];

const Teachers = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllTeachers = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/api/users/getAll/${accountId}?type=TEACHER`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
        setAllTeachers(response.data.content || []);
        setFilteredTeachers(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        setAllTeachers([]);
        setFilteredTeachers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTeachers();
  }, [accountId]);

  const handleFilterChange = useCallback((newFilters) => {
    let tempFiltered = allTeachers;
    if (newFilters.schoolId) {
      tempFiltered = tempFiltered.filter(teacher => teacher.schoolId == newFilters.schoolId);
    }
    setFilteredTeachers(tempFiltered);
  }, [allTeachers]);

  const customActions = [
    {
      icon: <span>📚</span>,
      label: 'View Subjects',
      tooltip: 'View assigned subjects',
      color: 'info',
      onClick: (teacher) => {
        navigate(`/masters/subjects/teacher/${teacher.id}`);
      }
    },
    {
      icon: <span>📅</span>,
      label: 'View Schedule',
      tooltip: 'View teaching schedule',
      color: 'secondary',
      onClick: (teacher) => {
        navigate(`/masters/timetable/teacher/${teacher.id}`);
      }
    }
  ];

  const customToolbar = () => (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <Typography variant="h6">Teachers Overview</Typography>
      <Typography variant="body2" color="textSecondary">
        This grid shows all teachers, with filtering capabilities.
      </Typography>
    </Box>
  );

  return (
    <MainCard
      title="Teachers Management"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/teacher/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            data={filteredTeachers}
            loading={loading}
            onFiltersChange={handleFilterChange}
            fetchUrl={null}
            isPostRequest={false}
            columns={columnsConfig}
            editUrl="/masters/teacher/edit"
            deleteUrl="/api/users/delete"
            addActionUrl="/masters/teacher/add"
            viewUrl="/masters/teachers/view"
            entityName="TEACHER"
            searchPlaceholder="Search teachers by name, email, or username..."
            showSearch={true}
            showRefresh={false}
            showFilters={true}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={10}
            height={600}
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={false}
            showDivisionFilter={false}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Teachers;