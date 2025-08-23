import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-hot-toast';
import api, { userDetails } from 'utils/apiService';
import ListGridFilters from 'ui-component/ListGridFilters';

const StudentExamList = () => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [filters, setFilters] = useState({ schoolId: '', classId: '', divisionId: '' });

    const fetchExams = useCallback(async () => {
        if (!accountId) return;
        setLoading(true);
        try {
            const payload = {
                page: paginationModel.page,
                size: paginationModel.pageSize,
                sortBy: 'id',
                sortDir: 'asc',
                ...filters
            };
            const response = await api.post(`/api/exams/getAllBy/${accountId}`, payload);
            const content = response?.data?.content || response?.data || [];
            setExams(content);
            setRowCount(response?.data?.totalElements || content.length || 0);
        } catch (error) {
            console.error('Failed to load exams:', error);
            toast.error('Could not load exams.');
            setExams([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    }, [accountId, paginationModel.page, paginationModel.pageSize, JSON.stringify(filters)]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const columns = [
        { field: 'examName', headerName: 'Exam Name', flex: 1 },
        { field: 'className', headerName: 'Class', flex: 1 },
        { field: 'divisionName', headerName: 'Division', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
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

    return (
        <MainCard title="Available Exams">
            <Box sx={{ mb: 2 }}>
                <ListGridFilters
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                        setFilters(newFilters);
                        setPaginationModel((prev) => ({ ...prev, page: 0 }));
                    }}
                    showSchool
                    showClass
                    showDivision
                />
            </Box>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={exams}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    paginationMode="server"
                    rowCount={rowCount}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25, 50]}
                />
            </Box>
        </MainCard>
    );
};

export default StudentExamList;