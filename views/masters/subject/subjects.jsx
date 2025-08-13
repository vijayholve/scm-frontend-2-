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

// Define the columns specifically for the Subjects data grid.
// The 'actions' column will be added automatically by the ReusableDataGrid.
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'subjectCode', headerName: 'Subject Code', width: 150, flex: 1 }
];

// ==============================|| SIMPLIFIED SUBJECTS LIST ||============================== //

const Subjects = () => {
    const accountId = userDetails.getAccountId();

    return (
        <MainCard
            title="Manage Subjects"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/subject/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        fetchUrl={`/api/subjects/getAll/${accountId}`}
                        columns={columns}
                        editUrl="/masters/subject/edit"
                        deleteUrl="/api/subjects/delete"
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Subjects;
