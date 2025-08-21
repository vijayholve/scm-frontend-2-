import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import api, { userDetails } from '../../../utils/apiService';
import { hasPermission } from 'utils/permissionUtils.js';
import { useSelector } from 'react-redux';

// Define the columns for the assignments data grid.
const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150, flex: 1 },
  { field: 'schoolName', headerName: 'School', width: 120, editable: true },
  { field: 'className', headerName: 'Class', width: 100, editable: true },
  { field: 'divisionName', headerName: 'Division', width: 100, editable: true },
  { field: 'subjectName', headerName: 'Subject', width: 120, editable: true },
  { field: 'createdBy', headerName: 'Created By', width: 120, editable: true },
  { field: 'deadLine', headerName: 'Deadline', width: 120, editable: true }
];

const Assignments = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const user = useSelector((state) => state.user);
  const permissions = user?.permissions || [];
  
  const [allAssignments, setAllAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchAllAssignments = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/api/assignments/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
        setAllAssignments(response.data.content || []);
        console.log("assignment")
        console.log(allAssignments)
        setFilteredAssignments(response.data.content || []);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
        setAllAssignments([]);
        setFilteredAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAssignments();
  }, [accountId]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    let tempFiltered = allAssignments;
    if (newFilters.schoolId) {
      tempFiltered = tempFiltered.filter(assignment => assignment.schoolId == newFilters.schoolId);
    }
    if (newFilters.classId) {
      tempFiltered = tempFiltered.filter(assignment => assignment.classId == newFilters.classId);
    }
    if (newFilters.divisionId) {
      tempFiltered = tempFiltered.filter(assignment => assignment.divisionId == newFilters.divisionId);
    }
    if (newFilters.subjectId) {
      tempFiltered = tempFiltered.filter(assignment => assignment.subjectId == newFilters.subjectId);
    }
    setFilteredAssignments(tempFiltered);
  }, [allAssignments]);

  return (
    <MainCard
      title="Assignments"
      secondary={hasPermission(permissions, 'ASSIGNMENT', 'add') ? <SecondaryAction icon={<AddIcon onClick={() => navigate(`/masters/assignment/add`)} />} /> : null}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            data={filteredAssignments}
            loading={loading}
            onFiltersChange={handleFilterChange}
            fetchUrl={null}
            isPostRequest={false}
            columns={columns}
            editUrl="/masters/assignment/edit"
            deleteUrl="/api/assignments/delete"
            entityName="ASSIGNMENT"
            searchPlaceholder="Search assignments by name, type, or year..."
            showSearch={true}
            showRefresh={false}
            showFilters={true}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={10}
            height={600}
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={true}
            showDivisionFilter={true}
            showSubjectFilter={true}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Assignments;