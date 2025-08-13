import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Select, MenuItem, FormControl, InputLabel, TextField, Typography, Paper, Tabs, Tab, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-hot-toast';

// --- Dummy Data ---
const dummyExams = [
    { 
        id: 1, 
        examName: 'Mid-Term Exam - Class 10A', 
        subjects: [
            { id: 101, subjectName: 'Mathematics', totalMarks: 100 },
            { id: 102, subjectName: 'Science', totalMarks: 75 }
        ] 
    },
    { 
        id: 2, 
        examName: 'Final Exam - Class 10A', 
        subjects: [
            { id: 101, subjectName: 'Mathematics', totalMarks: 100 },
            { id: 102, subjectName: 'Science', totalMarks: 75 },
            { id: 103, subjectName: 'History', totalMarks: 50 }
        ] 
    }
];
const dummyEnrolledStudents = {
    1: [
        { studentId: 1, studentName: 'Alice Johnson', marks: { '101': 88, '102': 65 } },
        { studentId: 2, studentName: 'Bob Williams', marks: { '101': 92 } }
    ],
    2: [
        { studentId: 1, studentName: 'Alice Johnson', marks: { '101': 95, '102': 70, '103': 45 } },
        { studentId: 2, studentName: 'Bob Williams', marks: { '101': 85, '102': 68, '103': 40 } },
        { studentId: 3, studentName: 'Charlie Brown', marks: {} }
    ]
};

// --- New Dummy Data for Questions and Answers ---
const dummyQuestions = {
    101: "Q1: Solve for x: 2x + 5 = 15. Show your work.",
    102: "Q1: What is the powerhouse of the cell?",
    103: "Q1: Who was the first President of the United States?"
};
const dummyStudentAnswers = {
    1: { // Alice's Answers
        101: "2x = 10, so x = 5.",
        102: "Mitochondria.",
        103: "George Washington."
    },
    2: { // Bob's Answers
        101: "x = 5.",
        102: "The nucleus.",
        103: "Abraham Lincoln."
    },
    3: { // Charlie's Answers
        103: "I'm not sure."
    }
};


// Component for the detailed tabbed view
const StudentGradingView = ({ student, subject, onMarksChange, marks, onSave, onBack }) => {
    const [tabValue, setTabValue] = useState(0);
    const marksValue = marks[`${student.studentId}-${subject.id}`] || '';

    // Dynamically get the question and answer from dummy data
    const question = dummyQuestions[subject.id] || "No question found for this subject.";
    const studentAnswer = dummyStudentAnswers[student.studentId]?.[subject.id] || "No answer submitted.";


    return (
        <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h4" gutterBottom>{`Grading: ${student.studentName} - ${subject.subjectName}`}</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Enter Marks" />
                    <Tab label="View Paper & Answers" />
                </Tabs>
            </Box>
            {tabValue === 0 && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Enter Marks (Out of {subject.totalMarks})</Typography>
                    <TextField
                        type="number"
                        size="small"
                        value={marksValue}
                        onChange={(e) => onMarksChange(student.studentId, subject.id, e.target.value)}
                        inputProps={{ max: subject.totalMarks, min: 0 }}
                        sx={{ mt: 2, mb: 2, width: '150px' }}
                    />
                    <Box>
                        <Button variant="contained" color="primary" onClick={() => onSave(student.studentId)} sx={{ mr: 1 }}>Save Marks</Button>
                        <Button variant="outlined" onClick={onBack}>Back to List</Button>
                    </Box>
                </Box>
            )}
            {tabValue === 1 && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Question Paper & Student's Answers</Typography>
                    <Typography sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                        This is a placeholder view for the {subject.subjectName} exam.
                    </Typography>
                    <Box sx={{ mt: 3, p: 2, border: '1px dashed grey', borderRadius: '4px' }}>
                        <Typography><strong>{question}</strong></Typography>
                        <Typography color="primary">{student.studentName}'s Answer: {studentAnswer}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={onBack} sx={{ mt: 3 }}>Back to List</Button>
                </Box>
            )}
        </Paper>
    );
};

const TeacherExamView = () => {
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [currentView, setCurrentView] = useState(null);

    useEffect(() => {
        setExams(dummyExams);
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            const students = dummyEnrolledStudents[selectedExamId] || [];
            setEnrolledStudents(students);
            
            const initialMarks = {};
            students.forEach(student => {
                const selectedExam = dummyExams.find(e => e.id === selectedExamId);
                selectedExam?.subjects.forEach(subject => {
                    if (student.marks && student.marks[subject.id] !== undefined) {
                        initialMarks[`${student.studentId}-${subject.id}`] = student.marks[subject.id];
                    }
                });
            });
            setMarks(initialMarks);
            setCurrentView(null);
        } else {
            setEnrolledStudents([]);
        }
    }, [selectedExamId]);

    const handleMarksChange = (studentId, subjectId, value) => {
        setMarks(prev => ({ ...prev, [`${studentId}-${subjectId}`]: value }));
    };

    const handleSaveMarks = (studentId) => {
        toast.success(`(Dummy) Marks saved for student ${studentId}`);
        console.log("Saving marks for student:", studentId, marks);
    };

    const columns = [
        { field: 'studentName', headerName: 'Student Name', flex: 1, minWidth: 150 },
        ...(exams.find(e => e.id === selectedExamId)?.subjects || []).map(subject => ({
            field: `subject-${subject.id}`,
            headerName: `${subject.subjectName} (/${subject.totalMarks})`,
            width: 220,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <TextField
                        type="number"
                        size="small"
                        placeholder="Marks"
                        value={marks[`${params.row.studentId}-${subject.id}`] || ''}
                        onChange={(e) => handleMarksChange(params.row.studentId, subject.id, e.target.value)}
                        inputProps={{ max: subject.totalMarks, min: 0 }}
                        sx={{ width: '100px' }}
                    />
                    <IconButton color="secondary" size="small" onClick={() => setCurrentView({ student: params.row, subject: subject })}>
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            )
        })),
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Button variant="contained" color="primary" size="small" onClick={() => handleSaveMarks(params.row.studentId)}>
                    Save All
                </Button>
            ),
        },
    ];

    if (currentView) {
        return (
            <MainCard title="Grade Exam">
                <StudentGradingView 
                    student={currentView.student}
                    subject={currentView.subject}
                    marks={marks}
                    onMarksChange={handleMarksChange}
                    onSave={handleSaveMarks}
                    onBack={() => setCurrentView(null)}
                />
            </MainCard>
        );
    }

    return (
        <MainCard title="Grade Exams">
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Exam</InputLabel>
                <Select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
                    {exams.map((exam) => (<MenuItem key={exam.id} value={exam.id}>{exam.examName}</MenuItem>))}
                </Select>
            </FormControl>
            {selectedExamId && (
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid rows={enrolledStudents} columns={columns} getRowId={(row) => row.studentId} />
                </Box>
            )}
        </MainCard>
    );
};

export default TeacherExamView;