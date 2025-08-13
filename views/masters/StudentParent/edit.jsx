import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from '../../../utils/apiService';
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

const EditStudent = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [teacherData, setTeacherData] = useState({
    userName: '',
    password: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    rollno: '',
    schoolId: '',
    classId: '',
    divisionId: ''
  });
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    if (teacherData.classId) {
      setSelectedClass(classes.find((cls) => cls.id === teacherData.classId) || null);
    }
    if (teacherData.divisionId) {
      setSelectedDivision(divisions.find((div) => div.id === teacherData.divisionId) || null);
    }
  }, [classes, divisions, teacherData]);

  const fetchData = async (endpoint, setter) => {
    try {
      const pagination = {
      page: page,
      size: pageSize,
      sortBy: "id",
      sortDir: "asc",
      search: ""
    }
      const response = await api.post(endpoint,pagination);
      setter(response.data.content|| []);
      console.log(`Fetched data from ${endpoint}:`, response.data.content);
      setRowCount(response.totalElements || 0);
      console.log(classes, divisions);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  const Title = userId ? 'Edit Student' : 'Add Student';

  useEffect(() => {
    if (userId) {
      fetchStudentData(userId);
    }
  }, [userId]);

  useEffect(() => {
    fetchData(`api/schoolClasses/getAll/${userDetails.getAccountId()}`, setClasses);
    fetchData(`api/divisions/getAll/${userDetails.getAccountId()}`, setDivisions);
  }, []);

  const fetchStudentData = async (id) => {
    try {
      const response = await api.get(`api/users/getById?id=${id}`);
      setTeacherData(response.data);
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = { ...values, id: teacherData.id, type: 'STUDENT',accountId:userDetails.getAccountId(), status: 'active' };
    try {
      const response = await api.put(`api/users/update`, userData);
      setTeacherData(response.data);
      setSubmitting(false);
      console.log('User updated:', response.data);
      toast.success("Student updated successfully", {autoClose: '500', onClose: () => {
        navigate('/masters/students');
      }})
    } catch (error) {
      console.error('Failed to update teacher data:', error);
    }
  };

  return (
    <MainCard title={Title}>
      <Formik
        enableReinitialize
        initialValues={{ ...teacherData }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* User Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-user-name">User Name</InputLabel>
                  <OutlinedInput
                    id="teacher-user-name"
                    name="userName"
                    value={values.userName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="User Name"
                  />
                  {touched.userName && errors.userName && <FormHelperText error>{errors.userName}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-password">Password</InputLabel>
                  <OutlinedInput
                    id="teacher-password"
                    name="password"
                    type="text"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Password"
                  />
                  {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-name">Name</InputLabel>
                  <OutlinedInput
                    id="teacher-name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="First Name"
                  />
                </FormControl>
              </Grid>

              {/* Mobile No */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-mobile-no">Mobile No</InputLabel>
                  <OutlinedInput
                    id="teacher-mobile-no"
                    type="number"
                    name="mobile"
                    value={values.mobile}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Mobile No"
                  />
                </FormControl>
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-email">Email</InputLabel>
                  <OutlinedInput
                    id="teacher-email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email"
                  />
                </FormControl>
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-address">Address</InputLabel>
                  <OutlinedInput
                    id="teacher-address"
                    name="address"
                    value={values.address}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Address"
                  />
                </FormControl>
              </Grid>

              {/* Roll No */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-address">Roll No</InputLabel>
                  <OutlinedInput
                    id="teacher-roll-number"
                    type="number"
                    name="rollno"
                    value={values.rollno}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="rollno"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <Autocomplete
                  disablePortal
                  value={classes.find((cls) => cls.id === values.classId) || null}
                  options={classes}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('classId', newValue ? newValue.id : '');
                  }}
                  renderInput={(params) => <TextField {...params} label="Class" />}
                />
              </Grid>

              {/* Division Selection */}
              <Grid item xs={3}>
                <Autocomplete
                  disablePortal
                  value={divisions.find((div) => div.id === values.divisionId) || null}
                  options={divisions}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('divisionId', newValue ? newValue.id : '');
                  }}
                  renderInput={(params) => <TextField {...params} label="Division" />}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth type="submit" variant="contained" color="secondary">
                    Save
                  </Button>
                </AnimateButton>
                <BackButton/>

              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditStudent;
