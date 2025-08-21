import React, { useState, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx'; 
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'schoolbranchName', headerName: 'School', width: 150, flex: 1 },
    { field: 'instituteName', headerName: 'Institute', width: 150, flex: 1 },
];

const Devision = () => {
    const accountId = userDetails.getAccountId();
    const [allDivisions, setAllDivisions] = useState([]);
    const [filteredDivisions, setFilteredDivisions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAllDivisions = async () => {
            setLoading(true);
            try {
                const response = await api.post(`/api/divisions/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
                setAllDivisions(response.data.content || []);
                setFilteredDivisions(response.data.content || []);
            } catch (error) {
                console.error('Failed to fetch divisions:', error);
                setAllDivisions([]);
                setFilteredDivisions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllDivisions();
    }, [accountId]);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = allDivisions;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(division => division.schoolbranchId == newFilters.schoolId);
        }
        if (newFilters.classId) {
            tempFiltered = tempFiltered.filter(division => division.classId == newFilters.classId);
        }
        setFilteredDivisions(tempFiltered);
    }, [allDivisions]);

    return (
        <MainCard
        title="Manage Divisions"
        secondary={<SecondaryAction icon={<AddIcon />} link="/masters/division/add" />}
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <ReusableDataGrid
              entityName="DIVISION"
              data={filteredDivisions}
              loading={loading}
              // onFiltersChange={handleFilterChange}
              fetchUrl={null}
              isPostRequest={false}
              columns={columns}
              editUrl="/masters/division/edit"
              deleteUrl="/api/devisions/delete"
              enableFilters={true}
              // showSchoolFilter={true}
              // showClassFilter={true}
              // showDivisionFilter={false}
            />
          </Grid>
        </Grid>
      </MainCard>
    );
};

export default Devision;