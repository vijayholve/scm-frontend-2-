import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, TextField } from '@mui/material';
import BackofficeDataGrid from './BackofficeDataGrid';
import { api } from 'utils/apiService';
import endpoints from 'api/endpoints';
import { gridSpacing } from 'store/constant';

const AccountFilterDataGrid = ({
  title,
  fetchUrlTemplate, // Template for fetch URL, e.g., `api/features/getAllByAccountId/{accountId}`
  columns,
  defaultAccountId = 10, // Default account ID
  ...props
}) => {
  const [accountId, setAccountId] = useState(defaultAccountId); // Selected account ID
  const [accountList, setAccountList] = useState([]); // List of accounts for dropdown

  // Fetch list of accounts for the dropdown
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get(endpoints.accounts.getAll); // Replace with the correct endpoint
        setAccountList(response.data || []);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  // Handle accountId change
  const handleAccountChange = (event) => {
    setAccountId(event.target.value);
  };

  return (
    <Box>
      {/* Account ID Filter */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField select label="Select Account ID" value={accountId} onChange={handleAccountChange} fullWidth variant="outlined">
          {accountList.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name} (ID: {account.id})
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Data Grid */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <BackofficeDataGrid
            title={title}
            fetchUrl={fetchUrlTemplate.replace('{accountId}', accountId)} // Replace accountId in the URL template
            columns={columns}
            {...props} // Pass additional props to BackofficeDataGrid
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountFilterDataGrid;
