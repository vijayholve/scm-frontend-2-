import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
import ReusableBarChart from 'ui-component/charts/ReusableBarChart';
import { useTheme } from '@mui/material/styles';

// Dummy data to be used instead of an API call
const dummyAssignmentData = [
    {
        "assignmentName": "Maths Homework",
        "completedCount": 20,
        "pendingCount": 10
    },
    {
        "assignmentName": "Science Project",
        "completedCount": 15,
        "pendingCount": 15
    },
    {
        "assignmentName": "History Essay",
        "completedCount": 28,
        "pendingCount": 2
    }
];

const TeacherAssignmentChart = () => {
    const theme = useTheme();
    const { user } = useSelector((state) => state.user);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignmentData = async () => {
            if (!user?.id) {
                setError('User ID not available.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Commenting out the API call as requested and using dummy data instead.
                // const response = await api.get(`/api/assignments/completion-status/teacher/${user.id}`);
                // const data = response.data || [];

                const data = dummyAssignmentData;
                
                if (data.length === 0) {
                    setChartData(null);
                    return;
                }

                const assignmentNames = data.map(item => item.assignmentName);
                const completedData = data.map(item => item.completedCount);
                const pendingData = data.map(item => item.pendingCount);

                setChartData({
                    series: [
                        { name: 'Completed', data: completedData },
                        { name: 'Pending', data: pendingData }
                    ],
                    categories: assignmentNames
                });

            } catch (err) {
                console.error("Error fetching assignment data:", err);
                setError('Failed to load assignment data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, [user]);

    if (loading) {
        return (
            <MainCard title="Assignment Status">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="Assignment Status">
                <Alert severity="error">{error}</Alert>
            </MainCard>
        );
    }
    
    if (!chartData) {
        return (
            <MainCard title="Assignment Status">
                <Typography variant="body1" align="center" color="text.secondary">
                    No assignment data found.
                </Typography>
            </MainCard>
        );
    }

    return (
        <ReusableBarChart
            title="Assignment Submission Status"
            series={chartData.series}
            xAxisCategories={chartData.categories}
            yAxisTitle="Number of Submissions"
            height={350}
            chartId="assignment-status-chart"
            colors={[theme.palette.success.main, theme.palette.warning.main]}
            plotOptions={{
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    stacked: true
                }
            }}
        />
    );
};

export default TeacherAssignmentChart;
