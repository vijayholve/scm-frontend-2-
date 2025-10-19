import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';
import BackOfficeSidebar from 'components/BackOfficeSidebar';

const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
  { field: 'email', headerName: 'Email', width: 110, flex: 1 },
  { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 }
  // { field: 'address', headerName: 'Address', width: 110, flex: 1 }
];

const Admins = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();
const [fetchUrl, setFetchUrl] = useState(`/api/users/getAll/${accountId}`);
  const [accountList, setAccountList] = useState([]);


  // Fetch list of accounts (replace stub with real API when available)
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // const res = await api.post(endpoints.accounts.getAll, { page:0,size:1000,sortBy:'id',sortDir:'asc' });
        // setAccountList(res.data.content || []);
        setAccountList([{ id: 10 }, { id: 11 }, { id: 12 }, { id: 1 }]); // stub
      } catch (e) {
        console.error('Failed to fetch accounts', e);
      }
    };
    fetchAccounts();
  }, []);

  // Update fetch URL whenever account changes
  useEffect(() => {
    setFetchUrl(`api/userBranches/getAll/${accountId}`);
  }, [accountId]);

  const handleAccountChange = (e) => setAccountId(e.target.value);

  const transformFeatureData = (row) => ({
    ...row,
    isActive: row.isActive ? 'Active' : 'Inactive',
    createdAt: row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'
  });

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <BackOfficeSidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            {/* Account ID Filter */}
            <TextField select label="Select Account ID" value={accountId} onChange={handleAccountChange} fullWidth size="small">
              {accountList.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  Account {acc.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <ReusableDataGrid
              key={accountId}
              title={`User (Account ${accountId})`}
              fetchUrl={fetchUrl}
          isPostRequest={true}
          columns={columnsConfig}
          editUrl="/masters/admin/edit"
          deleteUrl="/api/users/delete"
          addActionUrl="/masters/admin/add"
          viewUrl="/masters/admins/view"
          entityName="ADMIN"
          searchPlaceholder="Search admins by name, email, or username..."
          showSearch={true}
          showRefresh={true}
          showFilters={true}
          pageSizeOptions={[5, 10, 25, 50]}
          defaultPageSize={10}
          height={600}
          enableFilters={true}
          showSchoolFilter={true}
          showClassFilter={false}
          showDivisionFilter={false}
        />
      </Grid>
    </Grid>
    </Box>
    </Box>
  );
};

export default Admins;
