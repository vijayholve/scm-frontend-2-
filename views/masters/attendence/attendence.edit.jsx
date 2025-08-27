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

  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);
  const [reqData, setReqData] = useState({
    schoolId: null,
    schooldClassId: null,
    divisionId: null,
    subjectId: null,
    date: null,
    schoolName: '',
    className: '',
    divisionName: '',
    subjectName: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(endpoint);
      setter(response.data || []);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  // Fetch all required data
  useEffect(() => {
    fetchData(`api/schoolBranches/getAllBy/${userDetails.getAccountId()}`, setSchools);
    fetchData(`api/schoolClasses/getAllBy/${userDetails.getAccountId()}`, setClasses);
    fetchData(`api/divisions/getAllBy/${userDetails.getAccountId()}`, setDivisions);
    fetchData(`api/subjects/getAllBy/${userDetails.getAccountId()}`, setSubjects);
  }, []);

  // Fetch attendance data if editing
  useEffect(() => {
    if (id) {
      api.get(`api/attendance/getById/${id}`).then(response => {
        const data = response.data;
        setAttendenceData(data);
        setReqData({
          schoolId: data.schoolId,
          schooldClassId: data.schooldClassId,
          divisionId: data.divisionId,
          subjectId: data.subjectId,
          date: dayjs(data.attendanceDate).format('YYYY-MM-DD'),
          schoolName: data.schoolName,
          className: data.className,
          subjectName: data.subjectName,
          divisionName: data.divisionName
        });
        setStudents(data.studentAttendanceMappings || []);  
      }).catch(err => console.error('Failed to fetch attendance data:', err));
    }
  }, [id]);

  // Fetch attendance data based on selection
  useEffect(() => {
    const { schooldClassId, divisionId, subjectId, date } = reqData;
    if (schooldClassId && divisionId && subjectId && date) {
      fetchAttendance(schooldClassId, divisionId, subjectId, date);

    }
  }, [reqData]);

  // Fetch students based on selected class and division
  const fetchAttendance = async (schooldClassId, divisionId, subjectId, date) => {
    const url = `api/attendance/getAttendanceBy/${userDetails.getAccountId()}?divisionId=${divisionId}&classId=${schooldClassId}&subjectId=${subjectId}&date=${date}`;
    try {
      const response = await api.get(url);
      setAttendenceData(response.data || []);
      setStudents(response.data.studentAttendanceMappings || []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    }
  }

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
    if (!reqData.schooldClassId) {
      errors.schooldClassId = 'Class is required';
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
      toast.error("Please fill all required fields");
      return;
    }

    const { schooldClassId, divisionId, subjectId, date, className, subjectName, divisionName, schoolId, schoolName } = reqData;
    
    const payload = {
      attendanceDate: date,
      studentAttendanceMappings: students,
      schooldClassId: schooldClassId,
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
      toast.success("Attendance updated successfully", {
        autoClose: '500', onClose: () => {
          navigate('/masters/attendance/list');
        }
      })
    } catch (error) {
      console.error('Failed to update attendance:', error);
      toast.error("Failed to update attendance. Please try again.");
    }
  };

  return (
    <MainCard title="Attendance">
    {/* ... (rest of your component logic) ... */}
  
    {/* All selection fields in a single responsive row */}
    <Grid container spacing={gridSpacing} sx={{ p: 2 }}>
      {/* School */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Autocomplete
          disablePortal
          options={schools}
          getOptionLabel={(option) => option.name}
          onChange={(event, value) => {
            setReqData({ ...reqData, schoolId: value?.id, schoolName: value?.name });
            if (validationErrors.schoolId) {
              setValidationErrors({ ...validationErrors, schoolId: null });
            }
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="School *" 
              error={showValidation && !!validationErrors.schoolId}
              helperText={showValidation && validationErrors.schoolId}
            />
          )}
          value={schools.find((st) => st.id === reqData.schoolId) || null}
          fullWidth
        />
      </Grid>
      {/* Class */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Autocomplete
          disablePortal
          options={classes}
          getOptionLabel={(option) => option.name}
          onChange={(event, value) => {
            setReqData({ ...reqData, schooldClassId: value?.id, className: value?.name });
            if (validationErrors.schooldClassId) {
              setValidationErrors({ ...validationErrors, schooldClassId: null });
            }
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Class *" 
              error={showValidation && !!validationErrors.schooldClassId}
              helperText={showValidation && validationErrors.schooldClassId}
            />
          )}
          value={classes.find((st) => st.id === reqData.schooldClassId) || null}
          fullWidth
        />
      </Grid>
      {/* Division */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <Autocomplete
          disablePortal
          options={divisions}
          getOptionLabel={(option) => option.name}
          onChange={(event, value) => {
            setReqData({ ...reqData, divisionId: value?.id, divisionName: value?.name });
            if (validationErrors.divisionId) {
              setValidationErrors({ ...validationErrors, divisionId: null });
            }
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Division *" 
              error={showValidation && !!validationErrors.divisionId}
              helperText={showValidation && validationErrors.divisionId}
            />
          )}
          value={divisions.find((st) => st.id === reqData.divisionId) || null}
          fullWidth
        />
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
        <SubCard title={reqData.className ? `${reqData.className} - ${reqData.divisionName} - ${reqData.subjectName}` : 'Select Class, Division and Subject'}>
          <Grid container spacing={2}>
            {students.map((student, index) => (
              <Grid item xs={12} sm={6} md={4} key={student.rollno}>
                <Item>
                  <Avatar sx={{ bgcolor: '#673ab7', color: '#fff' }}>S</Avatar>
                  <div style={{ paddingLeft: '10px', minWidth: '200px' }}>
                    {student.studentName}
                    <p style={{ marginTop: 0, marginBottom: 0 }}>Roll No: {student.studentRollNo}</p>
                  </div>
                  <Checkbox
                    edge="end"
                    checked={!!student.vailable}
                    onChange={() => handleToggle(index)}
                    sx={{ position: 'absolute', right: '22px' }}
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
                    title={id?  "Update":"Save"}
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