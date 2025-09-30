import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';

// Define the columns for the attendance data grid.
const columns = [
  { field: 'className', headerName: 'Class', width: 150 },
  { field: 'divisionName', headerName: 'Division', width: 150 },
  { field: 'subjectName', headerName: 'Subject', width: 150 },
  {
    field: 'attendanceDate',
    headerName: 'Attendance Date',
    width: 160,
    // valueFormatter: (params) => (params.value ? dayjs(params.value).format('YYYY-MM-DD') : '')
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
  
  return (
   
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
                      title="ATTENDANCE"
          viewScreenIs={true}

            entityName="ATTENDANCE"
            fetchUrl={`/api/attendance/getAllBy/${accountId}`}
            isPostRequest={true}
            columns={columns}
            editUrl="/masters/attendance/edit"
            sortDir ="desc"
                        addActionUrl="/masters/attendance/add"

            deleteUrl="/api/attendance/delete"
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={true}
            showDivisionFilter={true}
            sortBy='desc'

          />
        </Grid>
      </Grid>
    // </MainCard>
  );
};

export default AttendanceList;