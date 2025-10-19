import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Button, Checkbox, Paper, TextField, Alert, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Autocomplete } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import api, { userDetails } from '../../../utils/apiService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'layout/MainLayout/Button/BackButton';
import BackSaveButton from 'layout/MainLayout/Button/BackSaveButton';
import ReusableLoader from 'ui-component/loader/ReusableLoader';

// new import: reusable SCD selector
import SCDSelector from 'ui-component/SCDSelector';

// Styled component for items
const Item = styled(Paper)(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#D3D3D3',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  position: 'relative',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027'
  })
}));

const AttendenceEdit = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reqData, setReqData] = useState({
    schoolId: null,
    classId: null,
    divisionId: null,
    subjectId: null,
    date: null,
    schoolName: '',
    className: '',
    divisionName: '',
    subjectName: ''
  });
  // Note: schools/classes/divisions come from SCDSelector/useSCDData centrally.
  // reqData keeps the selected ids/names for submission. The SCDSelector adapter below maps fields.

  const [validationErrors, setValidationErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  // Fetch subjects only (S/C/D comes from SCDProvider via SCDSelector)
  useEffect(() => {
    let mounted = true;
    const loadSubjects = async () => {
      try {
        const res = await api.get(`api/subjects/getAllBy/${userDetails.getAccountId()}`);
        if (!mounted) return;
        setSubjects(res.data || []);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      }
    };
    loadSubjects();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch attendance data if editing
  useEffect(() => {
    if (id) {
      api
        .get(`api/attendance/getById/${id}`)
        .then((response) => {
          const data = response.data;
          setAttendenceData(data);
          setReqData({
            schoolId: data.schoolId,
            classId: data.classId,
            divisionId: data.divisionId,
            subjectId: data.subjectId,
            date: dayjs(data.attendanceDate).format('YYYY-MM-DD'),
            schoolName: data.schoolName,
            className: data.className,
            subjectName: data.subjectName,
            divisionName: data.divisionName
          });
          setStudents(data.studentAttendanceMappings || []);
        })
        .catch((err) => console.error('Failed to fetch attendance data:', err));
    }
  }, [id]);

  // Fetch attendance data based on selection
  useEffect(() => {
    const { classId, divisionId, subjectId, date } = reqData;
    if (classId && divisionId && subjectId && date) {
      fetchAttendance(classId, divisionId, subjectId, date);
    }
  }, [reqData]);

  // Fetch students based on selected class and division
  const fetchAttendance = async (classId, divisionId, subjectId, date) => {
    setLoading(true);
    const url = `api/attendance/getAttendanceBy/${userDetails.getAccountId()}?divisionId=${divisionId}&classId=${classId}&subjectId=${subjectId}&date=${date}`;
    try {
      const response = await api.get(url);
      setAttendenceData(response.data || []);
      setStudents(response.data.studentAttendanceMappings || []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    }
    setLoading(false);
  };

  // SCDSelector adapter for this non-Formik form:
  // SCDSelector calls setFieldValue('schoolId'|'classId'|'divisionId', value)
  // We map 'classId' -> reqData.classId to keep existing payload shape.
  const scdAdapter = {
    values: {
      schoolId: reqData.schoolId,
      classId: reqData.classId,
      divisionId: reqData.divisionId
    },
    setFieldValue: (field, value) => {
      if (field === 'classId') {
        setReqData((prev) => ({ ...prev, classId: value }));
      } else {
        setReqData((prev) => ({ ...prev, [field]: value }));
      }
      // clear dependent names when id changes so UI label updates correctly
      if (field === 'schoolId') {
        setReqData((prev) => ({ ...prev, className: '', divisionName: '' }));
      } else if (field === 'classId') {
        setReqData((prev) => ({ ...prev, className: '', divisionName: '' }));
      } else if (field === 'divisionId') {
        setReqData((prev) => ({ ...prev, divisionName: '' }));
      }
    },
    touched: {},
    errors: {}
  };

  // Handle attendance toggle for students
  const handleToggle = (index) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, idx) => (idx === index ? { ...student, vailable: !student.vailable } : student))
    );
  };

  // Validate required fields
  const validateForm = () => {
    const errors = {};

    if (!reqData.schoolId) {
      errors.schoolId = 'School is required';
    }
    if (!reqData.classId) {
      errors.classId = 'Class is required';
    }
    if (!reqData.divisionId) {
      errors.divisionId = 'Division is required';
    }
    if (!reqData.subjectId) {
      errors.subjectId = 'Subject is required';
    }
    if (!reqData.date) {
      errors.date = 'Date is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle attendance submission
  const onHandleClickSubmit = async () => {
    setShowValidation(true);

    // Validate form
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    const { classId, divisionId, subjectId, date, className, subjectName, divisionName, schoolId, schoolName } = reqData;

    const payload = {
      attendanceDate: date,
      studentAttendanceMappings: students,
      classId: classId,
      divisionId: divisionId,
      schoolId: schoolId,
      schoolName: schoolName,
      teacherId: 1,
      subjectId: subjectId,
      className: className,
      subjectName: subjectName,
      divisionName: divisionName,
      accountId: userDetails.getAccountId(),
      id: attendenceData.id || null
    };

    try {
      const response = await api.post('api/attendance/save', payload);
      console.log('Attendance updated:', response.data);
      toast.success('Attendance updated successfully', {
        autoClose: '500',
        onClose: () => {
          navigate('/masters/attendance/list');
        }
      });
    } catch (error) {
      console.error('Failed to update attendance:', error);
      toast.error('Failed to update attendance. Please try again.');
    }
  };
  if (loading) {
    return <ReusableLoader></ReusableLoader>;
  }
  return (
    <MainCard title="Attendance">
      {/* ... (rest of your component logic) ... */}

      {/* All selection fields in a single responsive row */}
      <Grid container spacing={gridSpacing} sx={{ p: 2 }}>
        {/* School / Class / Division (reusable SCD selector) */}
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <SCDSelector formik={scdAdapter} />
        </Grid>

        {/* Subject */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Autocomplete
            disablePortal
            options={subjects}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setReqData({ ...reqData, subjectId: value?.id, subjectName: value?.name });
              if (validationErrors.subjectId) {
                setValidationErrors({ ...validationErrors, subjectId: null });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subject *"
                error={showValidation && !!validationErrors.subjectId}
                helperText={showValidation && validationErrors.subjectId}
              />
            )}
            value={subjects.find((st) => st.id === reqData.subjectId) || null}
            fullWidth
          />
        </Grid>
        {/* Date Picker */}
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date *"
              value={reqData.date ? dayjs(reqData.date) : null}
              onChange={(newValue) => {
                setReqData({ ...reqData, date: newValue ? dayjs(newValue).format('YYYY-MM-DD') : null });
                if (validationErrors.date) {
                  setValidationErrors({ ...validationErrors, date: null });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={showValidation && !!validationErrors.date}
                  helperText={showValidation && validationErrors.date}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        {/* Student Attendance List */}
        <Grid item xs={12}>
          <SubCard
            title={
              reqData.className
                ? `${reqData.className} - ${reqData.divisionName} - ${reqData.subjectName}`
                : 'Select Class, Division and Subject'
            }
          >
            <Grid container spacing={2}>
              {students.map((student, index) => (
                <Grid item xs={12} sm={6} md={4} key={student.rollno}>
                  <Item
                    sx={{
                      backgroundColor: student.vailable ? '#C8E6C9' : '#FFCDD2',
                      border: student.vailable ? '2px solid #4caf50' : '2px solid #f44336',
                      '&:hover': {
                        boxShadow: theme.shadows[6],
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleToggle(index)}
                  >
                    <Avatar sx={{ bgcolor: student.vailable ? '#4caf50' : '#f44336', color: '#fff' }}>
                      {student.studentName ? student.studentName.charAt(0).toUpperCase() : 'S'}
                    </Avatar>
                    <div style={{ paddingLeft: '10px', minWidth: '200px' }}>
                      {student.studentName}
                      <p style={{ marginTop: 0, marginBottom: 0 }}>Roll No: {student.studentRollNo}</p>
                    </div>

                    <Checkbox
                      edge="end"
                      checked={!!student.vailable}
                      onChange={() => handleToggle(index)}
                      sx={{ position: 'absolute', right: '22px' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </SubCard>
        </Grid>
        {/* Submit Button */}
        <Grid item xs={12}>
          <BackSaveButton
            title={id ? 'Update' : 'Save'}
            backUrl="/masters/attendances"
            isSubmitting={false}
            onSaveClick={onHandleClickSubmit}
          ></BackSaveButton>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default AttendenceEdit;
