import React, { useMemo, useState, useEffect } from 'react';
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
import FeeStructureForm from 'views/masters/fee/components/FeeStructureForm';
const FeeDashboard = () => {
  const navigate = useNavigate(); 
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSetupModal, setOpenSetupModal] = useState(false);
  const [editFeeId, setEditFeeId] = useState(null);
  const user = useSelector((state) => state.user);

  const [feeSetup, setFeeSetup] = useState({
    feeTitle: '',
    year: '',
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

  const fetchMasters = async () => {
    try {
      setLoading(true);
      // fetch masters with single hit each
      const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
      const [schoolsRes, classesRes, divisionsRes] = await Promise.all([
        api.post(`/api/schoolBranches/getAll/${user?.user?.accountId}`, payload),
        api.post(`/api/schoolClasses/getAll/${user?.user?.accountId}`, payload),
        api.post(`/api/divisions/getAll/${user?.user?.accountId}`, payload)
      ]);

      setSchools(schoolsRes.data.content || []);
      setClasses(classesRes.data.content || []);
      setDivisions(divisionsRes.data.content || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const summaryPayload = {
        page: 0,
        size: 10,
        sortBy: 'id',
        sortDir: 'asc',
        schoolId: selectedSchool || null,
        classId: selectedClass || null,
        divisionId: selectedDivision || null,
        fromYear: fromYear || null,
        toYear: toYear || null
      };
      // Attempt POST with body; if not supported by browser/server, fall back to query params
      try {
        const resp = await api.post(`/api/admin/fees/summary/v1/${user?.user?.accountId}`, summaryPayload);
        setSummaryData({
          fees: [],
          totalAmount: resp?.data?.total || 0,
          totalPaid: resp?.data?.paid || 0,
          totalPending: resp?.data?.due || 0
        });
      } catch (e) {
        const params = new URLSearchParams({
          page: 0,
          size: 10,
          sortBy: 'id',
          sortDir: 'asc',
          schoolId: selectedSchool || '',
          classId: selectedClass || '',
          divisionId: selectedDivision || '',
          fromYear: fromYear || '',
          toYear: toYear || ''
        });
        const resp2 = await api.post(`/api/admin/fees/summary/v1/${user?.user?.accountId}`, params);
        setSummaryData({
          fees: [],
          totalAmount: resp2?.data?.total || 0,
          totalPaid: resp2?.data?.paid || 0,
          totalPending: resp2?.data?.due || 0
        });
      }
    } catch (err) {
      setSummaryData({ fees: [], totalAmount: 0, totalPaid: 0, totalPending: 0 });
    }
  };

  useEffect(() => {
    if (user?.user?.accountId) {
      fetchMasters();
    }
  }, [user?.user?.accountId]);

  useEffect(() => {
    if (user?.user?.accountId) {
      fetchSummary();
    }
  }, [user?.user?.accountId, selectedSchool, selectedClass, selectedDivision, fromYear, toYear]);
  
  const handleSetupFee = async () => {};

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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'feeName', headerName: 'Fee Name', flex: 1 },
    { field: 'schoolName', headerName: 'School', width: 150 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'divisionName', headerName: 'Division', width: 120 },
    { field: 'totalAmount', headerName: 'Total', width: 120,  },
    { field: 'paidAmount', headerName: 'Paid', width: 120, },
    { field: 'pendingAmount', headerName: 'Pending', width: 120, },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        console.log(params?.status);
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
      onClick: (row) => {
        const fid = row.feeStructureId || row.feeId || row.id;
        navigate(`/masters/fees/view/${fid}`);
      },
      permission: 'view'
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      tooltip: 'Edit Fee',
      color: 'secondary',
      onClick: (row) => {
        const fid = row.feeStructureId || row.feeId || row.id;
        setEditFeeId(fid);
        setOpenSetupModal(true);
      },
      permission: 'edit'
    },
    {
      icon: <DownloadIcon />,
      label: 'Delete',
      tooltip: 'Delete Fee Structure',
      color: 'error',
      onClick: async (row) => {
        const fid = row.feeStructureId || row.feeId || row.id;
        if (window.confirm('Are you sure you want to delete this fee structure?')) {
          try {
            await api.delete(`/api/admin/fees/structure/${fid}`);
            await fetchMastersAndSummary();
          } catch (e) {
            console.error('Delete failed', e);
          }
        }
      },
      permission: 'delete'
    }
  ];

  const customActionsHeader = (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => { setEditFeeId(null); setOpenSetupModal(true); }}
      >
        Add New Fee
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <MainCard title="Summary Filters" sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              select
              fullWidth
              label="From Year"
              value={fromYear}
              onChange={(e) => setFromYear(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => 2000 + i).map((y) => (
                <MenuItem key={y} value={y}>{`${y}-${y + 1}`}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              select
              fullWidth
              label="To Year"
              value={toYear}
              onChange={(e) => setToYear(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => 2000 + i).map((y) => (
                <MenuItem key={y} value={y}>{`${y}-${y + 1}`}</MenuItem>
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
          {/* Fee Structure Create/Edit */}
      <FeeStructureForm
        open={openSetupModal}
        onClose={() => setOpenSetupModal(false)}
        onSaved={() => { fetchSummary(); }}
        feeStructureId={editFeeId}
      />
    </Box>
      );
};

export default FeeDashboard;