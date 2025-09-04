import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Divider, CircularProgress, Chip, Stack } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';
import api from 'utils/apiService';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from 'utils/apiService';
import { Visibility as ViewIcon } from '@mui/icons-material';

const FeeDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feeDetails, setFeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = userDetails.getUser();
    const columns = [
        { field: 'studentId', headerName: 'Student ID', width: 120 },
        { field: 'studentName', headerName: 'Name', flex: 1 },
        { field: 'className', headerName: 'Class', width: 120 },
        { field: 'divisionName', headerName: 'Division', width: 120 },
        { field: 'rollNumber', headerName: 'Roll No.', width: 100 },
        { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (params) => { formatCurrency(params?.value) } },
        { field: 'paidAmount', headerName: 'Paid', width: 120, valueFormatter: (params) => { formatCurrency(params?.value) } },
        { field: 'pendingAmount', headerName: 'Pending', width: 120, valueFormatter: (params) => { formatCurrency(params?.value) } },
        {
            field: 'status', headerName: 'Status', width: 120, renderCell: (params) => (
                <Chip label={params.value} color={params.value === 'PAID' ? 'success' : params.value === 'PARTIAL' ? 'warning' : 'error'} size="small" />
            )
        },
    ];

    useEffect(() => {
        const fetchFeeDetails = async () => {
            try {
                const response = await api.get(`/api/fee-structure/summary/${id}`);
                setFeeDetails(response.data);
            } catch (err) {
                console.error('Failed to fetch fee details:', err);
                setError('Failed to load fee details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFeeDetails();
        } else {
            setError('No fee ID provided.');
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <MainCard title="Loading Fee Details">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="Error">
                <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <BackButton backUrl="/masters/fees" />
                </Box>
            </MainCard>
        );
    }

    if (!feeDetails) {
        return (
            <MainCard title="Fee Not Found">
                <Typography sx={{ p: 2 }}>
                    The fee you are looking for does not exist.
                </Typography>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <BackButton backUrl="/masters/fees" />
                </Box>
            </MainCard>
        );
    }

    const formatCurrency = (amount) => {
        console.log(amount);
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0);
    };

    return (
        <MainCard title={`Fee Details: ${feeDetails.feeName}`}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>
                            {feeDetails.feeName}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle1">
                                <strong>School:</strong> <Chip label={feeDetails.schoolName || 'N/A'} color="primary" />
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Class:</strong> <Chip label={feeDetails.className || 'N/A'} color="secondary" />
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Division:</strong> <Chip label={feeDetails.divisionName || 'N/A'} color="info" />
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Year:</strong> {feeDetails.year || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Total Students:</strong><Chip label={feeDetails.totalStudents || 'N/A'} color="info" />
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Pending Students:</strong> <Chip label={feeDetails.studentsPending || 'N/A'} color="info" />
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Paid Students:</strong> <Chip label={feeDetails.studentsCompleted || 'N/A'} color="info" />
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle1">
                                <strong>Amount:</strong> {formatCurrency(feeDetails.totalAmount)}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Paid:</strong> {formatCurrency(feeDetails.paidAmount || 0)}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Due:</strong> {formatCurrency(feeDetails.pendingAmount || 0)}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Due Date:</strong> {new Date(feeDetails.dueDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Status:</strong> <Chip label={feeDetails.status || 'N/A'} color="success" />
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Other Details
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">
                            <strong>Discount:</strong> {formatCurrency(feeDetails.discount || 0)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">
                            <strong>Late Fee per Day:</strong> {formatCurrency(feeDetails.lateFinePerDay || 0)}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <BackButton backUrl="/masters/fees" />
            </Box>

            {/* Student Fee Details Grid */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Students in this Fee Structure
                </Typography>
                <ReusableDataGrid
                
                    title="Student Fee Details"
                    fetchUrl={`/api/student-fee/getByFeeStructureId/${user?.accountId}/${feeDetails.id}`}
                    columns={columns}
                    entityName="STUDENT_FEE"
                    requestMethod="POST"
                    enableFilters={true}
                    showSchoolFilter={true}
                    showClassFilter={true}
                    showDivisionFilter={true}
                    filters={{
                        schoolId: user?.schoolId,
                        classId: user?.classId,
                        divisionId: user?.divisionId,
                        feeStructureId: feeDetails.id
                    }}
                    getRowId={(row) => row.studentFeeId || row.id || row.studentId}
                    transformData={resp => resp}
                    customActions={[
                        {
                            label: 'View Fee',
                            tooltip: 'View student fee in new tab',
                            color: 'info',
                            icon: <ViewIcon />,
                            onClick: (row) => {
                                const targetStudentId = row?.studentId || row?.id;
                                if (targetStudentId) {
                                    window.open(`/masters/student/fees/${targetStudentId}` , '_blank', 'noopener');
                                }
                            }
                        }
                    ]}
                />
            </Box>


        </MainCard>
    );
};

export default FeeDetailView;