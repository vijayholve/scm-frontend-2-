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
    { field: 'subjectCode', headerName: 'Subject Code', width: 150, flex: 1 }
];

const Subjects = () => {
    const accountId = userDetails.getAccountId();
    const [allSubjects, setAllSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAllSubjects = async () => {
            setLoading(true);
            try {
                const response = await api.post(`/api/subjects/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
                setAllSubjects(response.data.content || []);
                setFilteredSubjects(response.data.content || []);
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
                setAllSubjects([]);
                setFilteredSubjects([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllSubjects();
    }, [accountId]);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = allSubjects;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(subject => subject.schoolId == newFilters.schoolId);
        }
        if (newFilters.classId) {
            tempFiltered = tempFiltered.filter(subject => subject.classId == newFilters.classId);
        }
        setFilteredSubjects(tempFiltered);
    }, [allSubjects]);

    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Subjects Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all subjects, with filtering capabilities.
        </Typography>
      </Box>
    );

    return (
        <MainCard
            title="Manage Subjects"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/subject/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        data={filteredSubjects}
                        loading={loading}
                        // onFiltersChange={handleFilterChange}
                        fetchUrl={null}
                        isPostRequest={false}
                        columns={columns}
                        editUrl="/masters/subject/edit"
                        deleteUrl="/api/subjects/delete"
                        entityName="SUBJECT"
                        // enableFilters={true}
                        // showSchoolFilter={true}
                        // showClassFilter={true}
                        showDivisionFilter={false}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Subjects;