import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Divider, CircularProgress, Chip } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';
import api from 'utils/apiService';

const FeeDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feeDetails, setFeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeeDetails = async () => {
            try {
                const response = await api.get(`/api/admin/fees/getById/${id}`);
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
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle1">
                                <strong>Amount:</strong> {formatCurrency(feeDetails.totalAmount)}
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
        </MainCard>
    );
};

export default FeeDetailView;