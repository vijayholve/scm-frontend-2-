import React, { useState, useEffect, useCallback } from 'react';
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
  
  const [allTimetables, setAllTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      const fetchAllTimetables = async () => {
          setLoading(true);
          try {
              const response = await api.post(`/api/timetable/getAllBy/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
              setAllTimetables(response.data.content || []);
              setFilteredTimetables(response.data.content || []);
          } catch (error) {
              console.error('Failed to fetch timetables:', error);
              setAllTimetables([]);
              setFilteredTimetables([]);
          } finally {
              setLoading(false);
          }
      };
      fetchAllTimetables();
  }, [accountId]);

  const handleFilterChange = useCallback((newFilters) => {
      let tempFiltered = allTimetables;
      if (newFilters.schoolId) {
          tempFiltered = tempFiltered.filter(timetable => timetable.schoolId == newFilters.schoolId);
      }
      if (newFilters.classId) {
          tempFiltered = tempFiltered.filter(timetable => timetable.classId == newFilters.classId);
      }
      if (newFilters.divisionId) {
          tempFiltered = tempFiltered.filter(timetable => timetable.divisionId == newFilters.divisionId);
      }
      setFilteredTimetables(tempFiltered);
  }, [allTimetables]);
  
  const handleOnClickDelete = (data) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        if (data.id) {
          api.delete(`api/timetable/delete?id=${data?.id}`).then(response => {
            const filterTimetables = allTimetables.filter(timetable => timetable.id !== data.id);
            setAllTimetables(filterTimetables);
            setFilteredTimetables(filterTimetables);
          }).catch(err => console.error(err));
        }
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
            data={filteredTimetables}
            loading={loading}
            onFiltersChange={handleFilterChange}
            fetchUrl={null}
            isPostRequest={false}
            columns={columns}
            editUrl="/masters/timetable/edit"
            deleteUrl="/api/timetable/delete"
            viewUrl="/masters/timetable/view"
            entityName="TIMETABLE"
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

export default Timetables;