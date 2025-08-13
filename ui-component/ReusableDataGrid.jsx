import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Grid,
  Button,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import api from 'utils/apiService';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import ListGridFilters from './ListGridFilters';

const ActionWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  padding: '4px'
});

const SearchWrapper = styled(Box)({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  marginBottom: '16px',
  flexWrap: 'wrap'
});

const ReusableDataGrid = ({
  title,
  fetchUrl,
  columns: propColumns,
  editUrl,
  deleteUrl,
  addActionUrl,
  viewUrl,
  filters = {},
  isPostRequest = true,
  entityName,
  customActions = [],
  searchPlaceholder = 'Search...',
  showSearch = true,
  showRefresh = true,
  showFilters = true,
  pageSizeOptions = [5, 10, 25, 50],
  defaultPageSize = 10,
  height = 600,
  transformData = null,
  onRowClick = null,
  selectionModel = null,
  onSelectionModelChange = null,
  checkboxSelection = false,
  disableSelectionOnClick = false,
  getRowClassName = null,
  customToolbar = null,
  loadingOverlay = null,
  errorOverlay = null,
  // New filter props
  showSchoolFilter = false,
  showClassFilter = false,
  showDivisionFilter = false,
  enableFilters = false
}) => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);

  // State for data, pagination, and loading
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: defaultPageSize });
  const [rowCount, setRowCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [gridFilters, setGridFilters] = useState({
    schoolId: '',
    classId: '',
    divisionId: '',
    ...filters
  });

  // Memoized function to fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (isPostRequest) {
        const payload = {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sortBy: 'id',
          sortDir: 'asc',
          search: searchTerm,
          ...gridFilters
        };
        response = await api.post(fetchUrl, payload);
      } else {
        const queryParams = new URLSearchParams({
          page: paginationModel.page,
          size: paginationModel.pageSize,
          search: searchTerm,
          ...gridFilters
        });
        response = await api.get(`${fetchUrl}?${queryParams}`);
      }
      console.log(fetchUrl, 'fetchUrl', response);

      let responseData = response.data.content || response.data || [];

      // Apply custom data transformation if provided
      if (transformData && typeof transformData === 'function') {
        responseData = responseData.map(transformData);
      }

      setData(responseData);
      setRowCount(response.data.totalElements || response.data.length || 0);

      if (!response) {
        console.error('No response from API');
        console.log('URL: ' + fetchUrl);
      }
    } catch (err) {
      console.error(`Failed to fetch data from ${fetchUrl}:`, err);
      toast.error('Could not fetch data.');
      setData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, paginationModel, JSON.stringify(gridFilters), isPostRequest, searchTerm, transformData]);

  // Trigger fetch when pagination, filters, or search changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOnClickDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`${deleteUrl}?id=${id}`);
        toast.success('Item deleted successfully!');
        fetchData(); // Refetch data after deletion
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete item.');
      }
    }
  };

  const handleOnClickView = async (id) => {
    navigate(`${viewUrl}/${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params);
    }
    setSelectedRow(params.row);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setGridFilters(newFilters);
    setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page
  };

  // Create actions column only if there are actions available
  const hasActions = editUrl || deleteUrl || viewUrl || customActions.length > 0;

  const actionsColumn = hasActions
    ? {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const hasCustomActions = customActions.length > 0;

          if (hasCustomActions) {
            return (
              <ActionWrapper>
                {customActions.map((action, index) => {
                  if (action.permission && !hasPermission(permissions, entityName, action.permission)) {
                    return null;
                  }

                  return (
                    <Tooltip key={index} title={action.tooltip || action.label}>
                      <IconButton
                        size="small"
                        color={action.color || 'primary'}
                        onClick={() => action.onClick(params.row)}
                        sx={{
                          '&:hover': {
                            backgroundColor: `rgba(${
                              action.color === 'error' ? '244, 67, 54' : action.color === 'info' ? '33, 150, 243' : '25, 118, 210'
                            }, 0.1)`,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    </Tooltip>
                  );
                })}

                {/* More actions menu for standard actions */}
                {(editUrl || deleteUrl || viewUrl) && (
                  <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                )}
              </ActionWrapper>
            );
          }

          return (
            <ActionWrapper>
              {viewUrl && hasPermission(permissions, entityName, 'view') && (
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => handleOnClickView(params.row.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
              )}
              {editUrl && hasPermission(permissions, entityName, 'edit') && (
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`${editUrl}/${params.row.id}`)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {deleteUrl && hasPermission(permissions, entityName, 'delete') && (
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleOnClickDelete(params.row.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </ActionWrapper>
          );
        }
      }
    : null;

  const columns = hasActions ? [...propColumns, actionsColumn] : propColumns;

  return (
    <MainCard title={title} secondary={<SecondaryAction icon={<AddIcon />} link={addActionUrl} />}>
      {/* Custom Toolbar */}
      {customToolbar && customToolbar()}

      {/* Filters Section */}
      {enableFilters && (showSchoolFilter || showClassFilter || showDivisionFilter) && (
        <ListGridFilters
          filters={gridFilters}
          onFiltersChange={handleFiltersChange}
          showSchool={showSchoolFilter}
          showClass={showClassFilter}
          showDivision={showDivisionFilter}
        />
      )}

      {/* Search and Actions Bar */}
      {(showSearch || showRefresh || showFilters) && (
        <SearchWrapper>
          {showSearch && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 250 }}
            />
          )}

          {showRefresh && (
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
              Refresh
            </Button>
          )}

          {showFilters && Object.keys(gridFilters).length > 0 && (
            <Chip
              icon={<FilterListIcon />}
              label={`${Object.keys(gridFilters).length} filters active`}
              variant="outlined"
              color="primary"
            />
          )}
        </SearchWrapper>
      )}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ height, width: '100%' }}>
            <DataGrid
              rows={data}
              columns={columns}
              loading={loading}
              rowCount={rowCount}
              pageSizeOptions={pageSizeOptions}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode="server"
              getRowId={(row) => row.id}
              onRowClick={handleRowClick}
              selectionModel={selectionModel}
              onSelectionModelChange={onSelectionModelChange}
              checkboxSelection={checkboxSelection}
              disableSelectionOnClick={disableSelectionOnClick}
              getRowClassName={getRowClassName}
              loadingOverlay={loadingOverlay}
              errorOverlay={errorOverlay}
              sx={{
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  cursor: onRowClick ? 'pointer' : 'default'
                },
                '& .MuiDataGrid-row.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                },
                '& .MuiDataGrid-row.Mui-selected:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)'
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* More Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {viewUrl && hasPermission(permissions, entityName, 'view') && (
          <MenuItem
            onClick={() => {
              handleOnClickView(selectedRow?.id);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
        )}
        {editUrl && hasPermission(permissions, entityName, 'edit') && (
          <MenuItem
            onClick={() => {
              navigate(`${editUrl}/${selectedRow?.id}`);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {deleteUrl && hasPermission(permissions, entityName, 'delete') && (
          <MenuItem
            onClick={() => {
              handleOnClickDelete(selectedRow?.id);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </MainCard>
  );
};

export default ReusableDataGrid;
