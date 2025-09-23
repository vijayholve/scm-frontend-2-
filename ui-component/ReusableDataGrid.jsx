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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  // i want same icon as Visibility but with different style and color
  VisibilityOutlined as OutlinedViewIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ViewDetailsModal from './ViewDetailsModal';
import api, { userDetails, getUserSchoolClassDivision } from 'utils/apiService';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import ListGridFilters from './ListGridFilters';
import { useDataCache } from 'contexts/DataCacheContext';

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
    justifyContent: 'space-between'
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
  requestMethod = 'POST',
  sendBodyOnGet = false,
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
  enableFilters = false,
  customActions = [],
  getRowId: getRowIdProp = (row) => row.id,
  schoolNameMap = {},
  classNameMap = {},
  divisionNameMap = {},
  viewScreenIs = false
}) => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
  // const [searchText, setSearchText] = useState(''); // Corrected variable name

  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: defaultPageSize });
  const [rowCount, setRowCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  // If logged in user is a STUDENT, apply their school/class/division as default filters
  const [gridFilters, setGridFilters] = useState(() => {
    try {
      const studentFilter = getUserSchoolClassDivision();
      // If studentFilter has any value, merge it into initial filters
      if (studentFilter && (studentFilter.schoolId || studentFilter.classId || studentFilter.divisionId)) {
        return { ...filters, ...studentFilter };
      }
    } catch (e) {
      console.error('Error reading student filter:', e);
    }
    return filters;
  });
  const [gridData, setGridData] = useState([]);
  // For view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRowData, setViewRowData] = useState(null);
  const accountId = userDetails.getAccountId();
const studentScope = getUserSchoolClassDivision();
  const isStudent = Boolean(
    studentScope && (studentScope.schoolId || studentScope.classId || studentScope.divisionId)
  );
  // Use a ref to store the latest filters without triggering a re-render
  const latestFilters = useRef(gridFilters);
  useEffect(() => {
    latestFilters.current = gridFilters;
  }, [gridFilters]);

  // Memoized function to fetch data, preventing infinite loops
  const { fetchData: fetchFromCache, clearCache, isLoading: isCacheLoading } = useDataCache();
  const fetchData = useCallback(
    async (forceRefresh = false) => {
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
          if (searchText) {
            isMatch = isMatch && JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase());
          }
          return isMatch;
        });
        const transformedData = transformData ? filteredData.map(transformData) : filteredData;
        setGridData(transformedData);
        setRowCount(transformedData.length);
        return;
      }

      const isCurrentlyLoading = isCacheLoading(
        fetchUrl,
        latestFilters.current,
        searchText,
        paginationModel.page,
        paginationModel.pageSize
      );

      if (isCurrentlyLoading) {
        setLoading(true);
        return;
      }

      setLoading(true);

      try {
        const result = await fetchFromCache(fetchUrl, {
          filters: latestFilters.current,
          searchText,
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          isPostRequest,
          requestMethod,
          sendBodyOnGet,
          transformData,
          forceRefresh
        });

        setGridData(result.data);
        setRowCount(result.totalElements);
      } catch (err) {
        console.error('Error fetching data:', err);
        setGridData([]);
        setRowCount(0);
      } finally {
        setLoading(false);
      }
    },
    [
      fetchUrl,
      fetchFromCache,
      isCacheLoading,
      transformData,
      clientSideData,
      paginationModel,
      searchText,
      isPostRequest,
      requestMethod,
      sendBodyOnGet
    ]
  );

  // Handle filter changes from ListGridFilters
  const handleFiltersChange = useCallback((newFilters) => {
    try {
      const studentFilter = getUserSchoolClassDivision();
      if (studentFilter && (studentFilter.schoolId || studentFilter.classId || studentFilter.divisionId)) {
        // Preserve student scope — don't allow removing student's school/class/division
        setGridFilters({ ...newFilters, ...studentFilter });
      } else {
        setGridFilters(newFilters);
      }
    } catch (e) {
      console.error('Error applying student filter on change:', e);
      setGridFilters(newFilters);
    }
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [paginationModel.page, paginationModel.pageSize, searchText, gridFilters]);
  const handleSearchChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
  };

  const handleOnClickDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`${deleteUrl}/${accountId}/${id}`);
        toast.success('Item deleted successfully!');
        // Clear cache for this URL and refresh
        clearCache(fetchUrl);
        fetchData(true);
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
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
  };

  const handleRefresh = () => {
    setSearchText('');
    setGridFilters(filters);
    setPaginationModel({ page: 0, pageSize: defaultPageSize });
    // Force refresh from API
    setTimeout(() => fetchData(true), 100);
  };

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params);
    }
    setSelectedRow(params.row);
  };

  const hasActions = editUrl || deleteUrl || viewUrl || EnrollActionUrl || customActions.length > 0;

  const actionsColumn = hasActions
    ? {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          // Compose actions: view (if enabled), then custom, then built-in
          const actions = [];
          if (viewScreenIs) {
            actions.push({
              icon: <OutlinedViewIcon />,
              label: 'View',
              tooltip: 'View in Details',
              color: 'info',
              onClick: () => {
                setViewRowData(params.row);
                setViewModalOpen(true);
              },
              permission: 'view'
            });
          }
          if (customActions.length > 0) {
            customActions.forEach((action) => {
              actions.push({ ...action, onClick: () => action.onClick(params.row) });
            });
          }
          // Built-in actions (edit, delete, viewUrl, enroll)
          if (viewUrl && hasPermission(permissions, entityName, 'view')) {
            actions.push({
              icon: <ViewIcon />,
              label: 'View',
              tooltip: 'View Details',
              color: 'info',
              onClick: () => handleOnClickView(params.row.id)
            });
          }
          if (EnrollActionUrl && hasPermission(permissions, entityName, 'view')) {
            actions.push({
              icon: <PersonAddIcon />,
              label: 'Enroll',
              tooltip: 'Enroll',
              color: 'secondary',
              onClick: () => handleOnClickEnrollActionUrl(params.row.id)
            });
          }
          if (editUrl && hasPermission(permissions, entityName, 'edit')) {
            actions.push({
              icon: <EditIcon />,
              label: 'Edit',
              tooltip: 'Edit',
              color: 'primary',
              onClick: () => navigate(`${editUrl}/${params.row.id}`)
            });
          }
          if (deleteUrl && hasPermission(permissions, entityName, 'delete')) {
            actions.push({
              icon: <DeleteIcon />,
              label: 'Delete',
              tooltip: 'Delete',
              color: 'error',
              onClick: () => handleOnClickDelete(params.row.id)
            });
          }
          return (
            <ActionWrapper>
              {actions.map((action, idx) => (
                <Tooltip key={idx} title={action.tooltip || action.label}>
                  <IconButton
                    size="small"
                    color={action.color || 'primary'}
                    onClick={action.onClick}
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
              ))}
            </ActionWrapper>
          );
        }
      }
    : null;
  // Function to get the correct name for a given ID
  const getNameForId = (id, map) => map[id] || 'N/A';

  const processedColumns = propColumns.map((col) => {
    // If a custom valueFormatter is already defined, don't override it
    if (col.valueFormatter || col.renderCell) {
      return col;
    }

    if (col.field === 'schoolId') {
      return {
        ...col,
        valueFormatter: (params) => getNameForId(params.value, schoolNameMap),
        headerName: col.headerName || 'School'
      };
    }
    if (col.field === 'classId') {
      return {
        ...col,
        valueFormatter: (params) => getNameForId(params.value, classNameMap),
        headerName: col.headerName || 'Class'
      };
    }
    if (col.field === 'divisionId') {
      return {
        ...col,
        valueFormatter: (params) => getNameForId(params.value, divisionNameMap),
        headerName: col.headerName || 'Division'
      };
    }

    return col;
  });

  const columns = hasActions ? [...processedColumns, actionsColumn] : processedColumns;
  const secondaryHeader = (
    <Grid container spacing={2} alignItems="" padding={2} justifyContent="flex-end">
      {customActionsHeader && <Grid item>{customActionsHeader}</Grid>}
    </Grid>
  );
  // Header content to be passed to MainCard's secondary prop
  const headerSearchControls = (
    <HeaderSearchWrapper>
      {showSearch && (
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={searchText}
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
      {/* hide filter chip for STUDENT users */}
      {!isStudent && showFilters && Object.keys(gridFilters).length > 0 && (
        <Chip icon={<FilterListIcon />} label={`${Object.keys(gridFilters).length} filters active`} variant="outlined" color="primary" />
      )}
      {addActionUrl && hasPermission(permissions, entityName, 'add') && <SecondaryAction icon={<AddIcon />} link={addActionUrl} />}
    </HeaderSearchWrapper>
  );

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
          <Typography variant="h3" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {headerSearchControls}
        </Box>
      }
      secondary={secondaryHeader}
      contentSX={{ p: 1 }} // Small padding to make space for filters
    >
      {customToolbar && customToolbar()}

      {/* Do not render school/class/division filter UI for STUDENT users */}
      {enableFilters && !isStudent && (showSchoolFilter || showClassFilter || showDivisionFilter) && (
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
              getRowId={getRowIdProp}
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
      {viewScreenIs && <ViewDetailsModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} data={viewRowData} title="Details" />}
    </MainCard>
  );
};

export default ReusableDataGrid;
