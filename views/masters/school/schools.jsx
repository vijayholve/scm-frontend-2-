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
    { field: 'address', headerName: 'Address', width: 150, flex: 1 },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 110, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'faxNumber', headerName: 'Fax Number', width: 110, flex: 1 },
    { field: 'code', headerName: 'Code', width: 110, flex: 1 },
    { field: 'instituteId', headerName: 'Institute Id', width: 110, flex: 1 }
];

const Schools = () => {
    const accountId = userDetails.getAccountId();
    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Schools Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all schools, with filtering capabilities.
        </Typography>
      </Box>
    );

    return (
        <MainCard
            title="Manage Schools"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/school/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/schoolBranches/getAll/${accountId}`}
                        columns={columns}
                        editUrl="/masters/school/edit"
                        deleteUrl="/api/schoolBranches/delete"
                        entityName="SCHOOL"
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

export default Schools;