import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import dayjs from 'dayjs';
import { Box, Grid } from '@mui/material';
import api from '../../../utils/apiService';

// Define the columns for the attendance data grid.
const columns = [
  { field: 'className', headerName: 'Class', width: 150 },
  { field: 'divisionName', headerName: 'Division', width: 150 },
  { field: 'subjectName', headerName: 'Subject', width: 150 },
  {
    field: 'attendanceDate',
    headerName: 'Attendance Date',
    width: 160,
    valueFormatter: (params) => (params ? dayjs(params.value).format('YYYY-MM-DD') : '')
  },
  {
    field: 'schoolName',
    headerName: 'School Name',
    width: 150
  }
];

const AttendanceList = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const [allAttendance, setAllAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchAllAttendance = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/api/attendance/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
        setAllAttendance(response.data.content || []);
        setFilteredAttendance(response.data.content || []);
        console.log("allAttendance")
        console.log(allAttendance)
        console.log("attendance data ",allAttendance)
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
        setAllAttendance([]);
        setFilteredAttendance([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAttendance();
  }, [accountId]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    let tempFiltered = allAttendance;
    if (newFilters.schoolId) {
      tempFiltered = tempFiltered.filter(attendance => attendance.schoolId == newFilters.schoolId);
    }
    if (newFilters.classId) {
      tempFiltered = tempFiltered.filter(attendance => attendance.schooldClassId == newFilters.classId);
    }
    if (newFilters.divisionId) {
      tempFiltered = tempFiltered.filter(attendance => attendance.divisionId == newFilters.divisionId);
    }
    setFilteredAttendance(tempFiltered);
  }, [allAttendance]);

  return (
    <MainCard
      title="Attendance List"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/attendance/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            entityName="ATTENDANCE List"
            data={filteredAttendance}
            loading={loading}
            onFiltersChange={handleFilterChange}
            fetchUrl={null}
            isPostRequest={false}
            columns={columns}
            editUrl="/masters/attendance/edit"
            deleteUrl="/api/attendance/delete"
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

export default AttendanceList;