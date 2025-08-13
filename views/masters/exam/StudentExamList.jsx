import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-hot-toast';

const dummyExams = [
    { id: 1, examName: 'Mid-Term Mathematics Exam', className: 'Class 10', divisionName: 'A', isEnrolled: false },
    { id: 2, examName: 'Final Science Practical', className: 'Class 10', divisionName: 'A', isEnrolled: true },
    { id: 3, examName: 'History Unit Test', className: 'Class 10', divisionName: 'A', isEnrolled: false },
];

const StudentExamList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setExams(dummyExams);
        setLoading(false);
    }, []);

    const handleEnroll = (examId) => {
        toast.success(`Successfully enrolled in exam ID: ${examId}!`);
        setExams(prevExams => 
            prevExams.map(exam => 
                exam.id === examId ? { ...exam, isEnrolled: true } : exam
            )
        );
    };

    const columns = [
        { field: 'examName', headerName: 'Exam Name', flex: 1 },
        { field: 'className', headerName: 'Class', flex: 1 },
        { field: 'divisionName', headerName: 'Division', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                !params.row.isEnrolled ? (
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEnroll(params.row.id)}>Enroll</Button>
                ) : (
                    <Button variant="contained" color="success" size="small" disabled>Enrolled</Button>
                )
            ),
        },
    ];

    return (
        <MainCard title="Available Exams">
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid rows={exams} columns={columns} loading={loading} getRowId={(row) => row.id} />
            </Box>
        </MainCard>
    );
};

export default StudentExamList;