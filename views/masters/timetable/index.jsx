import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import Box from '@mui/material/Box';
import { IconButton, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIconNew, Visibility as ViewIcon } from '@mui/icons-material';
import api, { userDetails } from '../../../utils/apiService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../utils/permissionUtils';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'schoolName',
    headerName: 'School Name',
    width: 150,
    flex: 0.8
  },
  {
    field: 'className',
    headerName: 'Class Name',
    width: 120,
    flex: 0.6
  },
  {
    field: 'divisionName',
    headerName: 'Division Name',
    width: 120,
    flex: 0.6
  },
  {
    field: 'createdDate',
    headerName: 'Created Date',
    width: 120,
    flex: 0.7,
    renderCell: (params) => {
      return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
    }
  }
];

const Timetables = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const user = useSelector((state) => state.user.user);
  const permissions = user?.role?.permissions;
  
  const handleOnClickDelete = (data) => {
    if (data.id) {
      api.delete(`api/timetable/delete?id=${data?.id}`).then(response => {
        const filterTimetables = timetables.filter(timetable => timetable.id !== data.id);
        setTimetables([...filterTimetables]);
      }).catch(err => console.error(err));
    }
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 180,
    minWidth: 180,
    hideable: false,
    renderCell: (params) => {
      return (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {hasPermission(permissions, 'TIMETABLE', 'view') && (
            <IconButton
              size="small"
              color="info"
              onClick={() => navigate(`/masters/timetable/view/${params.row.id}`)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ViewIcon />
            </IconButton>
          )}
          {hasPermission(permissions, 'TIMETABLE', 'edit') && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/masters/timetable/edit/${params.row.id}`)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          {hasPermission(permissions, 'TIMETABLE', 'delete') && (
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOnClickDelete(params.row)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  transform: 'scale(1.1)'
                }
              }}
            >
              <DeleteIconNew />
            </IconButton>
          )}
        </Box>
      );
    }
  };

//   const customToolbar = () => (
//     <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
//       <Typography variant="h6">Timetables Overview</Typography>
//       <Typography variant="body2" color="textSecondary">
//         This grid shows all timetables with filtering capabilities.
//       </Typography>
//     </Box>
//   );

  return (
    <MainCard
      title="📅 Timetables"
      secondary={
        hasPermission(permissions, 'TIMETABLE', 'add') ? (
          <SecondaryAction icon={<AddIcon onClick={() => navigate(`/masters/timetable/add`)} />} />
        ) : null
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ReusableDataGrid
            fetchUrl={`/api/timetable/getAllBy/${accountId}`}
            columns={columns}
            editUrl="/masters/timetable/edit"
            deleteUrl="/api/timetable/delete"
            filters={{}}
            isPostRequest={true}
            viewUrl="/masters/timetable/view"
            entityName="TIMETABLE"
            enableFilters={true}
            showSchoolFilter={true}
            showClassFilter={true}
            showDivisionFilter={true}
            // customToolbar={customToolbar}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Timetables;