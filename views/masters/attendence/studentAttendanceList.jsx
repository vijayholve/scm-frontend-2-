import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// You may need to adjust the import path for your apiService
import api from '../../../utils/apiService';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination
} from '@mui/material';

// Helper to process API data into grouped rows by attendanceDate
function groupAttendanceByDate(content) {
  // Map: { attendanceDate: { className, divisionName, subjects: { subjectName: vailable } } }
  const grouped = {};

  content.forEach((item) => {
    const date = item.attendanceDate;
    if (!grouped[date]) {
      grouped[date] = {
        className: item.className,
        divisionName: item.divisionName,
        subjects: {}
      };
    }
    // Find vailable value from studentAttendanceMappings (should be only one per item)
    let vailable = null;
    if (
      Array.isArray(item.studentAttendanceMappings) &&
      item.studentAttendanceMappings.length > 0
    ) {
      vailable = item.studentAttendanceMappings[0].vailable;
    }
    grouped[date].subjects[item.subjectName || 'Unknown'] = vailable;
  });

  // Convert to array and sort by attendanceDate descending (latest first)
  return Object.entries(grouped)
    .map(([date, data]) => ({
      attendanceDate: date,
      className: data.className,
      divisionName: data.divisionName,
      subjects: data.subjects
    }))
    .sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate));
}

const StudentAttendanceList = () => {
  const user = useSelector((state) => state.user.user);
  const [attendanceData, setAttendanceData] = useState([]);
  const [subjectHeaders, setSubjectHeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    if (!user?.accountId || !user?.id) return;

    setLoading(true);
    api
      .post(
        `/api/attendance/getStudentAttendance/${user.accountId}/${user.id}`,
        {
          page,
          size: rowsPerPage,
          sortBy: 'id',
          sortDir: 'asc'
        }
      )
      .then((response) => {
        console.log("response", response);
        const content = response?.data?.content || [];
        const grouped = groupAttendanceByDate(content);
        console.log(grouped);

        // Collect all unique subject names for table headers
        const allSubjectsSet = new Set();
        content.forEach((item) => {
          if (item.subjectName) allSubjectsSet.add(item.subjectName);
        });
        const allSubjects = Array.from(allSubjectsSet);

        setAttendanceData(grouped);
        setSubjectHeaders(allSubjects);
        setTotalElements(response?.data?.totalElements || 0);
      })
      .catch((err) => {
        setAttendanceData([]);
        setSubjectHeaders([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  }, [user, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Student Attendance List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Division</TableCell>
                  {subjectHeaders.map((subject) => (
                    <TableCell key={subject}>{subject}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((row) => (
                  <TableRow key={row.attendanceDate}>
                    <TableCell>{row.attendanceDate}</TableCell>
                    <TableCell>{row.className || '-'}</TableCell>
                    <TableCell>{row.divisionName || '-'}</TableCell>
                    {subjectHeaders.map((subject) => {
                      const vailable = row.subjects[subject];
                      return (
                        <TableCell key={subject}>
                          {vailable === true
                            ? 'Present'
                            : vailable === false
                            ? 'Absent'
                            : '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Paper>
  );
};

export default StudentAttendanceList;
