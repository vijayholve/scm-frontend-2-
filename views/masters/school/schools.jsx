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

// Define the columns specifically for the Schools data grid.
// The 'actions' column will be added automatically by the ReusableDataGrid.
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

// ==============================|| SIMPLIFIED SCHOOLS LIST ||============================== //

const Schools = () => {
    const accountId = userDetails.getAccountId();

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
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Schools;
