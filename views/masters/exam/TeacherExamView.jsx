import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Autocomplete,
  Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-hot-toast';
import { userDetails } from 'utils/apiService';
import api from 'utils/apiService';
import QuizResult from '../test/QuizResult';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useSCDData } from 'contexts/SCDProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
// --- MOCK l18n HOOK (REPLACE WITH YOUR REAL IMPLEMENTATION) ---
// This mock simulates a translation function 't'



// --- END MOCK l18n HOOK ---


// --- New Dummy Data for Questions and Answers ---
const dummyQuestions = {
  101: 'Q1: Solve for x: 2x + 5 = 15. Show your work.',
  102: 'Q1: What is the powerhouse of the cell?',
  103: 'Q1: Who was the first President of the United States?'
};
const dummyStudentAnswers = {
  1: {
    // Alice's Answers
    101: '2x = 10, so x = 5.',
    102: 'Mitochondria.',
    103: 'George Washington.'
  },
  2: {
    // Bob's Answers
    101: 'x = 5.',
    102: 'The nucleus.',
    103: 'Abraham Lincoln.'
  },
  3: {
    // Charlie's Answers
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
  const { t } = useTranslation('teacherView');
  const [tabValue, setTabValue] = useState(0);
  const [paperFile, setPaperFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Dynamically get the question and answer from dummy data
  const question = dummyQuestions[subject.id] || t('gradingView.noQuestionFound');
  const studentAnswer = dummyStudentAnswers[student.studentId]?.[subject.id] || t('gradingView.noAnswerSubmitted');

  const handleFileChange = (event) => {
    setPaperFile(event.target.files[0]);
  };

  const handlePaperUpload = async () => {
    if (!paperFile) {
      toast.error(t('toasts.selectFileToUpload'));
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
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(t('toasts.uploadSuccess'));
      setPaperFile(null);
    } catch (error) {
      console.error('Failed to upload exam paper:', error);
      toast.error(t('toasts.uploadFail'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t('gradingView.titlePrefix')}: {student.studentName} - {subject.subjectName}
      </Typography>
      
      {/* Mobile view tabs as Select/Dropdown */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="tab-select-label">Select View</InputLabel>
          <Select labelId="tab-select-label" value={tabValue} label="Select View" onChange={(e) => setTabValue(e.target.value)}>
            <MenuItem value={0}>{t('gradingView.tabEnterMarks')}</MenuItem>
            <MenuItem value={1}>{t('gradingView.tabViewPaperAnswers')}</MenuItem>
            <MenuItem value={2}>{t('gradingView.tabViewQuizResult')}</MenuItem>
            <MenuItem value={3}>{t('gradingView.tabUploadPaper')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Desktop/Tablet tabs as Tabs component */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: { xs: 'none', sm: 'block' },
          mt: 2
        }}
      >
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={t('gradingView.tabEnterMarks')} />
          <Tab label={t('gradingView.tabViewPaperAnswers')} />
          <Tab label={t('gradingView.tabViewQuizResult')} />
          <Tab label={t('gradingView.tabUploadPaper')} />
        </Tabs>
      </Box>
      
      {/* Tab 0: Enter Marks */}
      {tabValue === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">
            {t('gradingView.marksHeading', { maxMarks: subject.maxMarksSubject })}
          </Typography>
          <TextField
            type="number"
            size="small"
            value={marks}
            onChange={(e) => {
              const val = e.target.value;
              if (val > subject.maxMarksSubject) {
                toast.error(t('toasts.marksExceeded', { maxMarks: subject.maxMarksSubject }));
              } else {
                onMarksChange(student.studentId, subject.subjectId, val);
              }
            }}
            inputProps={{ max: subject.maxMarksSubject, min: 0 }}
            sx={{ mt: 2, mb: 2, width: '150px' }}
          />
          <Box>
            <Button variant="contained" color="primary" onClick={() => onSave(student.studentId)} sx={{ mr: 1 }}>
              {t('gradingView.saveMarks')}
            </Button>
          </Box>
        </Box>
      )}

      {/* Tab 1: View Paper & Answers */}
      {tabValue === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{t('gradingView.questionAnswerTitle')}</Typography>
          <Typography sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            {t('gradingView.placeholderViewText', { subjectName: subject.subjectName })}
          </Typography>
          <Box sx={{ mt: 3, p: 2, border: '1px dashed grey', borderRadius: '4px' }}>
            <Typography>
              <strong>{t('gradingView.questionPrefix')} {question}</strong>
            </Typography>
            <Typography color="primary">
              {t('gradingView.studentAnswer', { studentName: student.studentName, answer: studentAnswer })}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Tab 2: View Quiz Result */}
      {tabValue === 2 && <QuizResultTab quizId={subject.quizId} studentId={student.studentId} />}
      
      {/* Tab 3: Upload Paper */}
      {tabValue === 3 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('gradingView.uploadPaperTitle')}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                type="file"
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
                label={t('gradingView.selectFileLabel')}
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
                {uploading ? t('gradingView.uploadingButton') : t('gradingView.uploadButton')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Persistent Back Button Footer */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          mt: 2,
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          zIndex: 1
        }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
          {t('gradingView.back')}
        </Button>
      </Box>
    </Paper>
  );
};

const TeacherExamView = () => {
  const { t } = useTranslation('teacherView');
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [currentView, setCurrentView] = useState(null);

  const { schools, classes, divisions, loading: scdLoading, error: scdError } = useSCDData();

  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');

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
        toast.error(t('toasts.loadExamsFail'));
      }
    };
    fetchExams();
  }, [selectedSchoolId, selectedClassId, selectedDivisionId, t]);

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
        studentsData.forEach((student) => {
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
    const subject = subjects.find((sub) => sub.subjectId === subjectId);
    if (value > subject.maxMarksSubject) {
      toast.error(t('toasts.marksExceeded', { maxMarks: subject.maxMarksSubject }));
    } else {
      setMarks((prev) => ({ ...prev, [`${studentId}-${subjectId}`]: value }));
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
      const student = enrolledStudents.find((s) => s.studentId === studentId);
      const studentName = student ? student.studentName : t('a student'); // Fallback localization not provided, kept simple
      toast.success(t('toasts.saveMarksSuccess', { studentName }));
    } catch (error) {
      console.error('Failed to save marks', error);
      toast.error(t('toasts.saveMarksFail'));
    }
  };

  const columns = [
    { field: 'studentName', headerName: t('dataGrid.studentName'), flex: 1, minWidth: 150 },
    ...(subjects || []).map((subject) => ({
      field: `subject-${subject.subjectId}`,
      headerName: `${subject.subjectName} (/${subject.maxMarksSubject})`,
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <TextField
            type="number"
            size="small"
            placeholder={t('dataGrid.placeholderMarks')}
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
      headerName: t('dataGrid.actions'),
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
            (subjects || []).forEach((subject) => {
              const key = `${studentId}-${subject.subjectId}`;
              if (marks[key] !== undefined && marks[key] !== '') {
                studentSubjectMarks[subject.subjectId] = marks[key];
              }
            });
            handleSaveMarks(studentId, studentSubjectMarks);
          }}
        >
          {t('dataGrid.saveAll')}
        </Button>
      )
    }
  ];

  if (currentView) {
    return (
      <MainCard title={t('gradeExamTitle')}>
        <StudentGradingView
          student={currentView.student}
          subject={currentView.subject}
          marks={marks[`${currentView.student.studentId}-${currentView.subject.subjectId}`] || ''}
          onMarksChange={handleMarksChange}
          onSave={() =>
            handleSaveMarks(currentView.student.studentId, {
              [currentView.subject.subjectId]: marks[`${currentView.student.studentId}-${currentView.subject.subjectId}`]
            })
          }
          onBack={() => setCurrentView(null)}
        />
      </MainCard>
    );
  }

  return (
    <MainCard title={t('title')}>
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
            renderInput={(params) => <TextField {...params} label={t('filters.selectSchool')} variant="outlined" fullWidth />}
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
            renderInput={(params) => <TextField {...params} label={t('filters.selectClass')} variant="outlined" fullWidth />}
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
            renderInput={(params) => <TextField {...params} label={t('filters.selectDivision')} variant="outlined" fullWidth />}
          />
        </Grid>

        {/* Exam Select */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="select-exam-label">{t('filters.selectExam')}</InputLabel>
            <Select
              labelId="select-exam-label"
              value={selectedExamId}
              label={t('filters.selectExam')}
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



export default TeacherExamView;
