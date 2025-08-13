import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  TextField,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';
import { useSelector } from 'react-redux';

const FeeDashboard = () => {
  const [fees, setFees] = useState([]);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSetupModal, setOpenSetupModal] = useState(false);
  const user = useSelector((state) => state.user);
  // Fee setup form state
  const [feeSetup, setFeeSetup] = useState({
    feeTitle: '',
    amount: '',
    dueDate: '',
    schoolId: '',
    classId: '',
    divisionId: '',
    discount: '',
    lateFinePerDay: '',
    installmentsEnabled: false,
    installmentCount: 1
  });

  const [summaryData, setSummaryData] = useState({
    totalDue: 0,
    totalCollected: 0,
    pendingFees: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedSchool || selectedClass || selectedDivision) {
      fetchFees();
      fetchSummary();
    }
  }, [selectedSchool, selectedClass, selectedDivision]);

  const fetchInitialData = async () => {
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
      
      // Fetch all fees initially
      await fetchFees();
      await fetchSummary();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSchool) params.append('schoolId', selectedSchool);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedDivision) params.append('divisionId', selectedDivision);
      
      const response = await api.get(`/api/admin/fees/summary/${user?.user?.accountId}?${params.toString()}`);
      setFees(response.data?.fees || []);
      setSummaryData(response.data || { totalDue: 0, totalCollected: 0, pendingFees: 0 });
    } catch (error) {
      console.error('Error fetching fees:', error);
      setFees([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSchool) params.append('schoolId', selectedSchool);
      if (selectedClass) params.append('classId', selectedClass);
      if (selectedDivision) params.append('divisionId', selectedDivision);
      
      const response = await api.get(`/api/admin/fees/?${params.toString()}`);
      setSummaryData(response.data || { totalDue: 0, totalCollected: 0, pendingFees: 0 });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

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
      await fetchFees();
     // await fetchSummary();
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Fee Management Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenSetupModal(true)}
          sx={{ ml: 'auto' }}
        >
          Add New Fee
        </Button>
      </Box>

      {/* Filters */}
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

      {/* Summary Cards */}
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

      {/* Fee List */}
      <MainCard title="Fee Summary">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fee Name</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Division</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees?.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.feeName}</TableCell>
                  <TableCell>{fee.schoolName}</TableCell>
                  <TableCell>{fee.className}</TableCell>
                  <TableCell>{fee.divisionName}</TableCell>
                  <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(fee.totalAmount)}</TableCell>
                  <TableCell>{formatCurrency(fee.paidAmount)}</TableCell>
                  <TableCell>{formatCurrency(fee.pendingAmount)}</TableCell>
                  <TableCell>{getStatusChip(fee.status)}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="success">
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {fees?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No fees found. Click "Add New Fee" to create your first fee structure.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* Fee Setup Modal */}
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