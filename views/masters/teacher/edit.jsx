import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput,
  TextField, Tabs, Tab, Typography, AppBar, Stack
} from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from 'utils/apiService';
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';
import SaveButton from 'layout/MainLayout/Button/SaveButton';
import { useSelector } from 'react-redux';

// Helper component for Tab Panel content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Function to generate accessibility props for tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

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
    type: null,
    educations: []
  });

  const Title = userId ? 'Edit Teacher' : 'Add Teacher';

  const [schools, setSchools] = useState([]);
  const user = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState(0); // Initialize tabValue using useState
  
  // Define handleTabChange function
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
    }
    catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData(`api/roles/getAll/${userDetails.getAccountId()}`, setRoles);
  }, []);

  const fetchTeacherData = async (id) => {
    try {
      const response = await api.get(`api/users/getById?id=${id}`);
      const data = response.data || {};
      const normalizedEducations = Array.isArray(data.educations)
        ? data.educations
        : (data.educations ? [data.educations] : []);
      setTeacherData({ ...data, educations: normalizedEducations });
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = { ...values, id: teacherData.id, accountId: userDetails.getAccountId() };
    try {
      const apiCall = userId ? api.put(`api/users/update`, userData) : api.post(`api/users/save`, userData);
      const response = await apiCall;
      setTeacherData(response.data);
      toast.success(userId ? 'Teacher updated successfully' : 'Teacher created successfully', {
        autoClose: '100', onClose: () => {
          navigate('/masters/teachers');
        }
      });
      // setSubmitting(false);
    } catch (error) {
      console.error('Failed to submit teacher data:', error);
    }
    finally{
      setSubmitting(false);
    }
  };

  // Options for Higher Qualification Autocomplete
  const higherQualificationOptions = ['10th','12th', 'Graduation', 'PhD', 'Master'];

  // Generate years for Pass Out Year Autocomplete
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (1900 + i).toString());


  return (
    <MainCard title={Title}>
      <Box sx={{ width: '100%', mb: 2 }}>
        <AppBar position="static" color="default" elevation={0}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="teacher form tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Basic Details" {...a11yProps(0)} />
            <Tab label="Education" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
      </Box>

      <Formik
        enableReinitialize
        initialValues={teacherData}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          educations: Yup.array().of(
            Yup.object().shape({
              higherQualification: Yup.string().required('Higher Qualification is required'),
              institutionName: Yup.string().required('School/College Name is required'),
              boardOrUniversity: Yup.string().required('Board/University Name is required'),
              passOutYear: Yup.number()
                .typeError('Pass Out Year is required')
                .required('Pass Out Year is required')
                .min(1900)
                .max(currentYear),
              percentage: Yup.number()
                .typeError('Percentage is required')
                .required('Percentage is required')
                .min(0)
                .max(100)
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <TabPanel value={tabValue} index={0}>
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
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <FieldArray name="educations">
                {({ push, remove }) => (
                  <Box>
                    {values.educations && values.educations.length > 0 ? (
                      values.educations.map((edu, index) => (
                        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">Education {index + 1}</Typography>
                            <Button color="error" size="small" onClick={() => remove(index)} disabled={values.educations.length === 1}>
                              Remove
                            </Button>
                          </Stack>
                          <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                disablePortal
                                options={higherQualificationOptions}
                                value={edu.higherQualification || null}
                                onBlur={handleBlur}
                                onChange={(event, newValue) => {
                                  setFieldValue(`educations[${index}].higherQualification`, newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Higher Qualification" />}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor={`school-college-name-${index}`}>School/College Name</InputLabel>
                                <OutlinedInput
                                  id={`school-college-name-${index}`}
                                  name={`educations[${index}].institutionName`}
                                  value={edu.institutionName || ''}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  label="School/College Name"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor={`university-name-${index}`}>Board/University Name</InputLabel>
                                <OutlinedInput
                                  id={`university-name-${index}`}
                                  name={`educations[${index}].boardOrUniversity`}
                                  value={edu.boardOrUniversity || ''}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  label="Board/University Name"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                disablePortal
                                options={years}
                                value={edu.passOutYear ? edu.passOutYear.toString() : null}
                                onBlur={handleBlur}
                                onChange={(event, newValue) => {
                                  setFieldValue(`educations[${index}].passOutYear`, newValue ? parseInt(newValue, 10) : null);
                                }}
                                renderInput={(params) => <TextField {...params} label="Pass Out Year" />}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor={`education-percentage-${index}`}>Percentage</InputLabel>
                                <OutlinedInput
                                  id={`education-percentage-${index}`}
                                  name={`educations[${index}].percentage`}
                                  type="number"
                                  value={edu.percentage || ''}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  label="Percentage"
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary" sx={{ mb: 2 }}>No education records. Add one below.</Typography>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        push({
                          higherQualification: null,
                          institutionName: '',
                          boardOrUniversity: '',
                          passOutYear: null,
                          percentage: ''
                        })
                      }
                    >
                      Add Education
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </TabPanel>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <BackButton BackUrl="/masters/teachers" />
                <SaveButton
                  onClick={handleSubmit} // Pass the handleSubmit function
                  isSubmitting={isSubmitting} // Pass the Formik isSubmitting state
                  title={userId ? 'Update' : 'Save'} // Dynamic title based on add/edit mode
                  color="secondary" // Or 'primary', 'success', etc.
                />
              </Stack>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditUsers;
