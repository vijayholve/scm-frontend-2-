import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, TextField } from '@mui/material';
import BackOfficeSidebar from 'components/BackOfficeSidebar';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { gridSpacing } from 'store/constant';
// import api, { userDetails } from 'utils/apiService';
// import endpoints from 'api/endpoints';

// Columns for Features
const columnsConfig = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Feature Name', flex: 1, minWidth: 180 },
  { field: 'accountId', headerName: 'Account ID', width: 130 },
  { field: 'createdBy', headerName: 'Created By', width: 160 },
//   { field: 'isActive', headerName: 'Status', width: 120 },
//   { field: 'createdAt', headerName: 'Created Date', width: 150 }
];

// ==============================|| FEATURES LIST PAGE ||============================== //

const Institute = () => {
  const [accountId, setAccountId] = useState(10); // Default accountId
  const [accountList, setAccountList] = useState([]);
  const [fetchUrl, setFetchUrl] = useState(`/api/institutes/getAll/${accountId}`);

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
    setFetchUrl(`api/instituteBranches/getAll/${accountId}`);
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
              title={`Institute (Account ${accountId})`}
              fetchUrl={fetchUrl}
              columns={columnsConfig}
              entityName="INSTITUTE"
              isPostRequest={true} 
                editUrl="/masters/institute/edit"
                        deleteUrl='/api/institute/delete'
              showSearch
              showRefresh
              showFilters={false}
              pageSizeOptions={[5, 10, 25]}
              defaultPageSize={10}
              height={600}
              transformData={transformFeatureData}
              enableFilters={false}
              ShowMainLayout={false}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Institute;
