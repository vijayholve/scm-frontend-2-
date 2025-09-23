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
  { field: 'deadLine', headerName: 'Deadline', width: 120, editable: true },
  { field: 'status', headerName: 'status', width: 100, editable: true }
];

const Assignments = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const user = useSelector((state) => state.user);
  const permissions = user?.permissions || [];

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <ReusableDataGrid
          viewScreenIs={true}
          title={'ASSIGNMENTS'}
          fetchUrl={`/api/assignments/getAllBy/${accountId}`}
          isPostRequest={true}
          columns={columns}
          addActionUrl="/masters/assignment/add"
          editUrl="/masters/assignment/edit"
          deleteUrl="/api/assignments/delete"
          entityName="ASSIGNMENT"
          searchPlaceholder="Search assignments by name, type, or year..."
          showSearch={true}
          showRefresh={true}
          showFilters={true}
          pageSizeOptions={[5, 10, 25, 50]}
          defaultPageSize={10}
          height={600}
          enableFilters={true}
          showSchoolFilter={true}
          showClassFilter={true}
          showDivisionFilter={true}
        />
      </Grid>
    </Grid>
    // </MainCard>
  );
};

export default Assignments;
