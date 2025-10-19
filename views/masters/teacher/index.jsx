import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';

const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
  // { field: 'address', headerName: 'Address', width: 110, flex: 1 }
];

const Teachers = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  
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
    const user = useSelector((state) => state.user.user);
    const userTypeForApi = 'TEACHER'; // Default to ADMIN


  return (
   
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
          title={"Teachers"}
          // viewScreenIs={true}
            fetchUrl={`/api/users/getAllBy/${accountId}?type=${userTypeForApi}`}
            isPostRequest={true}
            columns={columnsConfig}
            editUrl="/masters/teacher/edit"
            deleteUrl="/api/users/delete"
            addActionUrl="/masters/teacher/add"
            viewUrl="/masters/teachers/view"
            entityName="TEACHER"
            searchPlaceholder="Search teachers by name, email, or username..."
            showSearch={true}
            showRefresh={true}
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
    // </MainCard>
  );
};

export default Teachers;