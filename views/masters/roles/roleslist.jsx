import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// =======
// import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
// <<<<<<< HEAD
// import { userDetails } from '../../../utils/apiService';
// import api from '../../../utils/apiService';
import api, { userDetails } from '../../../utils/apiService';
import MainCard from 'ui-component/cards/MainCard';
// import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { gridSpacing } from 'store/constant';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Role Name', width: 200, flex: 1 }
];

const RolesList = () => {
    const accountId = userDetails.getAccountId();
    const [allRoles, setAllRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllRoles = async () => {
            setLoading(true);
            try {
                const response = await api.post(`/api/roles/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
                setAllRoles(response.data.content || []);
                setFilteredRoles(response.data.content || []);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                setAllRoles([]);
                setFilteredRoles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllRoles();
    }, [accountId]);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = allRoles;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(role => role.schoolId == newFilters.schoolId);
        }
        setFilteredRoles(tempFiltered);
    }, [allRoles]);

    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Roles Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all roles, with filtering capabilities.
        </Typography>
      </Box>
    );

// <<<<<<< HEAD
    return (
      <MainCard>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <ReusableDataGrid
              title="Manage Roles"
              data={filteredRoles}
              loading={loading}
              onFiltersChange={handleFilterChange}
              fetchUrl={null}
              isPostRequest={false}
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