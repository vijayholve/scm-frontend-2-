import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Select, MenuItem, FormControl, InputLabel, TextField, Typography, Paper, Tabs, Tab, IconButton, Autocomplete, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-hot-toast';
import { userDetails } from 'utils/apiService';
import api from 'utils/apiService';
import QuizResult from "../test/QuizResult";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

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

const QuizResultTab = ({ quizId, studentId }) => {
    return (
        <Box sx={{ p: 2 }}>
            <QuizResult quizId={quizId} studentId={studentId} />
        </Box>
    );
};


// Component for the detailed tabbed view
const StudentGradingView = ({ student, subject, onMarksChange, marks, onSave, onBack }) => {
    const [tabValue, setTabValue] = useState(0);
    const [paperFile, setPaperFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Dynamically get the question and answer from dummy data
    const question = dummyQuestions[subject.id] || "No question found for this subject.";
    const studentAnswer = dummyStudentAnswers[student.studentId]?.[subject.id] || "No answer submitted.";

    const handleFileChange = (event) => {
      setPaperFile(event.target.files[0]);
    };
    
    const handlePaperUpload = async () => {
      if (!paperFile) {
        toast.error("Please select a file to upload.");
        return;
      }
    
      setUploading(true);
      const formData = new FormData();
      formData.append('file', paperFile);
      formData.append('examId', subject.examId);
      formData.append('subjectId', subject.subjectId);
    
      try {
        await api.post(`/api/exams/uploadPaper`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Exam paper uploaded successfully!");
        setPaperFile(null);
      } catch (error) {
        console.error("Failed to upload exam paper:", error);
        toast.error("Failed to upload exam paper.");
      } finally {
        setUploading(false);
      }
    };


    return (
        <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h4" gutterBottom>{`Grading: ${student.studentName} - ${subject.subjectName}`}</Typography>
            {/* this is on phone screen view not showing correctly just show two value of tab enter marks and view  */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="tab-select-label">Select View</InputLabel>
                    <Select 
                        labelId="tab-select-label"
                        value={tabValue}
                        label="Select View"
                        onChange={(e) => setTabValue(e.target.value)}
                    >
                        <MenuItem value={0}>Enter Marks</MenuItem>
                        <MenuItem value={1}>View Paper & Answers</MenuItem>
                        <MenuItem value={2}>View Quiz Result</MenuItem>
                        <MenuItem value={3}>Upload Paper</MenuItem>
                    </Select>       
                </FormControl>  
            </Box>

            <Box 
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: { xs: 'none', sm: 'block' },
                    mt: 2
                }}  
            >
                
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Enter Marks" />
                    <Tab label="View Paper & Answers" />
                    <Tab label="View Quiz Result"/>
                    <Tab label="Upload Paper" />
                </Tabs>
            </Box>
            {tabValue === 0 && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Enter Marks (Out of {subject.maxMarksSubject})</Typography>
                    <TextField
                        type="number"
                        size="small"
                        value={marks}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val > subject.maxMarksSubject) {
                                toast.error(`Marks cannot exceed ${subject.maxMarksSubject}.`);
                            } else {
                                onMarksChange(student.studentId, subject.subjectId, val);
                            }
                        }}
                        inputProps={{ max: subject.maxMarksSubject, min: 0 }}
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
            {tabValue === 2 && (
                <QuizResultTab quizId={subject.quizId} studentId={student.studentId} />
            )}
            {tabValue === 3 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Upload Exam Paper</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      type="file"
                      onChange={handleFileChange}
                      InputLabelProps={{ shrink: true }}
                      label="Select a file to upload"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePaperUpload}
                      disabled={!paperFile || uploading}
                      startIcon={<CloudUploadIcon />}
                    >
                      {uploading ? 'Uploading...' : 'Upload Paper'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
        </Paper>
    );
};

