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
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import api, { userDetails, getUserSchoolClassDivision } from 'utils/apiService';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import ListGridFiltersContainer from './ListGridFiltersContainer';
import { useSCDData } from 'contexts/SCDProvider'; // add SCD hook
import { useTranslation } from 'react-i18next'; // <-- add

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

// Replace old DataGridMobileCard with a column/field-aware version
const DataGridMobileCard = ({ row, columns, onView, onEdit, onDelete, onEnroll, hasActions, t }) => {
  const getCellValue = (col) => {
    // mimic DataGrid valueGetter
    try {
      if (typeof col.valueGetter === 'function') {
        return col.valueGetter({ row, value: row?.[col.field] });
      }
    } catch (e) {}
    return row?.[col.field] ?? '';
  };

  const displayColumns = columns.filter((c) => c.field !== 'actions');

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 1.5,
        mb: 1.5,
        bgcolor: 'background.paper'
      }}
    >
      {displayColumns.map((col) => (
        <Box
          key={col.field}
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1,
            py: 0.5
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
            {col.headerName || col.field}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'right', flex: 1 }}>
            {String(getCellValue(col) ?? '')}
          </Typography>
        </Box>
      ))}

      {hasActions && (
        <ActionWrapper sx={{ justifyContent: 'flex-end', pt: 0.5 }}>
          {onView && (
            <Tooltip title={t ? t('tooltip.viewDetails') : 'View'}>
              <IconButton size="small" color="info" onClick={onView}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEnroll && (
            <Tooltip title={t ? t('tooltip.enroll') : 'Enroll'}>
              <IconButton size="small" color="secondary" onClick={onEnroll}>
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title={t ? t('tooltip.edit') : 'Edit'}>
              <IconButton size="small" color="primary" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title={t ? t('tooltip.delete') : 'Delete'}>
              <IconButton size="small" color="error" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </ActionWrapper>
      )}
    </Box>
  );
};

// Remove the broken isMobile init. Add a safe breakpoint watcher.
const MOBILE_BREAKPOINT = 768;
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
  sortBy = 'asc',
  onDataChange = null
}) => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
  const { t } = useTranslation('datagrid'); // <-- add
  // const [searchText, setSearchText] = useState(''); // Corrected variable name
  // const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false));

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: defaultPageSize });
  const [rowCount, setRowCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [gridFilters, setGridFilters] = useState(filters);
  const [gridData, setGridData] = useState([]);
  const accountId = userDetails.getAccountId();
  const user = useSelector((state) => state.user.user);
  const isStudent = user?.type === 'STUDENT';
  const isTeacher = user?.type === 'TEACHER';
  const isAdmin = user?.type === 'ADMIN';

  // Teacher's school id (if available) — used to force school filter/payload
  const teacherSchoolId = user?.schoolId ?? userDetails.getUser()?.schoolId ?? null;

  // SCD data for resolving names from ids (schools/classes/divisions)
  const { schools = [], classes = [], divisions = [], loading: scdLoading, error: scdError } = useSCDData();

  // track initial fetch to handle Admin "don't send filters on landing" rule
  const isInitialLoadRef = useRef(true);

  // Sync external filters prop with internal gridFilters state

  const transformDocumentData = useCallback(
    (document) => {
      const school = schools.find((sch) => sch.id === document.schoolId);
      const classObj = classes.find((cls) => cls.id === document.classId);
      const division = divisions.find((div) => div.id === document.divisionId);
      return {
        ...document,
        documentName: document.name,
        schoolName: school ? school.name : 'N/A',
        className: classObj ? classObj.name : 'N/A',
        divisionName: division ? division.name : 'N/A'
      };
    },
    [schools, classes, divisions]
  );

  // Use a ref to store the latest filters without triggering a re-render
  const latestFilters = useRef(gridFilters);
  useEffect(() => {
    latestFilters.current = gridFilters;
  }, [gridFilters]);

  // stable key for gridFilters to use in hook deps
  const gridFiltersKey = React.useMemo(() => JSON.stringify(gridFilters), [gridFilters]);

  // Memoized function to fetch data, preventing infinite loops
  const fetchData = useCallback(async () => {
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

      if (onDataChange) {
        onDataChange(transformedData);
      }
      return;
    }

    setLoading(true);
    try {
      let response;
      const method = (requestMethod || (isPostRequest ? 'POST' : 'GET')).toUpperCase();

      const studentDefaults = getUserSchoolClassDivision() || {};
      const enforcedFilters = {};

      if (isStudent) {
        if (studentDefaults.schoolId != null) {
          enforcedFilters.schoolId = studentDefaults.schoolId;
        }
        if (studentDefaults.classId != null) {
          enforcedFilters.classId = studentDefaults.classId;
        }
        if (studentDefaults.divisionId != null) {
          enforcedFilters.divisionId = studentDefaults.divisionId;
        }
      }

      let teacherClassList = [];
      let teacherDivisionList = [];
      if (isTeacher && Array.isArray(user?.allocatedClasses)) {
        teacherClassList = Array.from(new Set(user.allocatedClasses.map((ac) => ac.classId).filter(Boolean)));
        teacherDivisionList = Array.from(new Set(user.allocatedClasses.map((ac) => ac.divisionId).filter(Boolean)));
        if (teacherSchoolId != null) {
          enforcedFilters.schoolId = teacherSchoolId;
        }
      }

      const isInitialLoad = isInitialLoadRef.current;
      const uiFilters = {};
      if (!(isAdmin && isInitialLoad)) {
        Object.assign(uiFilters, latestFilters.current);
      }

      const basePayload = {
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sortBy: 'id',
        sortDir: sortBy,
        search: searchText
      };

      const payload = { ...basePayload, ...uiFilters, ...enforcedFilters };

      // Remove classList and divisionList if classId or divisionId is selected
      if (uiFilters.classId || uiFilters.divisionId) {
        delete payload.classList;
        delete payload.divisionList;
      } else if (isTeacher) {
        if (teacherClassList.length) {
          payload.classList = teacherClassList;
        }
        if (teacherDivisionList.length) {
          payload.divisionList = teacherDivisionList;
        }
      }

      if (method === 'POST') {
        response = await api.post(fetchUrl, payload);
      } else if (sendBodyOnGet) {
        response = await api.get(fetchUrl, { data: payload });
      } else {
        const queryParams = new URLSearchParams({
          page: paginationModel.page,
          size: paginationModel.pageSize,
          search: searchText,
          ...latestFilters.current,
          ...enforcedFilters
        });
        response = await api.get(`${fetchUrl}?${queryParams}`);
      }

      const responseData = response.data.content || response.data || [];
      const transformedData = transformData ? responseData.map(transformData) : responseData;

      setGridData(transformedData);
      setRowCount(response.data.totalElements || response.data.length || 0);

      if (onDataChange) {
        onDataChange(transformedData);
      }
    } catch (err) {
      console.error(`Failed to fetch data from ${fetchUrl}:`, err);
      toast.error(t('toast.fetchFail')); // <-- localized
      setGridData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
    }
  }, [
    fetchUrl,
    isPostRequest,
    requestMethod,
    sendBodyOnGet,
    searchText,
    transformData,
    clientSideData,
    paginationModel,
    isAdmin,
    isStudent,
    isTeacher,
    sortBy,
    teacherSchoolId,
    user?.allocatedClasses,
    onDataChange,
    t // <-- add
  ]);

  // Handle filter changes from ListGridFilters
  const handleFiltersChange = useCallback((newFilters) => {
    setGridFilters(newFilters);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  useEffect(() => {
    if (!fetchUrl) return;
    fetchData();
  }, [fetchUrl, paginationModel.page, paginationModel.pageSize, searchText, gridFilters]);
  const handleSearchChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
  };

  const handleOnClickDelete = async (id) => {
    if (window.confirm(t('confirm.deleteItem'))) {
      // <-- localized confirm
      try {
        await api.delete(`${deleteUrl}/${accountId}/${id}`);
        toast.success(t('toast.deleteSuccess')); // <-- localized
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error(t('toast.deleteFail')); // <-- localized
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
        headerName: t('header.actions'), // <-- localized header
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const hasCustomActions = customActions.length > 0;

          if (hasCustomActions) {
            return (
              <ActionWrapper>
                {customActions.map((action, index) => {
                  // if (action.permission && !hasPermission(permissions, entityName, action.permission)) {
                  //   return null;
                  // }

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
                <Tooltip title={t('tooltip.viewDetails')}>
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
                <Tooltip title={t('tooltip.enroll')}>
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
                <Tooltip title={t('tooltip.edit')}>
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
                <Tooltip title={t('tooltip.delete')}>
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

  // Function to get the correct name for a given ID
  const getNameForId = (id, map) => map[id] || 'N/A';

  const processedColumns = propColumns.map((col) => {
    // If a custom valueFormatter is already defined, don't override it
    if (col.valueFormatter || col.renderCell) {
      return col;
    }
    if (col.field === '') {
      return {
        ...col,
        valueFormatter: (params) => getNameForId(params.value, schoolNameMap),
        headerName: col.headerName || t('columnHeader.school') // <-- localized
      };
    }
    // Resolve school/class/division names using SCD data when available
    if (col.field === 'schoolId') {
      return {
        ...col,
        headerName: col.headerName || t('columnHeader.school'), // <-- localized
        valueGetter: (params) => {
          // defensive guards: params may be null during some grid lifecycle phases
          const idFromParam = params?.value;
          const row = params?.row || {};
          const id = idFromParam ?? row.schoolId ?? null;

          if (!id) {
            return '';
          }
          if (schoolNameMap && schoolNameMap[id]) {
            return schoolNameMap[id];
          }
          const school = schools.find((sch) => String(sch.id) === String(id));
          return school ? school.name : '';
        },
        renderCell: (params) => {
          const text = params?.value ?? '';
          return (
            <Typography variant="body2" title={text}>
              {text}
            </Typography>
          );
        }
      };
    }

    if (col.field === 'classId') {
      return {
        ...col,
        headerName: col.headerName || t('columnHeader.class'), // <-- localized
        valueGetter: (params) => {
          const idFromParam = params?.value;
          const row = params?.row || {};
          const id = idFromParam ?? row.classId ?? null;

          if (!id) {
            return '';
          }
          if (classNameMap && classNameMap[id]) {
            return classNameMap[id];
          }
          const cls = classes.find((c) => String(c.id) === String(id));
          return cls ? cls.name : '';
        },
        renderCell: (params) => {
          const text = params?.value ?? '';
          return (
            <Typography variant="body2" title={text}>
              {text}
            </Typography>
          );
        }
      };
    }

    if (col.field === 'divisionId') {
      return {
        ...col,
        headerName: col.headerName || t('columnHeader.division'), // <-- localized
        valueGetter: (params) => {
          const idFromParam = params?.value;
          const row = params?.row || {};
          const id = idFromParam ?? row.divisionId ?? null;

          if (!id) {
            return '';
          }
          if (divisionNameMap && divisionNameMap[id]) {
            return divisionNameMap[id];
          }
          const div = divisions.find((d) => String(d.id) === String(id));
          return div ? div.name : '';
        },
        renderCell: (params) => {
          const text = params?.value ?? '';
          return (
            <Typography variant="body2" title={text}>
              {text}
            </Typography>
          );
        }
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
  const searchPlaceholderText = searchPlaceholder || t('search.placeholder'); // <-- localized placeholder
  const headerSearchControls = (
    <HeaderSearchWrapper>
      {showSearch && (
        <TextField
          size="small"
          placeholder={searchPlaceholderText}
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
          {t('action.refresh')}
        </Button>
      )}
      {showFilters && Object.keys(gridFilters).length > 0 && (
        <Chip
          icon={<FilterListIcon />}
          label={`${Object.keys(gridFilters).length} ${t('search.filtersActive')}`}
          variant="outlined"
          color="primary"
        />
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
      contentSX={{ p: 1 }}
    >
      {customToolbar && customToolbar()}

      {enableFilters && (showSchoolFilter || showClassFilter || showDivisionFilter) && !isStudent && (
        <ListGridFiltersContainer
          filters={gridFilters}
          onFiltersChange={handleFiltersChange}
          // pass SCD lists so the container shows the saved state lists
          schools={schools}
          classes={classes}
          divisions={divisions}
          loading={scdLoading}
          // keep previous behavior: hide school control for teachers (but container will still enforce payload)
          showSchool={!isTeacher && showSchoolFilter}
          showClass={showClassFilter}
          showDivision={showDivisionFilter}
        />
      )}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          {isMobile ? (
            // Mobile: card list view
            <Box>
              {gridData.map((row) => (
                <DataGridMobileCard
                  key={getRowIdProp(row)}
                  row={row}
                  columns={columns}
                  hasActions={hasActions}
                  onView={viewUrl ? () => handleOnClickView(row.id) : undefined}
                  onEdit={editUrl ? () => navigate(`${editUrl}/${row.id}`) : undefined}
                  onDelete={deleteUrl ? () => handleOnClickDelete(row.id) : undefined}
                  onEnroll={EnrollActionUrl ? () => handleOnClickEnrollActionUrl(row.id) : undefined}
                  t={t} // <-- pass translator to mobile card tooltips
                />
              ))}

              {/* Simple pager for mobile */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={paginationModel.page === 0 || loading}
                  onClick={() => setPaginationModel((p) => ({ ...p, page: Math.max(0, p.page - 1) }))}
                >
                  Prev
                </Button>
                <Typography variant="caption">Page {paginationModel.page + 1}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={loading || (rowCount !== 0 && (paginationModel.page + 1) * paginationModel.pageSize >= rowCount)}
                  onClick={() => setPaginationModel((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next
                </Button>
              </Box>
            </Box>
          ) : (
            // Desktop: DataGrid table
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
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
};

import PropTypes from 'prop-types';

ReusableDataGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  fetchUrl: PropTypes.string,
  editUrl: PropTypes.string,
  deleteUrl: PropTypes.string,
  addActionUrl: PropTypes.string,
  EnrollActionUrl: PropTypes.string,
  viewUrl: PropTypes.string,
  filters: PropTypes.object,
  data: PropTypes.array,
  isPostRequest: PropTypes.bool,
  requestMethod: PropTypes.string,
  sendBodyOnGet: PropTypes.bool,
  entityName: PropTypes.string,
  customActionsHeader: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  showRefresh: PropTypes.bool,
  showFilters: PropTypes.bool,
  pageSizeOptions: PropTypes.array,
  defaultPageSize: PropTypes.number,
  height: PropTypes.number,
  transformData: PropTypes.func,
  onRowClick: PropTypes.func,
  selectionModel: PropTypes.any,
  onSelectionModelChange: PropTypes.func,
  checkboxSelection: PropTypes.bool,
  disableSelectionOnClick: PropTypes.bool,
  getRowClassName: PropTypes.func,
  customToolbar: PropTypes.func,
  loadingOverlay: PropTypes.node,
  errorOverlay: PropTypes.node,
  showSchoolFilter: PropTypes.bool,
  showClassFilter: PropTypes.bool,
  showDivisionFilter: PropTypes.bool,
  enableFilters: PropTypes.bool,
  customActions: PropTypes.array,
  getRowId: PropTypes.func,
  schoolNameMap: PropTypes.object,
  classNameMap: PropTypes.object,
  divisionNameMap: PropTypes.object,
  sortBy: PropTypes.string,
  onDataChange: PropTypes.func
};

export default ReusableDataGrid;
