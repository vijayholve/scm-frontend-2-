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

// Define the columns specifically for the Student Parents data grid.
// The 'actions' column will be added automatically by the ReusableDataGrid.
const columns = [
    { field: 'rollno', headerName: 'Roll No', width: 90 },
    { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
    { field: 'address', headerName: 'Address', width: 110, flex: 1 }
];

// ==============================|| SIMPLIFIED STUDENT PARENTS LIST ||============================== //

const StudentParents = () => {
    const accountId = userDetails.getAccountId();

    return (
        <MainCard
            title="Manage Student Parents"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/studentParents/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/users/getAll/${accountId}?type=STUDENTPARENT`}
                        columns={columns}
                        editUrl="/masters/studentParents/edit"
                        deleteUrl="/api/users/delete"
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default StudentParents;
