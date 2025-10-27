import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// material-ui
import {
  Grid,
  Tabs,
  Tab,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  CreditCard as IdCardIcon,
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import IdCardGenerationModal from './IdCardGenerationModal';
import api, { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../../utils/permissionUtils';
import { useTranslation } from 'react-i18next';
// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minHeight: 48
  }
}));

const ActionContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px',
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px'
});

const SelectionInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#1976d2'
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`idcard-tabpanel-${index}`} aria-labelledby={`idcard-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `idcard-tab-${index}`,
    'aria-controls': `idcard-tabpanel-${index}`
  };
}

const IdCardManagement = () => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
  const accountId = userDetails.getAccountId();
  const { t } = useTranslation('idcard');
  const [tabValue, setTabValue] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [generationModalOpen, setGenerationModalOpen] = useState(false);
  const [currentGridData, setCurrentGridData] = useState([]); // Track current grid data for Select All

  // Student columns configuration
  const studentColumns = [
    {
      field: 'select',
      headerName: t('column.select') || 'Select',
      width: 80,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) => handleRowSelection(params.row.id, e.target.checked)}
          color="primary"
        />
      ),
      disableColumnMenu: true,
      sortable: false
    },
    { field: 'id', headerName: t('column.id') || 'ID', width: 70 },
    { field: 'rollNo', headerName: t('column.rollNo') || 'Roll No', width: 100 },
    {
      field: 'fullName',
      headerName: t('column.studentName') || 'Student Name',
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon color="primary" fontSize="small" />
          <Typography variant="body2">
            {`${params.row.firstName || ''} ${params.row.middleName || ''} ${params.row.lastName || ''}`.trim()}
          </Typography>
        </Box>
      )
    },
    {
      field: 'className',
      headerName: t('column.class') || 'Class',
      width: 100,
      renderCell: (params) => <Chip label={params.value} size="small" color="primary" variant="outlined" />
    },
    {
      field: 'divisionName',
      headerName: t('column.division') || 'Division',
      width: 100,
      renderCell: (params) => <Chip label={params.value} size="small" color="secondary" variant="outlined" />
    },
    { field: 'email', headerName: t('column.email') || 'Email', width: 180 },
    { field: 'mobile', headerName: t('column.mobile') || 'Mobile', width: 130 },
    {
      field: 'gender',
      headerName: t('column.gender') || 'Gender',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'Male' ? 'info' : 'success'} variant="outlined" />
      )
    },
    {
      field: 'actions',
      headerName: t('column.actions') || 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" color="primary" title={t('action.viewDetails') || 'View Details'}>
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            title={t('action.generateIdCard') || 'Generate ID Card'}
            onClick={() => handleSingleIdGeneration(params.row)}
          >
            <IdCardIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      disableColumnMenu: true,
      sortable: false
    }
  ];

  // Teacher columns configuration
  const teacherColumns = [
    {
      field: 'select',
      headerName: t('column.select') || 'Select',
      width: 80,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) => handleRowSelection(params.row.id, e.target.checked)}
          color="primary"
        />
      ),
      disableColumnMenu: true,
      sortable: false
    },
    { field: 'id', headerName: t('column.id') || 'ID', width: 70 },
    {
      field: 'fullName',
      headerName: t('column.teacherName') || 'Teacher Name',
      width: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" fontSize="small" />
          <Typography variant="body2">
            {`${params.row.firstName || ''} ${params.row.middleName || ''} ${params.row.lastName || ''}`.trim()}
          </Typography>
        </Box>
      )
    },
    { field: 'email', headerName: t('column.email') || 'Email', width: 180 },
    { field: 'mobile', headerName: t('column.mobile') || 'Mobile', width: 130 },
    {
      field: 'roleName',
      headerName: t('column.role') || 'Role',
      width: 120,
      renderCell: (params) => <Chip label={params.value} size="small" color="warning" variant="outlined" />
    },
    {
      field: 'gender',
      headerName: t('column.gender') || 'Gender',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'Male' ? 'info' : 'success'} variant="outlined" />
      )
    },
    {
      field: 'status',
      headerName: t('column.status') || 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'Active' ? 'success' : 'error'} variant="outlined" />
      )
    },
    {
      field: 'actions',
      headerName: t('column.actions') || 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" color="primary" title={t('action.viewDetails') || 'View Details'}>
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            title={t('action.generateIdCard') || 'Generate ID Card'}
            onClick={() => handleSingleIdGeneration(params.row)}
          >
            <IdCardIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      disableColumnMenu: true,
      sortable: false
    }
  ];

  // SCD data is now handled by SCDProvider context via SCDSelector

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedRows([]);
    setAllSelected(false);
  };

  const handleRowSelection = (id, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      setAllSelected(false);
    }
  };

  const handleSelectAll = (checked) => {
    setAllSelected(checked);
    if (checked) {
      // Select all rows from current grid data
      const allRowIds = currentGridData.map((row) => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSingleIdGeneration = (userData) => {
    setSelectedRows([userData.id]);
    setGenerationModalOpen(true);
  };

  const handleBulkIdGeneration = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one record to generate ID cards.');
      return;
    }
    setGenerationModalOpen(true);
  };

  const handleGridDataChange = useCallback((data) => {
    setCurrentGridData(data);
    // Reset selections when data changes
    setSelectedRows([]);
    setAllSelected(false);
  }, []);

  // Update allSelected state based on current selections
  useEffect(() => {
    if (currentGridData.length > 0 && selectedRows.length === currentGridData.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedRows, currentGridData]);

  const getCurrentEntity = () => (tabValue === 0 ? 'STUDENT' : 'TEACHER');
  const getCurrentFetchUrl = () => `/api/users/getAllBy/${accountId}?type=${getCurrentEntity()}`; // Single endpoint for both types
  const getCurrentColumns = () => (tabValue === 0 ? studentColumns : teacherColumns);

  return (
    <MainCard
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IdCardIcon color="primary" />
          <Typography variant="h3">{t('title.idCardManagement') || 'ID Card Management'}</Typography>
        </Box>
      }
      secondary={
        <SecondaryAction title={t('secondary.description') || 'Manage student and teacher ID cards with professional templates'} />
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="ID card management tabs">
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    {t('tab.students') || 'Students'}
                  </Box>
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon />
                    {t('tab.teachers') || 'Teachers'}
                  </Box>
                }
                {...a11yProps(1)}
              />
            </StyledTabs>
          </Box>

          {/* Actions */}
          <ActionContainer>
            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
              <Grid item>
                <FormControlLabel
                  control={<Checkbox checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} color="primary" />}
                  label={t('action.selectAll') || 'Select All'}
                />
              </Grid>

              {selectedRows.length > 0 && (
                <Grid item>
                  <SelectionInfo>
                    <Typography variant="body2" fontWeight="600">
                      {selectedRows.length} {t('action.selected') || 'selected'}
                    </Typography>
                  </SelectionInfo>
                </Grid>
              )}

              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<IdCardIcon />}
                  onClick={handleBulkIdGeneration}
                  disabled={selectedRows.length === 0}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {t('button.generateIdCards') || 'Generate ID Cards'}
                </Button>
              </Grid>
            </Grid>
          </ActionContainer>

          {/* Data Grid Tabs */}
          <TabPanel value={tabValue} index={0}>
            <ReusableDataGrid
              title={t('tab.students') || 'Students'}
              fetchUrl={getCurrentFetchUrl()}
              columns={getCurrentColumns()}
              entityName="STUDENT"
              checkboxSelection={false}
              requestMethod="POST"
              enableFilters={true}
              showSchoolFilter={true}
              showClassFilter={true}
              showDivisionFilter={true}
              showSearch={true}
              showRefresh={true}
              searchPlaceholder={t('searchPlaceholder.students') || 'Search by Name/Roll No/Email'}
              onDataChange={handleGridDataChange}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <ReusableDataGrid
              title={t('tab.teachers') || 'Teachers'}
              fetchUrl={getCurrentFetchUrl()}
              columns={getCurrentColumns()}
              entityName="TEACHER"
              checkboxSelection={false}
              requestMethod="POST"
              enableFilters={true}
              showSchoolFilter={true}
              showClassFilter={true}
              showDivisionFilter={true}
              showSearch={true}
              showRefresh={true}
              searchPlaceholder={t('searchPlaceholder.teachers') || 'Search by Name/Email'}
              onDataChange={handleGridDataChange}
            />
          </TabPanel>
        </Grid>
      </Grid>

      {/* ID Card Generation Modal */}
      <IdCardGenerationModal
        open={generationModalOpen}
        onClose={() => setGenerationModalOpen(false)}
        selectedRows={selectedRows}
        onComplete={() => {
          setGenerationModalOpen(false);
          setSelectedRows([]);
          setAllSelected(false);
        }}
      />
    </MainCard>
  );
};

export default IdCardManagement;
