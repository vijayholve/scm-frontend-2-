// src/views/masters/notifications/NotificationList.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Box, Typography, Button, Chip, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

const NotificationList = ({ notifications, onDelete }) => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);

  const handleOpenEdit = (id) => {
    navigate(`/masters/notifications/edit/${id}`);
  };

  const handleOpenView = (id) => {
    navigate(`/masters/notifications/view/${id}`);
  };

  return (
    <MainCard
      title="Notifications"
      secondary={
        hasPermission(permissions, 'NOTIFICATION', 'add') && (
          <SecondaryAction
            icon={<AddIcon />}
            link="/masters/notifications/add"
            title="Create New Notification"
          />
        )
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Audience</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Active From</TableCell>
                  <TableCell>Active To</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.audience}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === 'Active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.activeFrom}</TableCell>
                    <TableCell>{row.activeTo}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => handleOpenView(row.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                        {hasPermission(permissions, 'NOTIFICATION', 'edit') && (
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEdit(row.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {hasPermission(permissions, 'NOTIFICATION', 'delete') && (
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => onDelete(row.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default NotificationList;