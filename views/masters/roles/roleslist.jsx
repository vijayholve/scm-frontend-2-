import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Role Name', width: 200, flex: 1 }
];

const RolesList = () => {
    const accountId = userDetails.getAccountId();
    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Roles Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all roles, with filtering capabilities.
        </Typography>
      </Box>
    );

    return (
      <MainCard

      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <ReusableDataGrid
              title="Manage Roles"
              fetchUrl={`/api/roles/getAll/${accountId}`}
              columns={columns}
              addActionUrl="/masters/role/add"
              editUrl="/masters/role/edit"
              deleteUrl="/api/roles/delete"
              entityName="ROLE"
              enableFilters={true}
              showSchoolFilter={true}
              showClassFilter={false}
              showDivisionFilter={false}
            />
          </Grid>
        </Grid>
      </MainCard>
    );
};

export default RolesList;