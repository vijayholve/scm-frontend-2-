import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import api, { userDetails } from '../../../utils/apiService';
import MainCard from 'ui-component/cards/MainCard';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Role Name', width: 200, flex: 1 }
];

const RolesList = () => {
    const accountId = userDetails.getAccountId();
    
    return (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <ReusableDataGrid
              title="Manage Roles"
              fetchUrl={`/api/roles/getAll/${accountId}`}
              isPostRequest={true}
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
    );
};

export default RolesList;