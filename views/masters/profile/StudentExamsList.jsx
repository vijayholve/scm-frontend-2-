// src/views/masters/profile/StudentExamsList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';
import { useSelector } from 'react-redux';

const StudentExamsList = ({ studentId }) => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user.user);

    const columns = [
        { field: 'examName', headerName: 'Exam Name', flex: 1 },
        { field: 'className', headerName: 'Class', width: 150 },
        { field: 'divisionName', headerName: 'Division', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate(`/masters/exams/student/result/${params.row.id}`)}
                >
                    View Result
                </Button>
            ),
        },
    ];

    const fetchExams = useCallback(async () => {
        if (!accountId || !studentId) {
            setError('Account or student ID not available.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { id: studentId, accountId, schoolId, classId, divisionId } = user;

        if (!accountId || !studentId || !schoolId || !classId || !divisionId) {
            setError('User profile details are incomplete. Cannot fetch exams.');
            setLoading(false);
            return;
        }
            const payload = {
                page: 0,
                size: 1000,
                sortBy: 'id',
                sortDir: 'asc',
                  schoolId: schoolId,
                classId: classId,
                divisionId: divisionId
            };
            const response = await api.post(`/api/exams/getAllBy/${accountId}`, payload);
            setExams(response.data.content || []);
        } catch (err) {
            console.error('Failed to fetch exams:', err);
            setError('Failed to load exams.');
        } finally {
            setLoading(false);
        }
    }, [accountId, studentId]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    if (loading) {
        return (
            <MainCard title="My Exams">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="My Exams">
                <Alert severity="error">{error}</Alert>
            </MainCard>
        );
    }

    return (
        <MainCard title="My Exams">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={exams}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                    }}
                />
            </Box>
        </MainCard>
    );
};

export default StudentExamsList;