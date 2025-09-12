// src/views/masters/profile/StudentFeeDetails.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';

const StudentFeeDetails = ({ studentId }) => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!studentId) return;

        const fetchFeeData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/student/fees/${studentId}`);
                setFees(response?.data?.feeStatus || []);
            } catch (err) {
                console.error('Error fetching fee data:', err);
                setError('Failed to load fee data.');
                setFees([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeData();
    }, [studentId]);

    if (loading) {
        return (
            <MainCard title="Fee Details">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="Fee Details">
                <Alert severity="error">{error}</Alert>
            </MainCard>
        );
    }

    if (fees.length === 0) {
        return (
            <MainCard title="Fee Details">
                <Typography variant="body1" align="center" color="text.secondary">
                    No fees found for this student.
                </Typography>
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
        <MainCard title="Fee Details">
            <Grid container spacing={2}>
                {fees.map((fee) => (
                    <Grid item xs={12} key={fee.feeId}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{fee.feeTitle}</Typography>
                                <Typography variant="body2">Total Amount: {formatCurrency(fee.totalAmount)}</Typography>
                                <Typography variant="body2">Paid Amount: {formatCurrency(fee.paidAmount)}</Typography>
                                <Typography variant="body2" color="error">Pending Amount: {formatCurrency(fee.remaining)}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </MainCard>
    );
};

export default StudentFeeDetails;