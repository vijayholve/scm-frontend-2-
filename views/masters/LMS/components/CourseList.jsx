import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { toast } from 'react-hot-toast';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../../utils/apiService';
import { useSelector } from 'react-redux';
import { hasPermission } from 'utils/permissionUtils.js';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'schoolName', headerName: 'School', width: 150 },
  { field: 'className', headerName: 'Class', width: 120 },
  { field: 'divisionName', headerName: 'Division', width: 120 },
  { field: 'status', headerName: 'Status', width: 100 }
];

const CourseList = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const user = useSelector((state) => state.user.user);
  const permissions = useSelector((state) => state.user.permissions);

  const handleEnroll = (course) => {
    console.log(`Enrolling student ${user?.id} in course ${course.id}`);
    navigate(`/masters/lms/course/view/${course.id}`);
    toast.success(`You have successfully enrolled in the course: ${course.title}!`);
  };
  const customActions = [];
  if (user?.type === 'STUDENT') {
    customActions.push({
      icon: <CheckCircleIcon />,
      label: 'Enroll',
      tooltip: 'Enroll in this course',
      color: 'success',
      onClick: (row) => handleEnroll(row),
      permission: 'enroll'
    });
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <ReusableDataGrid
          title="COURSES"
          fetchUrl={`/api/lms/course/getAllBy/${accountId}`}
          isPostRequest={true}
          columns={columns}
          addActionUrl={'/masters/lms/course/add'}
          editUrl={'/masters/lms/course/edit'}
          deleteUrl={'/api/lms/course/delete'}
          viewUrl={'/masters/lms/course/view'} // Use the dedicated prop for the view button
          entityName="LMS"
          // EnrollActionUrl={user?.type === 'STUDENT' ? "/masters/lms/course/view" : null}
          customActions={customActions}
          enableFilters={true}
          showSchoolFilter={true}
          showClassFilter={true}
          showDivisionFilter={true}
        />
      </Grid>
    </Grid>
  );
};

export default CourseList;
