import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../../utils/apiService';
import api from '../../../../utils/apiService';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'schoolName', headerName: 'School', width: 150 },
  { field: 'className', headerName: 'Class', width: 120 },
  { field: 'divisionName', headerName: 'Division', width: 120 },
  { field: 'status', headerName: 'Status', width: 100 },
];

const CourseList = () => {
  const accountId = userDetails.getAccountId();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/api/lms/course/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
        setAllCourses(response.data.content || []);
        setFilteredCourses(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setAllCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, [accountId]);

  const handleFilterChange = useCallback((newFilters) => {
    let tempFiltered = allCourses;
    if (newFilters.schoolId) {
      tempFiltered = tempFiltered.filter(course => course.schoolId == newFilters.schoolId);
    }
    if (newFilters.classId) {
      tempFiltered = tempFiltered.filter(course => course.classId == newFilters.classId);
    }
    if (newFilters.divisionId) {
      tempFiltered = tempFiltered.filter(course => course.divisionId == newFilters.divisionId);
    }
    setFilteredCourses(tempFiltered);
  }, [allCourses]);

  return (
    <MainCard
      title="Courses Management"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/lms/course/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            data={filteredCourses}
            loading={loading}
            onFiltersChange={handleFilterChange}
            fetchUrl={null}
            isPostRequest={false}
            columns={columns}
            editUrl="/masters/lms/course/edit"
            deleteUrl="/api/lms/course/delete"
            addActionUrl="/masters/lms/course/add"
            viewUrl="/masters/lms/course/view"
            entityName="LMS"
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

export default CourseList;