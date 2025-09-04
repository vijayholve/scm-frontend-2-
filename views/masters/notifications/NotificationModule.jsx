// src/views/masters/notifications/NotificationModule.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Box, Typography, Button, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Checkbox, FormControlLabel, RadioGroup, Radio, Chip, Divider, Switch,
  TableContainer ,
  TablePagination
} from '@mui/material';

import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';

// Dummy Data (replace with API calls)
const dummyNotifications = [
  {
    id: 1,
    title: "Exam Timetable Released",
    message: "The exam timetable for Class 8A has been uploaded. Please check the Exam Module.",
    audience: "Class 8A",
    userType: ["STUDENT"],
    status: "Active",
    priority: "High",
    rollingBanner: true,
    type: "Info",
    activeFrom: "2025-09-01",
    activeTo: "2025-09-05",
    createdBy: "Admin"
  },
  {
    id: 2,
    title: "Fee Due Reminder",
    message: "Fee payment is due on Sep 5th. Please pay at your earliest convenience.",
    audience: "Entire School",
    userType: ["STUDENT", "PARENT"],
    status: "Active",
    priority: "Normal",
    rollingBanner: true,
    type: "Reminder",
    activeFrom: "2025-09-01",
    activeTo: "2025-09-05",
    createdBy: "Admin"
  },
  {
    id: 3,
    title: "Holiday Notice",
    message: "Tomorrow is a holiday for Ganesh Chaturthi.",
    audience: "All Parents",
    userType: ["PARENT"],
    status: "Expired",
    priority: "Normal",
    rollingBanner: false,
    type: "Info",
    activeFrom: "2025-08-30",
    activeTo: "2025-08-30",
    createdBy: "Admin"
  }
];

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NotificationModule = () => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  
  // FIX: These state variables were moved inside the component body
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formState, setFormState] = useState({
    title: '',
    message: '',
    audience: 'Entire School',
    userType: [],
    activeFrom: '',
    activeTo: '',
    priority: 'Normal',
    type: 'Info',
    rollingBanner: false,
    id: null
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenCreate = () => {
    setEditData(null);
    setFormState({
      title: '', message: '', audience: 'Entire School', userType: [],
      activeFrom: '', activeTo: '', priority: 'Normal', type: 'Info', rollingBanner: false
    });
    setOpenCreateModal(true);
  };

  const handleOpenEdit = (data) => {
    setEditData(data);
    setFormState(data);
    setOpenCreateModal(true);
  };

  const handleOpenView = (data) => {
    setViewData(data);
  };

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = () => {
    // API Call Placeholder
    // if (editData) {
    //   // api.put('/api/notifications/update', formState);
    // } else {
    //   // api.post('/api/notifications/create', formState);
    // }
    setOpenCreateModal(false);
    // Refresh list with dummy data (for demo)
    setNotifications(prev => {
        const newNotif = { ...formState, id: editData ? editData.id : Date.now(), status: 'Active' };
        if (editData) {
            return prev.map(n => n.id === newNotif.id ? newNotif : n);
        }
        return [...prev, newNotif];
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      // API Call Placeholder
      // api.delete(`/api/notifications/delete/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredNotifications = notifications.filter(n => {
    const now = new Date().toISOString().split('T')[0];
    if (tabValue === 1 && n.activeTo < now) return true; // Expired
    if (tabValue === 2 && n.activeTo >= now) return true; // Active
    if (tabValue === 0) return true; // All
    return false;
  });

  // slice data for pagination
  const paginatedNotifications = filteredNotifications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'audience', headerName: 'Audience', width: 150 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <Chip label={params.value} color={params.value === 'Active' ? 'success' : 'error'} size="small" /> },
    { field: 'activeFrom', headerName: 'Active From', width: 150 },
    { field: 'activeTo', headerName: 'Active To', width: 150 },
  ];

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button onClick={() => handleOpenView(params.row)} size="small" startIcon={<ViewIcon />}>View</Button>
        {hasPermission(permissions, 'NOTIFICATION', 'edit') && (
            <Button onClick={() => handleOpenEdit(params.row)} size="small" startIcon={<EditIcon />}>Edit</Button>
        )}
        {hasPermission(permissions, 'NOTIFICATION', 'delete') && (
            <Button onClick={() => handleDelete(params.row.id)} size="small" startIcon={<DeleteIcon />} color="error">Delete</Button>
        )}
      </Box>
    )
  };
    
  return (
    <MainCard title="Notifications" secondary={<Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>Create New</Button>}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="notification tabs">
              <Tab label="All Notifications" />
              <Tab label="Active" />
              <Tab label="Expired" />
            </StyledTabs>
          </Box>
          <Box sx={{ height: 600, width: '100%', mt: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map(col => <TableCell key={col.field}>{col.headerName}</TableCell>)}
                    <TableCell>{actionColumn.headerName}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedNotifications.map(row => (
                    <TableRow key={row.id}>
                      {columns.map(col => (
                        <TableCell key={col.field}>
                          {col.renderCell ? col.renderCell({ value: row[col.field] }) : row[col.field]}
                        </TableCell>
                      ))}
                      <TableCell>{actionColumn.renderCell({ row })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredNotifications.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editData ? 'Edit Notification' : 'Create New Notification'}</DialogTitle>
        <DialogContent>
          <TextField name="title" label="Title" value={formState.title} onChange={handleFormChange} fullWidth margin="normal" />
          <TextField name="message" label="Message" value={formState.message} onChange={handleFormChange} fullWidth multiline rows={4} margin="normal" />
          <TextField
            select
            name="audience"
            label="Audience"
            value={formState.audience}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Entire School">Entire School</MenuItem>
            <MenuItem value="Class">Specific Class</MenuItem>
            <MenuItem value="Division">Specific Division</MenuItem>
          </TextField>
          <TextField name="activeFrom" label="Active From" type="date" value={formState.activeFrom} onChange={handleFormChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField name="activeTo" label="Active To" type="date" value={formState.activeTo} onChange={handleFormChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <RadioGroup row name="priority" value={formState.priority} onChange={handleFormChange} sx={{ mt: 2 }}>
            <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
            <FormControlLabel value="High" control={<Radio />} label="High" />
          </RadioGroup>
          <FormControlLabel
            control={<Switch name="rollingBanner" checked={formState.rollingBanner} onChange={handleFormChange} />}
            label="Show as Rolling Banner"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!viewData} onClose={() => setViewData(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewData?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Audience:</strong> {viewData?.audience}</Typography>
          <Typography variant="body1"><strong>Active:</strong> {viewData?.activeFrom} → {viewData?.activeTo}</Typography>
          <Typography variant="body1"><strong>Priority:</strong> {viewData?.priority}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2">{viewData?.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewData(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default NotificationModule;