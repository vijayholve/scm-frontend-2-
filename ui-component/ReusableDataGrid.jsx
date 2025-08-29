import React, { useState, useEffect, useCallback, useRef } from 'react';
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
      OutlinedInput,

  ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, MoreVert as MoreVertIcon ,  PersonAdd as PersonAddIcon
 } from '@mui/icons-material';

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

const HeaderSearchWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
  marginLeft: 'auto',
  // Add styling to align items correctly in the header
  '@media (max-width: 600px)': {
    marginLeft: 0,
    marginTop: '16px',
    justifyContent: 'space-between',
  }
});

const ReusableDataGrid = ({
  title,
  fetchUrl,
  columns: propColumns,
  editUrl,
  deleteUrl,
  addActionUrl,
  EnrollActionUrl,
  viewUrl,
  filters = {},
  data: clientSideData = [],
  isPostRequest = true,
  entityName,
  customActionsHeader = [],
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
  showSchoolFilter = false,
  showClassFilter = false,
  showDivisionFilter = false,
  enableFilters = false ,

  
}) => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
    // const [searchText, setSearchText] = useState(''); // Corrected variable name

  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: defaultPageSize });
  const [rowCount, setRowCount] = useState(0);
  const [searchText , setSearchText ] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [gridFilters, setGridFilters] = useState(filters);
  const [gridData, setGridData] = useState([]);

  // Use a ref to store the latest filters without triggering a re-render
  const latestFilters = useRef(gridFilters);
  useEffect(() => {
    latestFilters.current = gridFilters;
  }, [gridFilters]);

  // Memoized function to fetch data, preventing infinite loops
  const fetchData = useCallback(async () => {
    // Return early if no fetch URL is provided
    if (!fetchUrl) {
      // Client-side filtering fallback
      const filteredData = clientSideData.filter((item) => {
        let isMatch = true;
        if (latestFilters.current.schoolId) {
          isMatch = isMatch && item.schoolId == latestFilters.current.schoolId;
        }
        if (latestFilters.current.classId) {
          isMatch = isMatch && item.classId == latestFilters.current.classId;
        }
        if (latestFilters.current.divisionId) {
          isMatch = isMatch && item.divisionId == latestFilters.current.divisionId;
        }
        if (searchText ) {
          isMatch = isMatch && JSON.stringify(item).toLowerCase().includes(searchText .toLowerCase());
        }
        return isMatch;
      });
      const transformedData = transformData ? filteredData.map(transformData) : filteredData;
      setGridData(transformedData);
      setRowCount(transformedData.length);
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isPostRequest) {
        const payload = {
          page: paginationModel.page,
          size: paginationModel.pageSize,
          sortBy: 'id',
          sortDir: 'asc',
          search: searchText ,
          ...latestFilters.current
        };
        response = await api.post(fetchUrl, payload);
      } else {
        const queryParams = new URLSearchParams({
          page: paginationModel.page,
          size: paginationModel.pageSize,
          search: searchText ,
          ...latestFilters.current
        });
        response = await api.get(`${fetchUrl}?${queryParams}`);
      }

      const responseData = response.data.content || response.data || [];
      const transformedData = transformData ? responseData.map(transformData) : responseData;

      setGridData(transformedData);
      setRowCount(response.data.totalElements || response.data.length || 0);
    } catch (err) {
      console.error(`Failed to fetch data from ${fetchUrl}:`, err);
      toast.error('Could not fetch data.');
      setGridData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, isPostRequest, searchText , transformData, clientSideData, paginationModel, JSON.stringify(gridFilters)]);

  // Handle filter changes from ListGridFilters
  const handleFiltersChange = useCallback((newFilters) => {
    setGridFilters(newFilters);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [paginationModel.page, paginationModel.pageSize, searchText , gridFilters]);
const handleSearchChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);
    };

  const handleOnClickDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`${deleteUrl}?id=${id}`);
        toast.success('Item deleted successfully!');
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete item.');
      }
    }
  };

  const handleOnClickView = (id) => {
    navigate(`${viewUrl}/${id}`);
  };
  const handleOnClickEnrollActionUrl = (id) => {
    navigate(`${EnrollActionUrl}/${id}`);
  };
  const handleSearch = (event) => {
    const newSearchText  = event.target.value;
    setSearchText (newSearchText );
  };

  const handleRefresh = () => {
    setSearchText ('');
    setGridFilters(filters);
    setPaginationModel({ page: 0, pageSize: defaultPageSize });
  };

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params);
    }
    setSelectedRow(params.row);
  };

  const hasActions = editUrl || deleteUrl || viewUrl || EnrollActionUrl || customActionsHeader.length > 0;

  const actionsColumn = hasActions
    ? {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const hasCustomActionsHeader = customActionsHeader.length > 0;

          if (hasCustomActionsHeader) {
            return (
              <ActionWrapper>
                {customActionsHeader.map((action, index) => {
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

                {(editUrl || deleteUrl || viewUrl || EnrollActionUrl) && (
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
              {EnrollActionUrl && hasPermission(permissions, entityName, 'view') && (
                <Tooltip title="Enroll">
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => handleOnClickEnrollActionUrl(params.row.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        transform: 'scale(1.1)'
                      }
                    }}

                  >
                    <PersonAddIcon />
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
 const secondaryHeader = (
        <Grid container spacing={2} alignItems="" padding={2} justifyContent="flex-end">

          
          {customActionsHeader && (
              <Grid item>{customActionsHeader}</Grid>
          )}
        </Grid>
    );
  // Header content to be passed to MainCard's secondary prop
  const headerSearchControls = (
    <HeaderSearchWrapper>
      {showSearch && (
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={searchText }
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
      {addActionUrl && (
        <SecondaryAction icon={<AddIcon />} link={addActionUrl} />
      )}
    </HeaderSearchWrapper>
  );

  return (
    <MainCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography variant="h3" sx={{ flexGrow: 1 }}>{title}</Typography>
              {headerSearchControls}
          </Box>
        }
        secondary={secondaryHeader}
        contentSX={{ p: 1 }} // Small padding to make space for filters
      >
      {customToolbar && customToolbar()}

      {enableFilters && (showSchoolFilter || showClassFilter || showDivisionFilter) && (
        <ListGridFilters
          filters={gridFilters}
          onFiltersChange={handleFiltersChange}
          showSchool={showSchoolFilter}
          showClass={showClassFilter}
          showDivision={showDivisionFilter}
        />
      )}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ height, width: '100%' }}>
            <DataGrid
              rows={gridData}
              columns={columns}
              loading={loading}
              rowCount={rowCount}
              pageSizeOptions={pageSizeOptions}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode={fetchUrl ? 'server' : 'client'}
              getRowId={(row) => row.id}
              onRowClick={onRowClick || handleRowClick}
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
    </MainCard>
  );
};

export default ReusableDataGrid;