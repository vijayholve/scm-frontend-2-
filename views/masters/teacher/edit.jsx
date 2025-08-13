import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput,
  TextField
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api from '../../../utils/apiService';
import { gridSpacing } from 'store/constant';
import { userDetails } from '../../../utils/apiService';
import BackButton from 'layout/MainLayout/Button/BackButton';
import { useSelector } from 'react-redux';

const EditUsers = ({ ...others }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [teacherData, setTeacherData] = useState({
    userName: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    role: null,
    gender: null,
    schoolId: null,
    type: null
  });

  const Title = userId ? 'Edit Teacher' : 'Add Teacher';

  const [schools, setSchools] = useState([]);
  const user = useSelector(state => state.user);
  console.log("user", user);

  useEffect(() => {
    fetchData(`api/schoolBranches/getAll/${user?.user?.accountId}`, setSchools);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTeacherData(userId);
    }
  }, [userId]);

  const fetchData = async (endpoint, setter) => {
    try {
      const pagination = {
        page: page,
        size: pageSize,
        sortBy: "id",
        sortDir: "asc",
        search: ""
      }
      const response = await api.post(endpoint, pagination);
      setter(response.data.content || []);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData(`api/roles/getAll/${userDetails.getAccountId()}`, setRoles);

  }, []);

  const fetchTeacherData = async (id) => {
    try {
      const response = await api.get(`api/users/getById?id=${id}`);
      setTeacherData(response.data);
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = { ...values, id: teacherData.id, accountId: userDetails.getAccountId() };
    try {
      const response = await api.put(`api/users/update`, userData);
      setTeacherData(response.data);
      setSubmitting(false);
      console.log('User updated:', response.data);
      toast.success("Teacher updated successfully", {
        autoClose: '500', onClose: () => {
          navigate('/masters/teachers');
        }
      })
    } catch (error) {
      console.error('Failed to update teacher data:', error);
    }
  };

  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={teacherData}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values,setFieldValue }) => (
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
                  {touched.userName && errors.userName && (
                    <FormHelperText error>{errors.userName}</FormHelperText>
                  )}
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
                  {touched.password && errors.password && (
                    <FormHelperText error>{errors.password}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* First Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-first-name">First Name</InputLabel>
                  <OutlinedInput
                    id="teacher-first-name"
                    name="firstName"
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="First Name"
                  />
                </FormControl>
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-middle-name">Middle Name</InputLabel>
                  <OutlinedInput
                    id="teacher-middle-name"
                    name="middleName"
                    value={values.middleName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Middle Name"
                  />
                </FormControl>
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-last-name">Last Name</InputLabel>
                  <OutlinedInput
                    id="teacher-last-name"
                    name="lastName"
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Last Name"
                  />
                </FormControl>
              </Grid>

              {/* Mobile No */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-mobile-no">Mobile No</InputLabel>
                  <OutlinedInput
                    id="teacher-mobile-no"
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

              {/* Role Selection */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={roles.find((role) => role.id === values.role?.id) || null}
                  options={roles}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('role', newValue ? newValue : null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Role" />}
                />
              </Grid>
              {/* Gender Selection */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={values.gender}
                  options={['MALE', 'FEMALE']}
                  onChange={(event, newValue) => {
                    setFieldValue('gender', newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Gender" />}
                />
              </Grid>
              {/* School Selection */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={schools.find((school) => school.id === values.schoolId) || null}
                  options={schools}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('schoolId', newValue?.id ? newValue?.id : null);
                  }}
                  renderInput={(params) => <TextField {...params} label="School" />}
                />
              </Grid>
              {/* Type Selection */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={values.type}
                  options={['TEACHER', 'ADMIN', 'STAFF']}
                  onChange={(event, newValue) => {
                    setFieldValue('type', newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Type" />}
                />
              </Grid>
              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
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

export default EditUsers;
