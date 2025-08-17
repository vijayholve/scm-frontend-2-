import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../../utils/apiService';

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

  return (
    <MainCard
      title="Courses Management"
      secondary={<SecondaryAction icon={<AddIcon />} link="/masters/lms/course/add" />}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            entityName="LMS"
            fetchUrl={`/api/lms/course/getAll/${accountId}`}
            columns={columns}
            editUrl="/masters/lms/course/edit"
            deleteUrl="/api/lms/course/delete"
            addActionUrl="/masters/lms/course/add"
            viewUrl="/masters/lms/course/view"
            isPostRequest={true}
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