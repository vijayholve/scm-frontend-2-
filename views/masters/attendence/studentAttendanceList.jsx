import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../utils/apiService';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Button,
  Divider
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilePresentIcon from '@mui/icons-material/CheckCircleOutline';
import FileAbsentIcon from '@mui/icons-material/HighlightOff';
import { useTranslation } from 'react-i18next';
// Helper: group API content by attendanceDate (same as before, but cleaned)
function groupAttendanceByDate(content) {
  const grouped = {}; // { date: { className, divisionName, subjects: { subject: vailable } } }
  content.forEach((item) => {
    const date = item.attendanceDate;
    if (!grouped[date]) {
      grouped[date] = {
        className: item.className,
        divisionName: item.divisionName,
        subjects: {}
      };
    }

    // studentAttendanceMappings expected to be array; take first mapping's vailable if present
    const vailable =
      Array.isArray(item.studentAttendanceMappings) && item.studentAttendanceMappings.length
        ? item.studentAttendanceMappings[0].vailable
        : null;

    const subjectKey = item.subjectName || 'General';
    grouped[date].subjects[subjectKey] = vailable;
  });

  return Object.entries(grouped)
    .map(([attendanceDate, data]) => ({
      attendanceDate,
      className: data.className,
      divisionName: data.divisionName,
      subjects: data.subjects
    }))
    .sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate)); // newest first
}

const StudentAttendanceList = () => {
  const user = useSelector((state) => state.user.user);
  const [attendanceData, setAttendanceData] = useState([]); // grouped data by date
  const [subjectHeaders, setSubjectHeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const { t } = useTranslation("title"); // <-- ADDED HOOK

  // Fetch raw content so we can compute accurate stats
  useEffect(() => {
    if (!user?.accountId || !user?.id) return;
    setLoading(true);

    api
      .post(`/api/attendance/getStudentAttendance/${user.accountId}/${user.id}`, {
        page,
        size: rowsPerPage,
        sortBy: 'attendanceDate',
        sortDir: 'desc'
      })
      .then((response) => {
        const content = response?.data?.content || [];
        const grouped = groupAttendanceByDate(content);

        // Collect unique subjects across returned content, sorted
        const allSubjectsSet = new Set();
        content.forEach((item) => {
          if (item.subjectName) allSubjectsSet.add(item.subjectName);
          else allSubjectsSet.add('General');
        });
        const allSubjects = Array.from(allSubjectsSet).sort();

        setAttendanceData(grouped);
        setSubjectHeaders(allSubjects);
        setTotalElements(response?.data?.totalElements || grouped.length);
      })
      .catch((err) => {
        console.error('Failed to fetch attendance:', err);
        setAttendanceData([]);
        setSubjectHeaders([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  }, [user, page, rowsPerPage]);

  // Derived summary (present/absent counts across the returned page)
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let total = 0;

    let lastDate = null;

    attendanceData.forEach((row) => {
      lastDate = !lastDate ? row.attendanceDate : lastDate;
      Object.values(row.subjects).forEach((vailable) => {
        if (vailable === true) present += 1;
        else if (vailable === false) absent += 1;
        // null / undefined => ignored in counts
        if (vailable === true || vailable === false) total += 1;
      });
    });

    const percentage = total ? Math.round((present / total) * 100) : 0;

    return { present, absent, total, percentage, lastDate };
  }, [attendanceData]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportCsv = () => {
    // Build CSV from grouped attendanceData
    const headers = ['Date', 'Class', 'Division', ...subjectHeaders];
    const rows = attendanceData.map((row) => {
      const date = new Date(row.attendanceDate).toLocaleDateString();
      const base = [date, row.className || '', row.divisionName || ''];
      const subjects = subjectHeaders.map((s) => {
        const v = row.subjects[s];
        return v === true ? 'Present' : v === false ? 'Absent' : '-';
      });
      return [...base, ...subjects];
    });

    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${user?.id || 'student'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader
        title={t("myattendance")}
        subheader="Review your subject-wise attendance — clean, compact and exportable"
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <Button startIcon={<DownloadIcon />} variant="outlined" size="small" onClick={exportCsv} disabled={!attendanceData.length}>
              Export CSV
            </Button>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Student'} • {user?.schoolName || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing recent attendance records. Use export to download CSV for offline review.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <Chip icon={<FilePresentIcon />} label={`Present: ${summary.present}`} color="success" variant="outlined" size="small" />

              <Chip icon={<FileAbsentIcon />} label={`Absent: ${summary.absent}`} color="error" variant="outlined" size="small" />
              <Chip label={`Total: ${summary.total}`} variant="outlined" size="small" />
              <Chip label={`%: ${summary.percentage}%`} variant="outlined" size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Last recorded: {summary.lastDate ? new Date(summary.lastDate).toLocaleDateString() : '—'}
            </Typography>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : attendanceData.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary">
              No attendance records found.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Attendance will appear here once recorded by your school.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 420 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 140 }}>Date</TableCell>
                    {/* <TableCell>Class</TableCell>
                    <TableCell>Division</TableCell> */}
                    {subjectHeaders.map((subject) => (
                      <TableCell key={subject} align="center">
                        <Typography variant="body2" noWrap>
                          {subject}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((row) => (
                    <TableRow key={row.attendanceDate} hover>
                      <TableCell>{new Date(row.attendanceDate).toLocaleDateString()}</TableCell>
                      {/* <TableCell>{row.className || '—'}</TableCell>
                      <TableCell>{row.divisionName || '—'}</TableCell> */}

                      {subjectHeaders.map((subject) => {
                        const vailable = row.subjects[subject];
                        return (
                          <TableCell key={subject} align="center">
                            {vailable === true ? (
                              <Chip size="small" label="Present" color="success" />
                            ) : vailable === false ? (
                              <Chip size="small" label="Absent" color="error" />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                —
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceList;
