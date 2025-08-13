import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Button, Checkbox, Paper, TextField } from '@mui/material';
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

// Fetcher for API requests


const Attendence = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendenceData, setAttendenceData] = useState([]);
  const [reqData, setReqData] = useState({
    divisionId: null,
    schooldClassId: null,
    subjectId: null,
    date: null
  });

  const fetchData = async (endpoint, setter) => {
    try {
      const payload = {
        page: page,
        size: pageSize,
        sortBy: "id",
        sortDir: "asc",
        search: ""
      }
      const response = await api.post(endpoint, payload);
      setter(response.data.content || []);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  // Fetch all required data
  useEffect(() => {

    fetchData(`api/schoolClasses/getAll/${userDetails.getAccountId()}`, setClasses);
    fetchData(`api/divisions/getAll/${userDetails.getAccountId()}`, setDivisions);
    fetchData(`api/subjects/getAll/${userDetails.getAccountId()}`, setSubjects);
  }, []);

  // Fetch attendance data if editing
  useEffect(() => {
    if (id) {
      api.get(`api/attendance/getById/${id}`).then(response => {
        const data = response.data;
        setAttendenceData(data);
        setReqData({
          schooldClassId: data.schooldClassId,
          divisionId: data.divisionId,
          subjectId: data.subjectId,
          date: dayjs(data.attendanceDate).format('YYYY-MM-DD'),
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

  // Handle attendance submission
  const onHandleClickSubmit = async () => {
    const { schooldClassId, divisionId, subjectId, date, className, subjectName, divisionName } = reqData;
    if (schooldClassId && divisionId && subjectId && date) {
      const payload = {
        attendanceDate: date,
        studentAttendanceMappings: students,
        schooldClassId: schooldClassId,
        divisionId: divisionId,
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
            navigate('/masters/attendances');
          }
        })
      } catch (error) {
        console.error('Failed to update attendance:', error);
      }
    }
  };

  return (
    <MainCard title="Attendance" secondary={<SecondaryAction link="https://next.material-ui.com/system/palette/" />}>
      <Grid container spacing={gridSpacing}>
        {/* Class Selection */}
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            options={classes}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => setReqData({ ...reqData, schooldClassId: value?.id, className: value?.name })}
            renderInput={(params) => <TextField {...params} label="Class" />}
            value={classes.find((st) => st.id === reqData.schooldClassId) || null}
          />
        </Grid>

        {/* Division Selection */}
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            options={divisions}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => setReqData({ ...reqData, divisionId: value?.id, divisionName: value?.name })}
            renderInput={(params) => <TextField {...params} label="Division" />}
            value={divisions.find((st) => st.id === reqData.divisionId) || null}
          />
        </Grid>

        {/* Subject Selection */}
        <Grid item xs={3}>
          <Autocomplete
            disablePortal
            options={subjects}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => setReqData({ ...reqData, subjectId: value?.id, subjectName: value?.name })}
            renderInput={(params) => <TextField {...params} label="Subject" />}
            value={subjects.find((st) => st.id === reqData.subjectId) || null}
          />
        </Grid>

        {/* Date Picker */}
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={reqData.date ? dayjs(reqData.date) : null}
              onChange={(newValue) => setReqData({ ...reqData, date: newValue ? dayjs(newValue).format('YYYY-MM-DD') : null })}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>

        {/* Student Attendance List */}
        <Grid item xs={12}>
          <SubCard title={reqData.className ? `${reqData.className} - ${reqData.divisionName} - ${reqData.subjectName}` : 'Select Class, Division and Subject'}>
            <Grid container spacing={gridSpacing}>
              {students.map((student, index) => (
                <Grid item xs={6} md={4} key={student.rollno}>
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
        <BackButton />
        <Grid item xs={12}>
          <Button variant="contained" sx={{ float: 'right', mt: 1, bgcolor: '#673ab7' }} onClick={onHandleClickSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Attendence;