const TeacherExamView = () => {
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [currentView, setCurrentView] = useState(null);
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDivisionId, setSelectedDivisionId] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const schoolsRes = await api.get(`/api/schoolBranches/getAllBy/${userDetails.getAccountId()}`);
                setSchools(schoolsRes.data || []);
            } catch (error) {
                console.error('Failed to fetch schools', error);
                toast.error('Failed to load schools');
            }
        };
        const fetchClasses = async () => {
            try {
                const classesRes = await api.get(`/api/schoolClasses/getAllBy/${userDetails.getAccountId()}`);
                setClasses(classesRes.data || []);
            } catch (error) {
                console.error('Failed to fetch classes', error);
                toast.error('Failed to load classes');
            }
        };
        const fetchDivisions = async () => {
            try {
                const divisionsRes = await api.get(`/api/divisions/getAllBy/${userDetails.getAccountId()}`);
                setDivisions(divisionsRes.data || []);
            } catch (error) {
                console.error('Failed to fetch divisions', error);
                toast.error('Failed to load divisions');
            }
        };
        fetchSchools();
        fetchClasses();
        fetchDivisions();
    }, []);


    useEffect(() => {
        const fetchExams = async () => {
            try {  
                const examsRes = await api.post(`/api/exams/getAllBy/${userDetails.getAccountId()}`, {
                    page: 0,
                    size: 1000,
                    sortBy: 'id',
                    sortDir: 'asc',
                    schoolId: selectedSchoolId,
                    classId: selectedClassId,
                    divisionId: selectedDivisionId
                });
                setExams(examsRes.data.content || []);
            } catch (error) {
                console.error('Failed to fetch exams', error);
                toast.error('Failed to load exams');
            }
        };
        fetchExams();   
    }, [selectedSchoolId, selectedClassId, selectedDivisionId]);

    useEffect(() => {
        if (selectedExamId) {

            const fetchSubjects = async () => {
                const subjectsRes = await api.get(`/api/exams/getSubjectsForExam/${selectedExamId}`);
                setSubjects(subjectsRes.data || []);
            };
            fetchSubjects();

            const fetchStudents = async () => {
            const studentsRes = await api.post(`api/exams/getStudentForExam/${selectedExamId}/${userDetails.getAccountId()}`, {
                page: 0,
                size: 1000,
                sortBy: 'id',
                sortDir: 'asc',
                schoolId: selectedSchoolId,
                classId: selectedClassId,
                divisionId: selectedDivisionId
                });
                const studentsData = studentsRes.data.content || [];
                setEnrolledStudents(studentsData);
                
                const initialMarks = {};
                studentsData.forEach(student => {
                    if (student.marks) {
                        for (const subjectId in student.marks) {
                            initialMarks[`${student.studentId}-${subjectId}`] = student.marks[subjectId];
                        }
                    }
                });
                setMarks(initialMarks);
                setCurrentView(null);
                
            };  
            fetchStudents();
        } else {
            setEnrolledStudents([]);
            setMarks({});
        }
    }, [selectedExamId, selectedSchoolId, selectedClassId, selectedDivisionId]);

    const handleMarksChange = (studentId, subjectId, value) => {
        const subject = subjects.find(sub => sub.subjectId === subjectId);
        if (value > subject.maxMarksSubject) {
            toast.error(`Marks cannot exceed ${subject.maxMarksSubject}.`);
        } else {
            setMarks(prev => ({ ...prev, [`${studentId}-${subjectId}`]: value }));
        }
    };

    const handleSaveMarks = async (studentId, marks) => {
        try {
            const marksRes = await api.put(`/api/exams/updateExamStudentMarks/${selectedExamId}`, {
                studentId: studentId,
                marks: marks,
                schoolId: selectedSchoolId,
                classId: selectedClassId,
                divisionId: selectedDivisionId
            });
            console.log('Marks saved response:', marksRes);
            const student = enrolledStudents.find(s => s.studentId === studentId);
            const studentName = student ? student.studentName : 'a student';
            toast.success(`Marks saved successfully for ${studentName}!`);
        } catch (error) {
            console.error('Failed to save marks', error);
            toast.error('Failed to save marks. Please try again.');
        }
    };

    const columns = [
        { field: 'studentName', headerName: 'Student Name', flex: 1, minWidth: 150 },
        ...(subjects || []).map(subject => ({
            field: `subject-${subject.subjectId}`,
            headerName: `${subject.subjectName} (/${subject.maxMarksSubject})`,
            width: 220,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <TextField
                        type="number"
                        size="small"
                        placeholder="Marks"
                        value={marks[`${params.row.studentId}-${subject.subjectId}`] || ''}
                        onChange={(e) => handleMarksChange(params.row.studentId, subject.subjectId, e.target.value)}
                        inputProps={{ max: subject.maxMarksSubject, min: 0 }}
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
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                        // Gather all subject marks for this student
                        const studentId = params.row.studentId;
                        // Build a subject-mark map for this student
                        const studentSubjectMarks = {};
                        (subjects || []).forEach(subject => {
                            const key = `${studentId}-${subject.subjectId}`;
                            if (marks[key] !== undefined && marks[key] !== '') {
                                studentSubjectMarks[subject.subjectId] = marks[key];
                            }
                        });
                        handleSaveMarks(studentId, studentSubjectMarks);
                    }}
                >
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
                    marks={marks[`${currentView.student.studentId}-${currentView.subject.subjectId}`] || ''}
                    onMarksChange={handleMarksChange}
                    onSave={() => handleSaveMarks(
                        currentView.student.studentId,
                        { [currentView.subject.subjectId]: marks[`${currentView.student.studentId}-${currentView.subject.subjectId}`] }
                    )}
                    onBack={() => setCurrentView(null)}
                />
            </MainCard>
        );
    }

    return (
        <MainCard title="Grade Exams">
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* School Autocomplete */}
                <Grid item xs={12} sm={6}>
                    <Autocomplete 
                        disablePortal 
                        id="timetable-school-autocomplete"
                        options={schools}
                        getOptionLabel={(option) => option.name || ''}
                        value={schools.find((sch) => sch.id === selectedSchoolId) || null}
                        onChange={(event, newValue) => {
                            setSelectedSchoolId(newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select School" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>

                {/* Class Autocomplete */}
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        disablePortal
                        id="timetable-class-autocomplete"
                        options={classes}
                        getOptionLabel={(option) => option.name || ''}
                        value={classes.find((cls) => cls.id === selectedClassId) || null}
                        onChange={(event, newValue) => {
                            setSelectedClassId(newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Class" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>

                {/* Division Autocomplete */}
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        disablePortal
                        id="timetable-division-autocomplete"
                        options={divisions}
                        getOptionLabel={(option) => option.name || ''}
                        value={divisions.find((div) => div.id === selectedDivisionId) || null}
                        onChange={(event, newValue) => {
                            setSelectedDivisionId(newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Division" variant="outlined" fullWidth />
                        )}
                    />
                </Grid>

                {/* Exam Select */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="select-exam-label">Select Exam</InputLabel>
                        <Select
                            labelId="select-exam-label"
                            value={selectedExamId}
                            label="Select Exam"
                            onChange={(e) => setSelectedExamId(e.target.value)}
                        >
                            {exams.map((exam) => (
                                <MenuItem key={exam.id} value={exam.id}>
                                    {exam.examName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {selectedExamId && (
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid rows={enrolledStudents} columns={columns} getRowId={(row) => row.studentId} />
                </Box>
            )}
        </MainCard>
    );
};

// Simple Error Boundary to protect the view from runtime render errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error('Error in TeacherExamView:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <MainCard title="Error">
                    <Typography color="error">Something went wrong while loading the page.</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={() => this.setState({ hasError: false, error: null })}>
                            Retry
                        </Button>
                    </Box>
                </MainCard>
            );
        }
        return this.props.children;
    }
}

const TeacherExamViewWithBoundary = () => (
    <ErrorBoundary>
        <TeacherExamView />
    </ErrorBoundary>
);

export default TeacherExamViewWithBoundary;
