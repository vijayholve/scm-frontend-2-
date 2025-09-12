// src/views/masters/notifications/NotificationModule.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Box, Typography, Button, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Divider, Switch, RadioGroup, Radio, FormControlLabel, IconButton,
  TableContainer, TablePagination,
  CircularProgress
} from '@mui/material';

import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';

// Enums based on your provided schema
const ContentType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  LINK: 'LINK'
};

const NotificationType = {
  INFO: 'INFO',
  ALERT: 'ALERT',
  REMINDER: 'REMINDER',
  EVENT: 'EVENT'
};

const TargetType = {
  SCHOOL: 'SCHOOL',
  CLASS: 'CLASS',
  DIVISION: 'DIVISION',
  USER_TYPE: 'USER_TYPE'
};

const Priority = {
  LOW: 'LOW',
  HIGH: 'HIGH'
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const NotificationModule = () => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
  const user = userDetails.getUser();
  const accountId = user?.accountId;

  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [formState, setFormState] = useState({
    accountId: accountId,
    schoolId: '',
    classId: '',
    divisionId: '',
    title: '',
    message: '',
    targetType: TargetType.SCHOOL,
    targetValue: '',
    contentType: ContentType.TEXT,
    contentUrl: '',
    fromDate: '',
    toDate: '',
    priority: Priority.LOW,
    notificationType: NotificationType.INFO,
    rollingBanner: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchDropdownData = async () => {
    try {
      const [schoolRes, classRes, divisionRes, teachersRes] = await Promise.all([
        api.get(`/api/schoolBranches/getAllBy/${accountId}`),
        api.get(`/api/schoolClasses/getAllBy/${accountId}`),
        api.get(`/api/divisions/getAllBy/${accountId}`),
        api.get(`/api/users/getAllBy/${accountId}?type=TEACHER`),
      ]);
      setSchools(schoolRes.data || []);
      setClasses(classRes.data || []);
      setDivisions(divisionRes.data || []);
      setTeachers(teachersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch dropdown data:', err);
    }
  };

  const fetchNotifications = async () => {
    setIsFetchingData(true);
    const payload = {
      page: page,
      size: rowsPerPage,
      sortBy: 'id',
      sortDir: 'asc',
      search: '',
      accountId: accountId,
      status: statusFilter !== 'ALL' ? statusFilter : null
    };

    try {
      const url = `/api/notifications/getAllBy/${accountId}`;
      const response = await api.post(url, payload);
      setNotifications(response.data.content || []);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchDropdownData();
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      setPage(0);
      fetchNotifications();
    }
  }, [accountId, statusFilter, rowsPerPage]);

  useEffect(() => {
    if (accountId) {
      fetchNotifications();
    }
  }, [page]);

  const getTargetName = (type, value) => {
    switch (type) {
      case TargetType.SCHOOL:
        const school = schools.find((s) => String(s.id) === String(value));
        return school ? school.name : 'All Schools';
      case TargetType.CLASS:
        const cls = classes.find((c) => String(c.id) === String(value));
        return cls ? cls.name : 'All Classes';
      case TargetType.DIVISION:
        const div = divisions.find((d) => String(d.id) === String(value));
        return div ? div.name : 'All Divisions';
      case TargetType.USER_TYPE:
        return value || 'All User Types';
      default:
        return 'All';
    }
  };
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setStatusFilter('ALL');
    } else if (newValue === 1) {
      setStatusFilter('ACTIVE');
    } else if (newValue === 2) {
      setStatusFilter('DEACTIVATED');
    }
  };

  const handleOpenCreate = () => {
    setEditData(null);
    setFormState({
      accountId: accountId,
      schoolId: '',
      classId: '',
      divisionId: '',
      title: '',
      message: '',
      targetType: TargetType.SCHOOL,
      targetValue: '',
      contentType: ContentType.TEXT,
      contentUrl: '',
      fromDate: '',
      toDate: '',
      priority: Priority.LOW,
      notificationType: NotificationType.INFO,
      rollingBanner: false
    });
    setOpenCreateModal(true);
  };

  const handleOpenEdit = (id) => {
    const notificationToEdit = notifications.find(n => n.id === id);
    if (notificationToEdit) {
      setEditData(notificationToEdit);
      setFormState({
        ...notificationToEdit,
        fromDate: notificationToEdit.fromDate ? notificationToEdit.fromDate.split('T')[0] : '',
        toDate: notificationToEdit.toDate ? notificationToEdit.toDate.split('T')[0] : '',
      });
      setOpenCreateModal(true);
    }
  };

  const handleOpenView = (data) => {
    setViewData(data);
  };

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      targetValue: ''
    }));
  };

  const getTargetOptions = () => {
    switch (formState.targetType) {
      case TargetType.SCHOOL:
        return schools.map(s => ({ id: s.id, name: s.name }));
      case TargetType.CLASS:
        return classes.map(c => ({ id: c.id, name: c.name }));
      case TargetType.DIVISION:
        return divisions.map(d => ({ id: d.id, name: d.name }));
      case TargetType.USER_TYPE:
        return ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'].map(type => ({ id: type, name: type }));
      default:
        return [];
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formState.title || formState.title.trim() === '') errors.title = 'Title is required';
    if (!formState.message || formState.message.trim() === '') errors.message = 'Message is required';
    if (!formState.targetType) errors.targetType = 'Target Type is required';
    if (!formState.contentType) errors.contentType = 'Content Type is required';
    if (!formState.fromDate) errors.fromDate = 'Active From date is required';
    if (!formState.toDate) errors.toDate = 'Active To date is required';
    return errors;
  };

  const handleFormSubmit = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const payload = {
      ...formState,
      createdBy: user?.id,
      fromDate: formState.fromDate ? new Date(formState.fromDate).toISOString() : null,
      toDate: formState.toDate ? new Date(formState.toDate).toISOString() : null
    };
    try {
      if (editData) {
        await api.put(`/api/notifications/${editData.id}`, payload);
      } else {
        await api.post('/api/notifications/create', payload);
      }
      setOpenCreateModal(false);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to save notification:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/api/notifications/${id}?accountId=${accountId}`);
        fetchNotifications();
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'targetType', headerName: 'Audience', width: 150, 
      renderCell: (params) => {
        const { row } = params;
        return getTargetName(row.targetType, row.targetValue);
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <Chip label={params.value} color={params.value === 'ACTIVE' ? 'success' : 'error'} size="small" />
    },
    { field: 'fromDate', headerName: 'Active From', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'toDate', headerName: 'Active To', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
  ];

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="info" size="small" onClick={() => handleOpenView(params.row)}>
          <ViewIcon />
        </IconButton>
        {/* {hasPermission(permissions, 'NOTIFICATION', 'edit') && ( */}
            <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
        {/* // )} */}
        {/* {hasPermission(permissions, 'NOTIFICATION', 'delete') && ( */}
            <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
        {/* // )} */}
      </Box>
    )
  };

  return (
    <MainCard
      title="Notifications"
      secondary={
        hasPermission(permissions, 'NOTIFICATION', 'add') && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create New
          </Button>
        )
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
         
          <Box sx={{ height: 600, width: '100%', mt: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col.field}>{col.headerName}</TableCell>
                    ))}
                    <TableCell>{actionColumn.headerName}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isFetchingData ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : notifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center">
                        No notifications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    notifications.map((row) => (
                      <TableRow key={row.id}>
                        {columns.map((col) => (
                          <TableCell key={col.field}>
                            {col.renderCell ? col.renderCell({ value: row[col.field], row }) : (col.valueFormatter ? col.valueFormatter({ value: row[col.field] }) : row[col.field])}
                          </TableCell>
                        ))}
                        <TableCell>{actionColumn.renderCell({ row })}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={totalElements}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                value={formState.title}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="message"
                label="Message"
                value={formState.message}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                error={!!formErrors.message}
                helperText={formErrors.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="targetType"
                label="Target Type"
                value={formState.targetType}
                onChange={handleTargetChange}
                fullWidth
                margin="normal"
                error={!!formErrors.targetType}
                helperText={formErrors.targetType}
              >
                {Object.keys(TargetType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="targetValue"
                label="Target Value"
                value={formState.targetValue}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                disabled={formState.targetType === 'USER_TYPE'}
              >
                {getTargetOptions().map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="contentType"
                label="Content Type"
                value={formState.contentType}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                error={!!formErrors.contentType}
                helperText={formErrors.contentType}
              >
                {Object.keys(ContentType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {formState.contentType !== ContentType.TEXT && (
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contentUrl"
                  label="Content URL"
                  value={formState.contentUrl}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                name="fromDate"
                label="Active From"
                type="date"
                value={formState.fromDate}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.fromDate}
                helperText={formErrors.fromDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="toDate"
                label="Active To"
                type="date"
                value={formState.toDate}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.toDate}
                helperText={formErrors.toDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RadioGroup row name="priority" value={formState.priority} onChange={handleFormChange} sx={{ mt: 2 }}>
                {Object.keys(Priority).map((p) => (
                  <FormControlLabel key={p} value={p} control={<Radio />} label={p} />
                ))}
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RadioGroup row name="notificationType" value={formState.notificationType} onChange={handleFormChange} sx={{ mt: 2 }}>
                {Object.keys(NotificationType).map((nt) => (
                  <FormControlLabel key={nt} value={nt} control={<Radio />} label={nt} />
                ))}
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch name="rollingBanner" checked={formState.rollingBanner} onChange={handleFormChange} />}
                label="Show as Rolling Banner"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!viewData} onClose={() => setViewData(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{viewData?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Audience:</strong> {getTargetName(viewData?.targetType, viewData?.targetValue)}
          </Typography>
          <Typography variant="body1">
            <strong>Content Type:</strong> {viewData?.contentType}
          </Typography>
          {viewData?.contentUrl && (
            <Typography variant="body1">
              <strong>Content URL:</strong> <a href={viewData.contentUrl}>{viewData.contentUrl}</a>
            </Typography>
          )}
          <Typography variant="body1">
            <strong>Active:</strong> {new Date(viewData?.fromDate).toLocaleDateString()} → {new Date(viewData?.toDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Priority:</strong> {viewData?.priority}
          </Typography>
          <Typography variant="body1">
            <strong>Type:</strong> {viewData?.notificationType}
          </Typography>
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
