import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Chip, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';
import { hasPermission } from 'utils/permissionUtils.js';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 200, editable: false },
    { field: 'description', headerName: 'Description', width: 250, editable: false },
    {
        field: 'questions',
        headerName: 'Questions',
        width: 120,
        editable: false,
        renderCell: (params) => <Chip label={params.value?.length || 0} color="primary" variant="outlined" size="small" />
    },
    {
        field: 'startTime',
        headerName: 'Start Time',
        width: 180,
        editable: false,
        renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '-')
    },
    {
        field: 'endTime',
        headerName: 'End Time',
        width: 180,
        editable: false,
        renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '-')
    },
    {
        field: 'showScoreAfterSubmission',
        headerName: 'Show Score',
        width: 120,
        editable: false,
        renderCell: (params) => <Chip label={params.value ? 'Yes' : 'No'} color={params.value ? 'success' : 'default'} size="small" />
    }
];

const QuizList = () => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllQuizzes = async () => {
            setLoading(true);
            try {
                const response = await api.post(`/api/quizzes/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' });
                setAllQuizzes(response.data.content || []);
                setFilteredQuizzes(response.data.content || []);
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
                setAllQuizzes([]);
                setFilteredQuizzes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllQuizzes();
    }, [accountId]);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = allQuizzes;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(quiz => quiz.schoolId == newFilters.schoolId);
        }
        if (newFilters.classId) {
            tempFiltered = tempFiltered.filter(quiz => quiz.classId == newFilters.classId);
        }
        if (newFilters.divisionId) {
            tempFiltered = tempFiltered.filter(quiz => quiz.divisionId == newFilters.divisionId);
        }
        setFilteredQuizzes(tempFiltered);
    }, [allQuizzes]);
    
    const customActions = [
        {
            icon: <PlayArrowIcon />,
            label: 'Preview Quiz',
            tooltip: 'Preview the quiz questions and details',
            color: 'secondary',
            onClick: (row) => {
                navigate(`/masters/quiz/dashboard/${row.id}`);
            },
            permission: 'view'
        },
        {
            icon: <EditOutlinedIcon />,
            label: 'Edit',
            tooltip: 'Edit Quiz',
            color: 'primary',
            onClick: (row) => {
                navigate(`/masters/quiz/edit/${row.id}`);
            },
            permission: 'edit'
        },
        {
            icon: <DeleteIcon />,
            label: 'Delete',
            tooltip: 'Delete Quiz',
            color: 'error',
            onClick: (row) => {
                if (window.confirm('Are you sure you want to delete this quiz?')) {
                    // Logic for deletion will be handled by ReusableDataGrid
                }
            },
            permission: 'delete'
        }
    ];

    const customToolbar = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Quizzes Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          This grid shows all quizzes, with filtering capabilities.
        </Typography>
      </Box>
    );

    return (
        <MainCard
            title="Quizzes"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/quiz/add" />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        data={filteredQuizzes}
                        loading={loading}
                        onFiltersChange={handleFilterChange}
                        fetchUrl={null}
                        isPostRequest={false}
                        columns={columns}
                        addActionUrl="/masters/quiz/add"
                        editUrl="/masters/quiz/edit"
                        deleteUrl="/api/quiz/delete"
                        entityName="QUIZ"
                        customActions={customActions}
                        enableFilters={true}
                        showSchoolFilter={true}
                        showClassFilter={true}
                        showDivisionFilter={true}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default QuizList;