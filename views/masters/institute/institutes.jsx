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
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 110, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'faxNumber', headerName: 'Fax Number', width: 110, flex: 1 },
    { field: 'code', headerName: 'Code', width: 110, flex: 1 }
];

const Institutes = () => {
    const accountId = userDetails.getAccountId();
    
    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Institutes Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all institutes.
        </Typography>
      </Box>
    );

    return (
        <MainCard
            title="Manage Institutes"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/institute/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/institutes/getAll/${accountId}`}
                        isPostRequest={true}
                        columns={columns}
                        editUrl="/masters/institute/edit"
                        deleteUrl="/api/institutes/delete"
                        entityName="INSTITUTE"
                        enableFilters={true}
                        showSchoolFilter={false}
                        showClassFilter={false}
                        showDivisionFilter={false}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Institutes;