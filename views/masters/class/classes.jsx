import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'schoolbranchName', headerName: 'School', width: 150, flex: 1 },
    { field: 'instituteName', headerName: 'Institute', width: 150, flex: 1 },
];

const Classes = () => {
    const accountId = userDetails.getAccountId();
    const navigate = useNavigate();
    
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
      
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                                            title="CLASS"

                        entityName="CLASS"
                        fetchUrl={`/api/schoolClasses/getAll/${accountId}`}
                        isPostRequest={true}
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
        // </MainCard>
    );
};

export default Classes;