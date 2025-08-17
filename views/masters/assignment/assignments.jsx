import React, { useState, useEffect } from 'react';
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
  
  // State for filter dropdowns and date picker
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [deadlineDate, setDeadlineDate] = useState(null);
  // const [selectedUserId, setSelectedUserId] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Fetch all dropdown data for filters
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch schools
        const schoolsResponse = await api.get(`api/schoolBranches/getAllBy/${accountId}`);
        setSchools(schoolsResponse.data || []);

        // Fetch classes
        const classesResponse = await api.get(`api/schoolClasses/getAllBy/${accountId}`);
        setClasses(classesResponse.data || []);

        // Fetch divisions
        const divisionsResponse = await api.get(`api/divisions/getAllBy/${accountId}`);
        setDivisions(divisionsResponse.data || []);

        // Fetch subjects
        const subjectsResponse = await api.get(`api/subjects/getAllBy/${accountId}`);
        setSubjects(subjectsResponse.data || []);
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      }
    };
    fetchDropdownData();
  }, [accountId]);

  // Create the filters object to pass to ReusableDataGrid
  const filters = {
    schoolId: selectedSchoolId || null,
    classId: selectedClassId || null,
    divisionId: selectedDivisionId || null,
    subjectId: selectedSubjectId || null,
    deadLine: deadlineDate ? dayjs(deadlineDate).format('YYYY-MM-DD') : null,
    userId: selectedUserId || null,
    fromDate: fromDate ? dayjs(fromDate).toISOString() : null,
    toDate: toDate ? dayjs(toDate).toISOString() : null,
  };

  return (
    <MainCard
      title="Assignments"
      secondary={hasPermission(permissions, 'ASSIGNMENT', 'add') ? <SecondaryAction icon={<AddIcon onClick={() => navigate(`/masters/assignment/add`)} />} /> : null}
    >
      <Grid container spacing={gridSpacing}>
        {/* Filter Section Wrapper */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {/* School Filter Dropdown */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth>
                <InputLabel id="school-select-label">School</InputLabel>
                <Select
                  labelId="school-select-label"
                  id="school-select"
                  value={selectedSchoolId}
                  label="School"
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Class Filter Dropdown */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth>
                <InputLabel id="class-select-label">Class</InputLabel>
                <Select
                  labelId="class-select-label"
                  id="class-select"
                  value={selectedClassId}
                  label="Class"
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Division Filter Dropdown */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth>
                <InputLabel id="division-select-label">Division</InputLabel>
                <Select
                  labelId="division-select-label"
                  id="division-select"
                  value={selectedDivisionId}
                  label="Division"
                  onChange={(e) => setSelectedDivisionId(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {divisions.map((division) => (
                    <MenuItem key={division.id} value={division.id}>{division.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subject Filter Dropdown */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth>
                <InputLabel id="subject-select-label">Subject</InputLabel>
                <Select
                  labelId="subject-select-label"
                  id="subject-select"
                  value={selectedSubjectId}
                  label="Subject"
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>{subject.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Deadline Date Picker */}
            <Grid item xs={12} sm={6} md={2.4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Deadline"
                  value={deadlineDate}
                  onChange={(newValue) => setDeadlineDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>

        {/* New filters added for user request */}
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                label="User ID"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        

        {/* DataGrid Section */}
        <Grid item xs={12}>
          <ReusableDataGrid
          
            fetchUrl={`/api/assignments/getAll/${accountId}`}
            columns={columns}
            editUrl="/masters/assignment/edit"
            deleteUrl="/api/assignments/delete"
            filters={filters}
            isPostRequest={true}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Assignments;