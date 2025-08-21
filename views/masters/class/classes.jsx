import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    { field: 'schoolbranchName', headerName: 'School', width: 150, flex: 1 },
    { field: 'instituteName', headerName: 'Institute', width: 150, flex: 1 },
];

const Classes = () => {
    const accountId = userDetails.getAccountId();
    const navigate = useNavigate();
    const [allClasses, setAllClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAllClasses = async () => {
            setLoading(true);
            try {
                const response = await api.post(`/api/schoolClasses/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
                setAllClasses(response.data.content || []);
                setFilteredClasses(response.data.content || []);
            } catch (error) {
                console.error('Failed to fetch classes:', error);
                setAllClasses([]);
                setFilteredClasses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllClasses();
    }, [accountId]);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = allClasses;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(cls => cls.schoolbranchId == newFilters.schoolId);
        }
        setFilteredClasses(tempFiltered);
    }, [allClasses]);

    const customActions = [
      {
        icon: <span>👁️</span>,
        label: 'View Class',
        tooltip: 'View class details',
        color: 'info',
        onClick: (row) => {
          navigate(`/masters/class/view/${row.id}`);
        }
      },
      {
        icon: <span>📝</span>,
        label: 'Edit Class',
        tooltip: 'Edit class details',
        color: 'primary',
        onClick: (row) => {
          navigate(`/masters/class/edit/${row.id}`);
        }
      },
      {
        icon: <span>👥</span>,
        label: 'View Students',
        tooltip: 'View students in this class',
        color: 'secondary',
        onClick: (row) => {
          navigate(`/masters/students?classId=${row.id}`);
        }
      },
      {
        icon: <span>📚</span>,
        label: 'View Subjects',
        tooltip: 'View subjects for this class',
        color: 'info',
        onClick: (row) => {
          navigate(`/masters/subjects?classId=${row.id}`);
        }
      }
    ];

    const transformClassData = (cls) => ({
      ...cls,
      isActive: cls.isActive ? 'Active' : 'Inactive',
      createdAt: cls.createdAt ? new Date(cls.createdAt).toLocaleDateString() : 'N/A',
      schoolName: cls.school?.name || 'N/A'
    });

    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Classes Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all classes, with filtering by school.
        </Typography>
      </Box>
    );

    return (
        <MainCard
            title="Manage Classes"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/class/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        entityName="CLASS"
                        data={filteredClasses}
                        loading={loading}
                        onFiltersChange={handleFilterChange}
                        fetchUrl={null}
                        isPostRequest={false}
                        columns={columns}
                        editUrl="/masters/class/edit"
                        deleteUrl="/api/schoolClasses/delete"
                        addActionUrl="/masters/class/add"
                        // customActions={customActions}
                        transformData={transformClassData}
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

export default Classes;