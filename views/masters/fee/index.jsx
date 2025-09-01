import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  TextField,
  MenuItem,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import MainCard from 'ui-component/cards/MainCard';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { gridSpacing } from 'store/constant';
import api from 'utils/apiService';
import { useSelector } from 'react-redux';

const FeeDashboard = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSetupModal, setOpenSetupModal] = useState(false);
  const user = useSelector((state) => state.user);

  const [feeSetup, setFeeSetup] = useState({
    feeTitle: '',
    amount: '',
    dueDate: '',
    schoolId: '',
    schoolName: '',
    classId: '',
    className: '',
    divisionId: '',
    divisionName: '',
    discount: '',
    lateFinePerDay: '',
    installmentsEnabled: false,
    installmentCount: 1
  });

  const [summaryData, setSummaryData] = useState({
    fees: [],
    totalAmount: 0,
    totalPaid: 0,
    totalPending: 0
  });

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const [schoolsRes, classesRes, divisionsRes] = await Promise.all([
        api.get(`/api/schoolBranches/getAllBy/${user?.user?.accountId}`),
        api.get(`/api/schoolClasses/getAllBy/${user?.user?.accountId}`),
        api.get(`/api/divisions/getAllBy/${user?.user?.accountId}`)
      ]);
      
      setSchools(schoolsRes.data || []);
      setClasses(classesRes.data || []);
      setDivisions(divisionsRes.data || []);
      
      const params = new URLSearchParams();
      if (selectedSchool) params.append('schoolId', selectedSchool);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedDivision) params.append('divisionId', selectedDivision);

      const response = await api.get(`/api/admin/fees/summary/${user?.user?.accountId}?${params.toString()}`);
