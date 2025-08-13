import React from 'react';

// material-ui
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';

// Define the columns specifically for the Institutes data grid.
// The 'actions' column will be added automatically by the ReusableDataGrid.
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 110, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'faxNumber', headerName: 'Fax Number', width: 110, flex: 1 },
    { field: 'code', headerName: 'Code', width: 110, flex: 1 }
];

// ==============================|| SIMPLIFIED INSTITUTES LIST ||============================== //

const Institutes = () => {
    const accountId = userDetails.getAccountId();

    return (
        <MainCard
            title="Manage Institutes"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/institute/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/institutes/getAll/${accountId}`}
                        columns={columns}
                        editUrl="/masters/institute/edit"
                        deleteUrl="/api/institutes/delete"
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Institutes;
