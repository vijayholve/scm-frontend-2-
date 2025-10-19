import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Stack,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MainCard from 'ui-component/cards/MainCard';
import BackButton from 'layout/MainLayout/Button/BackButton';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SubjectIcon from '@mui/icons-material/Subject';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { userDetails, default as apiClient } from '../../../utils/apiService';
import { useTheme } from '@mui/material/styles';

// Dummy exam details (existing)
const dummyExamDetails = {
  id: 1,
  examName: 'Annual Science Examination',
  academicYear: '2025',
  examType: 'WRITTEN',
  startDate: '2025-10-20T09:00:00.000Z',
  endDate: '2025-10-20T12:00:00.000Z',
  status: 'SCHEDULED',
  maxMarksOverall: 175,
  examSubjects: [
    {
      id: 101,
      subjectId: 1,
      subjectName: 'Physics',
      maxMarksSubject: 75,
      passingMarksSubject: 25,
      durationMinutes: 90,
      examDateTime: '2025-10-20T10:00:00.000Z'
    },
    {
      id: 102,
      subjectId: 2,
      subjectName: 'Chemistry',
      maxMarksSubject: 100,
      passingMarksSubject: 33,
      durationMinutes: 120,
      examDateTime: '2025-10-21T10:00:00.000Z'
    }
  ]
};

// Dummy fallback (kept for safety)
const dummySubjectResults = {
  101: [
    { id: 1, firstName: 'Aarav', lastName: 'Sharma', rollNumber: 'R001', marksObtained: 68, rank: 2 },
    { id: 2, firstName: 'Saanvi', lastName: 'Verma', rollNumber: 'R002', marksObtained: 72, rank: 1 },
    { id: 3, firstName: 'Rohit', lastName: 'Kumar', rollNumber: 'R003', marksObtained: null, rank: null } // marks not declared
  ],
  102: [
    { id: 1, firstName: 'Aarav', lastName: 'Sharma', rollNumber: 'R001', marksObtained: 88, rank: 1 },
    { id: 2, firstName: 'Saanvi', lastName: 'Verma', rollNumber: 'R002', marksObtained: 74, rank: 2 },
    { id: 3, firstName: 'Rohit', lastName: 'Kumar', rollNumber: 'R003', marksObtained: null, rank: null }
  ]
};

