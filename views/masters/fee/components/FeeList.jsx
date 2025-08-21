import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from 'utils/apiService';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
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

const FeeList = ({ selectedSchool, selectedClass, selectedDivision }) => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
  const permissions = useSelector((state) => state.user.permissions);

  const filters = {
    schoolId: selectedSchool,
    classId: selectedClass,
    divisionId: selectedDivision,
  };
  
  const transformData = (apiResponse) => {
    return apiResponse.fees || [];
  };

  return (
    <ReusableDataGrid
      title="Fee Summary"
      fetchUrl={`/api/admin/fees/summary/${accountId}`}
      columns={columns}
      addActionUrl="/masters/fee/add"
      editUrl="/masters/fee/edit"
      deleteUrl="/api/admin/fees/delete"
      entityName="FEE_MANAGEMENT"
      isPostRequest={false} 
      showSearch={true}
      showRefresh={true}
      showFilters={true}
      pageSizeOptions={[10, 25, 50]}
      defaultPageSize={10}
      height={600}
      filters={filters}
      transformData={transformData}
      secondary={hasPermission(permissions, 'FEE_MANAGEMENT', 'add') && (
        <SecondaryAction icon={<AddIcon />} link="/masters/fee/add" />
      )}
    />
  );
};

export default FeeList;