import React, { useState, useEffect, useCallback } from 'react';
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
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 110, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'faxNumber', headerName: 'Fax Number', width: 110, flex: 1 },
    { field: 'code', headerName: 'Code', width: 110, flex: 1 }
];

const Institutes = () => {
    const accountId = userDetails.getAccountId();
    const [allInstitutes, setAllInstitutes] = useState([]);
    const [filteredInstitutes, setFilteredInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllInstitutes = async () => {
            setLoading(true);
            try {
                const response = await api.post(`/api/institutes/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
                setAllInstitutes(response.data.content || []);
                setFilteredInstitutes(response.data.content || []);
            } catch (error) {
                console.error('Failed to fetch institutes:', error);
                setAllInstitutes([]);
                setFilteredInstitutes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllInstitutes();
    }, [accountId]);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = allInstitutes;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(institute => institute.schoolId == newFilters.schoolId);
        }
        setFilteredInstitutes(tempFiltered);
    }, [allInstitutes]);

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
                        data={filteredInstitutes}
                        loading={loading}
                        onFiltersChange={handleFilterChange}
                        fetchUrl={null}
                        isPostRequest={false}
                        columns={columns}
                        editUrl="/masters/institute/edit"
                        deleteUrl="/api/institutes/delete"
                        entityName="INSTITUTE"
                        // enableFilters={true}
                        // showSchoolFilter={true}
                        showClassFilter={false}
                        showDivisionFilter={false}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Institutes;