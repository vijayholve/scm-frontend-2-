import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

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
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Schools Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all schools.
        </Typography>
      </Box>
    );

    return (
     
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid 
                        title="SCHOOLS" 
                        fetchUrl={`/api/schoolBranches/getAll/${accountId}`}
                        isPostRequest={true}
                        
                        // data={schools}
                        loading={loading}

                        
                        addActionUrl={"/masters/school/add"}
                        // fetchUrl={null} // Explicitly set to null to indicate client-side mode
                        columns={columns}
                        editUrl="/masters/school/edit"
                        deleteUrl='/api/schoolBranches/delete'
                        entityName="SCHOOL"
                        enableFilters={false}
                    />
                </Grid>
            </Grid>
    );
};

export default Schools;