const feesWithIds = response.data.fees ? response.data.fees.map((fee, index) => ({
        ...fee,
        id: index + 1
      })) : [];

      setSummaryData({
        ...response.data,
        fees: feesWithIds
      });
            
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setSummaryData({ fees: [], totalAmount: 0, totalPaid: 0, totalPending: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user?.accountId) {
      fetchFeeData();
    }
  }, [user?.user?.accountId, selectedSchool, selectedClass, selectedDivision]);
  
  const handleSetupFee = async () => {
    try {
      feeSetup.accountId = user?.user?.accountId;
      await api.post('/api/admin/fees/structure', feeSetup);
      setOpenSetupModal(false);
      setFeeSetup({
        feeTitle: '',
        amount: '',
        dueDate: '',
        schoolId: '',
        schoolName: '',
        classId: '',
        className: '',
        divisionId: '',
        divisionName: '',
        discount: '',
        lateFinePerDay: '',
        installmentsEnabled: false,
        installmentCount: 1
      });
      await fetchFeeData();
    } catch (error) {
      console.error('Error creating fee:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'active': { color: 'success', label: 'Active' },
      'draft': { color: 'warning', label: 'Draft' },
      'expired': { color: 'error', label: 'Expired' }
    };

    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const columns = [
    { field: 'feeName', headerName: 'Fee Name', flex: 1 },
    { field: 'schoolName', headerName: 'School', width: 150 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'divisionName', headerName: 'Division', width: 120 },
    { field: 'totalAmount', headerName: 'Total', width: 120, valueFormatter: (params) => `₹${params?.value}` },
    { field: 'paidAmount', headerName: 'Paid', width: 120, valueFormatter: (params) => `₹${params?.value}` },
    { field: 'pendingAmount', headerName: 'Pending', width: 120, valueFormatter: (params) => `₹${params?.value}` },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const statusConfig = {
          'active': { color: 'success', label: 'Active' },
          'draft': { color: 'warning', label: 'Draft' },
          'expired': { color: 'error', label: 'Expired' }
        };
        const config = statusConfig[params.value] || { color: 'default', label: params.value };
        return <Chip label={config.label} color={config.color} size="small" />;
      },
    },
  ];

  const customActions = [
    {
      icon: <ViewIcon />,
      label: 'View',
      tooltip: 'View Details',
      color: 'primary',
      onClick: (row) => navigate(`/masters/fees/view/${row.id}`),
      permission: 'view'
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      tooltip: 'Edit Fee',
      color: 'secondary',
      onClick: (row) => navigate(`/masters/fees/edit/${row.id}`),
      permission: 'edit'
    },
    {
      icon: <DownloadIcon />,
      label: 'Download',
      tooltip: 'Download Report',
      color: 'success',
      onClick: (row) => alert(`Downloading report for Fee ID: ${row.id}`),
      permission: 'download'
    }
  ];

  const customActionsHeader = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenSetupModal(true)}
      >
        Add New Fee
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <MainCard title="Filters" sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="School"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              <MenuItem value="">All Schools</MenuItem>
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value="">All Classes</MenuItem>
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Division"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <MenuItem value="">All Divisions</MenuItem>
              {divisions.map((division) => (
                <MenuItem key={division.id} value={division.id}>
                  {division.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </MainCard>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Due</Typography>
              <Typography variant="h4">{formatCurrency(summaryData.totalAmount)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Collected</Typography>
              <Typography variant="h4">{formatCurrency(summaryData.totalPaid)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Pending Fees</Typography>
              <Typography variant="h4">{formatCurrency(summaryData.totalPending)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <ReusableDataGrid
        title="Fee Summary"
        data={summaryData.fees}
        columns={columns}
        entityName="FEE_MANAGEMENT"
        customActions={customActions}
        customActionsHeader={customActionsHeader}
        fetchUrl={null}
        isPostRequest={false}
        getRowId={(row) => row.feeName}
        enableFilters={true}
        showSchoolFilter={true}
        showClassFilter={true}
        showDivisionFilter={true}
        showSearch={true}
        showRefresh={true}
        filters={{ schoolId: selectedSchool, classId: selectedClass, divisionId: selectedDivision }}
      />
      
      <Dialog 
        open={openSetupModal} 
        onClose={() => setOpenSetupModal(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            ➕ Add New Fee
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fee Title"
                value={feeSetup.feeTitle}
                onChange={(e) => setFeeSetup({ ...feeSetup, feeTitle: e.target.value })}
                placeholder="Term 1 Tuition Fee"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={feeSetup.amount}
                onChange={(e) => setFeeSetup({ ...feeSetup, amount: e.target.value })}
                placeholder="12000"
                InputProps={{
                  startAdornment: '₹'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={feeSetup.dueDate}
                onChange={(e) => setFeeSetup({ ...feeSetup, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="School"
                value={feeSetup.schoolId}
                onChange={(e) => setFeeSetup({ ...feeSetup, schoolId: e.target.value, schoolName: schools.find(s => s.id === e.target.value)?.name })}
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Class"
                value={feeSetup.classId}
                onChange={(e) => setFeeSetup({ ...feeSetup, classId: e.target.value, className: classes.find(c => c.id === e.target.value)?.name })}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Division"
                value={feeSetup.divisionId}
                onChange={(e) => setFeeSetup({ ...feeSetup, divisionId: e.target.value, divisionName: divisions.find(d => d.id === e.target.value)?.name })}
              >
                {divisions.map((division) => (
                  <MenuItem key={division.id} value={division.id}>
                    {division.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount (Optional)"
                type="number"
                value={feeSetup.discount}
                onChange={(e) => setFeeSetup({ ...feeSetup, discount: e.target.value })}
                placeholder="1000"
                InputProps={{
                  startAdornment: '₹'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Late Fee After Due"
                type="number"
                value={feeSetup.lateFinePerDay}
                onChange={(e) => setFeeSetup({ ...feeSetup, lateFinePerDay: e.target.value })}
                placeholder="100"
                InputProps={{
                  startAdornment: '₹',
                  endAdornment: '/ day'
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenSetupModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSetupFee}
              disabled={!feeSetup.feeTitle || !feeSetup.amount || !feeSetup.dueDate}
            >
              Save Fee Structure
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default FeeDashboard;