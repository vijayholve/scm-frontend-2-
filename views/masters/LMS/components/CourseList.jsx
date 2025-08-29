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
  { field: 'status', headerName: 'Status', width: 100 },
];

const CourseList = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const user = useSelector(state => state.user.user);
  const permissions = useSelector(state => state.user.permissions);

  // Function to handle the enrollment process for students
  const handleEnroll = (course) => {
    // This is a placeholder for the actual API call
    console.log(`Enrolling student ${user?.id} in course ${course.id}`);
    toast.success(`You have successfully enrolled in the course: ${course.title}!`);
    // In a real application, you would make an API call here:
    // api.post(`/api/lms/course/enroll/${course.id}`, { studentId: user?.id })
    //   .then(() => {
    //     toast.success(`You have successfully enrolled in the course: ${course.title}!`);
    //     // Optionally refresh the list to show the new enrollment status
    //   })
    //   .catch(() => {
    //     toast.error('Failed to enroll in the course. Please try again.');
    //   });
  };

  const customActions = [];

  // Add the "Enroll" button only if the user is a student
  if (user?.type === 'STUDENT') {
    customActions.push({
      icon: <CheckCircleIcon />,
      label: 'Enroll',
      tooltip: 'Enroll in this course',
      color: 'success',
      onClick: (row) => handleEnroll(row),
      permission: 'enroll' // Dummy permission for illustration
    });
  }

  // Add the "View" button for all users
  customActions.push({
    icon: <PlayArrowIcon />,
    label: 'View Course',
    tooltip: 'View course details',
    color: 'info',
    onClick: (row) => {
      navigate(`/masters/lms/course/view/${row.id}`);
    },
    permission: 'view'
  });

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <ReusableDataGrid
          title="COURSES"
          fetchUrl={`/api/lms/course/getAll/${accountId}`}
          isPostRequest={true}
          columns={columns}
          addActionUrl={hasPermission(permissions, 'LMS', 'add') ? "/masters/lms/course/add" : null}
          editUrl={hasPermission(permissions, 'LMS', 'edit') ? "/masters/lms/course/edit" : null}
          deleteUrl={hasPermission(permissions, 'LMS', 'delete') ? "/api/lms/course/delete" : null}
          entityName="LMS"
          EnrollActionUrl={user?.type === 'STUDENT' ? "/masters/lms/course/view" : null}
          viewUrl="/masters/lms/course/view"
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