const ExamView = () => {
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // new state: enrolled students fetched from API
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Move hooks here so they run on every render
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    setExam(dummyExamDetails);
    setLoading(false);
  }, [examId]);

  useEffect(() => {
    // fetch student list for exam once when examId set
    const fetchStudentsForExam = async () => {
      if (!examId) return;
      setStudentsLoading(true);
      try {
        const accountId = userDetails.getAccountId();
        // preferred API from your request: POST to /api/exams/getStudentForExam/{examId}/{accountId}
        const payload = {
          page: 0,
          size: 1000,
          sortBy: 'studentId',
          sortDir: 'asc'
        };
        const res = await apiClient.post(`/api/exams/getStudentForExam/${examId}/${accountId}`, payload);
        // backend may return { content: [...] } or array
        const raw = Array.isArray(res.data) ? res.data : res.data?.content || res.data || [];
        // normalise to objects with studentId, studentName, marks (object)
        const normalised = raw.map((s) => ({
          studentId: s.studentId ?? s.id,
          studentName: s.studentName ?? `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          rollNumber: s.rollNumber ?? s.rollNo ?? (s.studentId ? String(s.studentId) : '—'),
          marks: s.marks || {}
        }));
        setEnrolledStudents(normalised);
      } catch (err) {
        console.error('Failed to fetch students for exam', err);
        setEnrolledStudents([]); // fallback
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudentsForExam();
  }, [examId]);

  // early returns are now safe
  if (loading)
    return (
      <MainCard title="Loading...">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  if (!exam)
    return (
      <MainCard title="Error">
        <Typography>Exam details could not be loaded.</Typography>
      </MainCard>
    );

  const currentUser = userDetails.getUser() || {};
  const isStudent = (() => {
    if (!currentUser) return false;
    const role = (currentUser.role || currentUser.userType || '').toString().toUpperCase();
    if (role === 'STUDENT') return true;
    if (Array.isArray(currentUser.roles)) return currentUser.roles.map((r) => String(r).toUpperCase()).includes('STUDENT');
    return false;
  })();

  // helper: compute ranks for a subject based on enrolledStudents marks
  const computeRanksForSubject = (subjectId) => {
    // copy so we don't mutate original
    const rows = enrolledStudents.map((s) => {
      const m = s.marks ? s.marks[subjectId] : null;
      return { ...s, mark: typeof m === 'number' ? m : null };
    });
    // sort students who have marks
    const sorted = [...rows].filter((r) => r.mark !== null).sort((a, b) => b.mark - a.mark);
    const ranks = {};
    sorted.forEach((r, idx) => {
      ranks[r.studentId] = idx + 1;
    });
    // students without marks get null rank
    return rows.map((r) => ({ ...r, rank: ranks[r.studentId] ?? null }));
  };

  // Small reusable item for student result (responsive)
  const StudentResultItem = ({ r, subject }) => {
    const pass = r.mark != null && r.mark >= subject.passingMarksSubject;

    return (
      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          // Card on phones, grid on >= sm
          display: { xs: 'flex', sm: 'grid' },
          flexDirection: { xs: 'column', sm: 'initial' },
          gridTemplateColumns: { sm: '80px 1fr 140px 80px' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
          p: { xs: 1.5, sm: 1 },
          borderRadius: 1.5,
          '&:hover': { boxShadow: { sm: 1 } }
        }}
      >
        {/* Roll */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
            Roll
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {r.rollNumber || r.studentId || '—'}
          </Typography>
        </Box>

        {/* Student */}
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
            Student
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {r.studentName || r.studentId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {r.studentId}
          </Typography>
        </Box>

        {/* Marks + Status chip */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'center' }, gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
              Marks
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {r.mark == null ? 'N/A' : r.mark}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={r.mark == null ? 'Not declared' : pass ? 'Pass' : 'Fail'}
            color={r.mark == null ? 'default' : pass ? 'success' : 'error'}
            variant={r.mark == null ? 'outlined' : 'filled'}
          />
        </Box>

        {/* Rank */}
        <Box sx={{ textAlign: { xs: 'left', sm: 'center' } }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
            Rank
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {r.rank == null ? 'N/A' : r.rank}
          </Typography>
        </Box>
      </Paper>
    );
  };

  // Handler to render subject detail panel
  const renderSubjectPanel = (subject) => {
    // try to get from fetched enrolledStudents; fallback to dummySubjectResults
    const available = enrolledStudents.length > 0 ? computeRanksForSubject(String(subject.subjectId) || String(subject.id)) : null;

    if (isStudent) {
      // find current student's result from fetched list first, else fallback to dummy
      let myResult = null;
      if (available) {
        myResult = available.find((r) => String(r.studentId) === String(currentUser.id));
      } else {
        const fallback = (dummySubjectResults[subject.id] || []).find((r) => r.id === currentUser.id) || null;
        myResult = fallback
          ? {
              studentId: fallback.id,
              studentName: `${fallback.firstName} ${fallback.lastName}`.trim(),
              mark: fallback.marksObtained ?? null,
              rank: fallback.rank ?? null
            }
          : null;
      }

      return (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Subject: {subject.subjectName}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Chip label={`Max Marks: ${subject.maxMarksSubject}`} variant="outlined" />
            <Chip label={`Passing: ${subject.passingMarksSubject}`} variant="outlined" color="success" />
            <Chip label={`Duration: ${subject.durationMinutes} min`} variant="outlined" color="primary" />
          </Stack>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Your result for this subject
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
              <Box>
                <Typography variant="h6">{myResult && myResult.mark != null ? myResult.mark : 'N/A'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Marks Obtained
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">{myResult && myResult.rank != null ? myResult.rank : 'N/A'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Subject Rank
                </Typography>
              </Box>
            </Box>

            {!myResult && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                No marks declared for you in this subject yet.
              </Typography>
            )}
          </Paper>
        </Box>
      );
    }

    // Teacher view: show a nicely styled list (no ReusableDataGrid) with studentName, marks, rank
    const list = available
      ? available
      : (dummySubjectResults[subject.id] || []).map((r) => ({
          studentId: r.id,
          studentName: `${r.firstName || ''} ${r.lastName || ''}`.trim(),
          rollNumber: r.rollNumber ?? '—',
          mark: r.marksObtained ?? null,
          rank: r.rank ?? null
        }));

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Subject: {subject.subjectName}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`Max Marks: ${subject.maxMarksSubject}`} variant="outlined" />
          <Chip label={`Passing: ${subject.passingMarksSubject}`} variant="outlined" color="success" />
          <Chip label={`Duration: ${subject.durationMinutes} min`} variant="outlined" color="primary" />
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, sm: 2 },
            borderRadius: 2,
            pb: { xs: 8, sm: 2 } // leave room for floating FABs on phones
          }}
        >
          {/* Header row (desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'grid' },
              gridTemplateColumns: { sm: '80px 1fr 140px 80px' },
              gap: 2,
              alignItems: 'center',
              pb: 1,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              mb: 1
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Roll
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              Student
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: 'center' }}>
              Marks / Status
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: 'center' }}>
              Rank
            </Typography>
          </Box>

          {studentsLoading && (
            <Typography variant="body2" color="text.secondary">
              Loading student results...
            </Typography>
          )}

          <Stack spacing={1}>
            {(!list || list.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                No student results available.
              </Typography>
            )}

            {list.map((r) => (
              <StudentResultItem key={r.studentId} r={r} subject={subject} />
            ))}
          </Stack>
        </Paper>
      </Box>
    );
  };

  return (
    <MainCard title="Exam Details" secondary={<BackButton BackUrl="/masters/exams" />}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '12px' }}>
        <Grid container spacing={4}>
          {/* Exam Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom>
                  {exam.examName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Academic Year: {exam.academicYear}
                </Typography>
              </Box>
              <Chip label={exam.status} color={exam.status === 'SCHEDULED' ? 'primary' : 'success'} icon={<CheckCircleIcon />} />
            </Box>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Key Information Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Exam Type
                    </Typography>
                    <Typography variant="h6">{exam.examType}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 2, color: 'secondary.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Marks
                    </Typography>
                    <Typography variant="h6">{exam.maxMarksOverall}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <CalendarMonthIcon sx={{ mr: 2, color: 'success.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="h6">{new Date(exam.startDate).toLocaleDateString()}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 2, color: 'error.main', fontSize: 40 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography variant="h6">{new Date(exam.endDate).toLocaleDateString()}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Subjects Section with expandable details */}
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Subjects & Details
            </Typography>

            {exam.examSubjects.map((subject) => (
              <Accordion key={subject.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SubjectIcon color="action" />
                      <Typography variant="h6">{subject.subjectName}</Typography>
                      <Chip label={`Max ${subject.maxMarksSubject}`} size="small" sx={{ ml: 1 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Scheduled: {new Date(subject.examDateTime).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>{renderSubjectPanel(subject)}</AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </MainCard>
  );
};

export default ExamView;
