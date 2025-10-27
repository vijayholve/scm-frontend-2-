import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  IconButton,
  Paper,
  Select,
  MenuItem
} from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api from '../../../utils/apiService';
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';
import ReusableLoader from 'ui-component/loader/ReusableLoader';

const EditTimetable = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: timetableId } = useParams();

  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [timetableData, setTimetableData] = useState({
    id: undefined,
    schoolId: '',
    schoolName: '',
    className: '',
    classId: '',
    divisionId: '',
    divisionName: '',
    dayTimeTable: [],
    accountId: 0,
    createdBy: 'Unknown User',
    updatedBy: 'Unknown User',
    createdDate: null,
    updatedDate: null
  });

  const { t } = useTranslation('edit');
  const Title = timetableId ? t('timetable.title.edit') : t('timetable.title.add');

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    try {
      const authDataString = localStorage.getItem('SCM-AUTH');
      if (authDataString) {
        const parsedAuthData = JSON.parse(authDataString);
        if (parsedAuthData.status === 'SUCCESS' && parsedAuthData.data) {
          const accountId = parsedAuthData.data.accountId;
          const userName = `${parsedAuthData.data.firstName || ''} ${parsedAuthData.data.lastName || ''}`.trim();
          setLoggedInUserData({ accountId, userName });

          setTimetableData((prevData) => ({
            ...prevData,
            accountId: accountId,
            createdBy: userName,
            updatedBy: userName
          }));
          console.log('User details loaded from localStorage:', { accountId, userName });
        }
      }
    } catch (error) {
      console.error('Failed to parse SCM-AUTH from localStorage:', error);
      toast.error('Failed to load user session data.');
    }
  }, []);

  useEffect(() => {
    if (loggedInUserData?.accountId) {
      // Corrected API calls to use the fetchData helper
      fetchData('api/schoolBranches/getAll', setSchools);
      fetchData('api/schoolClasses/getAll', setClasses);
      fetchData('api/divisions/getAll', setDivisions);
      fetchData('api/subjects/getAll', setSubjects);
      fetchData('api/users/getAllBy', setTeachers, 'TEACHER');
    }
  }, [loggedInUserData?.accountId]);

  const fetchData = async (endpoint, setter, typeFilter = '') => {
    try {
      const accountId = loggedInUserData?.accountId || 0;
      const payload = {
        page: 0,
        size: 1000,
        sortBy: 'id',
        sortDir: 'asc',
        search: ''
      };

      let url = `${endpoint}/${accountId}?type=${typeFilter}`;
      if (typeFilter) {
        payload.type = typeFilter;
      }

      const response = await api.post(url, payload);
      setter(response?.data?.content || []);
    } catch (err) {
      console.error(`Failed to fetch data from ${endpoint}:`, err);
    }
  };

  useEffect(() => {
    if (timetableId) {
      setLoader(true);
      fetchTimetableData(timetableId);
    }
  }, [timetableId, loggedInUserData]);

  const fetchTimetableData = async (id) => {
    try {
      const response = await api.get(`api/timetable/getById?id=${id}`);
      const fetchedData = {
        ...response.data,
        dayTimeTable: response.data.dayTimeTable || [],
        classId: response.data.classId || '',
        divisionId: response.data.divisionId || '',
        createdBy: response.data.createdBy || loggedInUserData?.userName || 'Unknown User',
        updatedBy: loggedInUserData?.userName || 'Unknown User',
        createdDate: response.data.createdDate || null,
        updatedDate: response.data.updatedDate || null
      };
      setTimetableData(fetchedData);
    } catch (error) {
      console.error('Failed to fetch timetable data:', error);
      toast.error('Failed to fetch timetable data.');
    } finally {
      setLoader(false);
    }
  };
  if (loader) {
    return <ReusableLoader message="Loading Timetable..." />;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const userName = loggedInUserData?.userName || 'Unknown User';
    const accountId = loggedInUserData?.accountId || 0;
    const now = new Date().toISOString();

    const finalValues = {
      ...values,
      id: values.id ? Number(values.id) : null,
      schoolId: values.schoolId || '',
      schoolName: values.schoolName || '',
      classId: Number(values.classId) || null,
      className: values.className || '',
      divisionId: Number(values.divisionId) || null,
      divisionName: values.divisionName || '',
      accountId: accountId,
      createdBy: timetableId ? values.createdBy : userName,
      updatedBy: userName,
      createdDate: timetableId ? values.createdDate : now,
      updatedDate: now,
      dayTimeTable: values.dayTimeTable.map((day) => ({
        ...day,
        id: day.id ? Number(day.id) : null,
        accountId: accountId,
        dayName: day.dayName || '',
        tsd: day.tsd.map((slot) => ({
          ...slot,
          id: slot.id ? Number(slot.id) : null,
          type: slot.type || '',
          subjectName: slot.subjectName || '',
          hour: Number(slot.hour) || 0,
          minute: Number(slot.minute) || 0,
          subjectId: Number(slot.subjectId) || 0,
          teacherId: Number(slot.teacherId) || 0,
          teacherName: slot.teacherName || userName,
          sequence: Number(slot.sequence) || 0,
          accountId: accountId
        }))
      }))
    };

    console.log('Payload sent to API:', finalValues);

    try {
      const endpoint = timetableId ? `api/timetable/update/${timetableId}` : `api/timetable/create`;
      const method = timetableId ? api.put : api.post;

      const response = await method(endpoint, finalValues);
      setTimetableData(response.data);
      setSubmitting(false);

      toast.success(`Timetable ${timetableId ? 'updated' : 'saved'} successfully`, {
        autoClose: 500,
        onClose: () => {
          navigate('/masters/timetables');
        }
      });
    } catch (error) {
      console.error(`Failed to ${timetableId ? 'update' : 'save'} timetable data:`, error);
      toast.error(`Failed to ${timetableId ? 'update' : 'save'} timetable.`);
      setSubmitting(false);
    }
  };

  return (
    <MainCard title={Title}>
      <Formik
        enableReinitialize
        initialValues={timetableData}
        validationSchema={Yup.object().shape({
          schoolId: Yup.number().required('School is required').typeError('Please select a school'),
          classId: Yup.number().required('Class is required').typeError('Please select a class'),
          divisionId: Yup.number().required('Division is required').typeError('Please select a division'),
          dayTimeTable: Yup.array().of(
            Yup.object().shape({
              dayName: Yup.string().required('Day Name is required'),
              tsd: Yup.array().of(
                Yup.object().shape({
                  type: Yup.string().required('Type is required'),
                  subjectName: Yup.string().required('Subject Name is required'),
                  hour: Yup.number().min(0).max(23).required('Hour is required').typeError('Must be a number between 0 and 23'),
                  minute: Yup.number().min(0).max(59).required('Minute is required').typeError('Must be a number between 0 and 59'),
                  subjectId: Yup.number().required('Subject is required').typeError('Please select a subject'),
                  sequence: Yup.number().min(1).required('Sequence is required').typeError('Must be a positive number')
                })
              )
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="timetable-school-autocomplete"
                  options={schools}
                  getOptionLabel={(option) => option.name || ''}
                  value={schools.find((sch) => sch.id === values.schoolId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('schoolId', newValue ? newValue.id : '');
                    setFieldValue('schoolName', newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="School"
                      error={Boolean(touched.schoolId && errors.schoolId)}
                      helperText={touched.schoolId && errors.schoolId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="timetable-class-autocomplete"
                  options={classes}
                  getOptionLabel={(option) => option.name || ''}
                  value={classes.find((cls) => cls.id === values.classId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('classId', newValue ? newValue.id : '');
                    setFieldValue('className', newValue ? newValue.name : '');
                    setFieldValue('schoolId', newValue ? newValue.schoolId : '');
                    setFieldValue('schoolName', newValue ? newValue.schoolName : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Class"
                      error={Boolean(touched.classId && errors.classId)}
                      helperText={touched.classId && errors.classId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="timetable-division-autocomplete"
                  options={divisions}
                  getOptionLabel={(option) => option.name || ''}
                  value={divisions.find((div) => div.id === values.divisionId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('divisionId', newValue ? newValue.id : '');
                    setFieldValue('divisionName', newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Division"
                      error={Boolean(touched.divisionId && errors.divisionId)}
                      helperText={touched.divisionId && errors.divisionId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Daily Schedule
                </Typography>
                <FieldArray name="dayTimeTable">
                  {({ push, remove }) => (
                    <Box>
                      {values?.dayTimeTable?.map((day, dayIndex) => (
                        <Paper key={dayIndex} elevation={2} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                          <Grid container spacing={gridSpacing} alignItems="center">
                            <Grid item xs={10}>
                              <Autocomplete
                                disablePortal
                                id={`dayTimeTable-${dayIndex}-dayName`}
                                options={daysOfWeek}
                                value={day.dayName || null}
                                onChange={(event, newValue) => {
                                  setFieldValue(`dayTimeTable.${dayIndex}.dayName`, newValue || '');
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Day Name"
                                    error={Boolean(touched.dayTimeTable?.[dayIndex]?.dayName && errors.dayTimeTable?.[dayIndex]?.dayName)}
                                    helperText={touched.dayTimeTable?.[dayIndex]?.dayName && errors.dayTimeTable?.[dayIndex]?.dayName}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'right' }}>
                              <IconButton color="error" onClick={() => remove(dayIndex)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                Time Slots
                              </Typography>
                              <FieldArray name={`dayTimeTable.${dayIndex}.tsd`}>
                                {({ push: pushTsd, remove: removeTsd }) => (
                                  <Box>
                                    {day.tsd.map((slot, slotIndex) => (
                                      <Paper
                                        key={slotIndex}
                                        elevation={1}
                                        sx={{ p: 2, mb: 2, border: '1px dashed #bdbdbd', borderRadius: '6px' }}
                                      >
                                        <Grid container spacing={gridSpacing} alignItems="center">
                                          <Grid item xs={12} sm={4}>
                                            <FormControl
                                              fullWidth
                                              error={Boolean(
                                                touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type &&
                                                  errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type
                                              )}
                                            >
                                              <InputLabel id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-type-label`}>Type</InputLabel>
                                              <Select
                                                labelId={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-type-label`}
                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-type`}
                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.type`}
                                                value={slot.type}
                                                onChange={handleChange}
                                                label="Type"
                                              >
                                                <MenuItem value="Lecture">Lecture</MenuItem>
                                                <MenuItem value="Lab">Lab</MenuItem>
                                                <MenuItem value="Tutorial">Tutorial</MenuItem>
                                              </Select>
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type && (
                                                  <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].type}</FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <Autocomplete
                                              disablePortal
                                              id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-subject`}
                                              options={subjects}
                                              getOptionLabel={(option) => option.name || ''}
                                              value={subjects.find((sub) => sub.id === slot.subjectId) || null}
                                              onChange={(event, newValue) => {
                                                setFieldValue(
                                                  `dayTimeTable.${dayIndex}.tsd.${slotIndex}.subjectId`,
                                                  newValue ? newValue.id : ''
                                                );
                                                setFieldValue(
                                                  `dayTimeTable.${dayIndex}.tsd.${slotIndex}.subjectName`,
                                                  newValue ? newValue.name : ''
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="Subject"
                                                  error={Boolean(
                                                    touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId &&
                                                      errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId
                                                  )}
                                                  helperText={
                                                    touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId &&
                                                    errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.subjectId
                                                  }
                                                />
                                              )}
                                            />
                                          </Grid>
                                          <Grid item xs={6} sm={2}>
                                            <FormControl
                                              fullWidth
                                              error={Boolean(
                                                touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour &&
                                                  errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour
                                              )}
                                            >
                                              <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-hour`}>Hour</InputLabel>
                                              <OutlinedInput
                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-hour`}
                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.hour`}
                                                value={slot.hour}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Hour"
                                                type="number"
                                                inputProps={{ min: 0, max: 23 }}
                                              />
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour && (
                                                  <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].hour}</FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={6} sm={2}>
                                            <FormControl
                                              fullWidth
                                              error={Boolean(
                                                touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute &&
                                                  errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute
                                              )}
                                            >
                                              <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-minute`}>Minute</InputLabel>
                                              <OutlinedInput
                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-minute`}
                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.minute`}
                                                value={slot.minute}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Minute"
                                                type="number"
                                                inputProps={{ min: 0, max: 59 }}
                                              />
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute && (
                                                  <FormHelperText error>
                                                    {errors.dayTimeTable[dayIndex].tsd[slotIndex].minute}
                                                  </FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <FormControl
                                              fullWidth
                                              error={Boolean(
                                                touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence &&
                                                  errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence
                                              )}
                                            >
                                              <InputLabel htmlFor={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-sequence`}>
                                                Sequence
                                              </InputLabel>
                                              <OutlinedInput
                                                id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-sequence`}
                                                name={`dayTimeTable.${dayIndex}.tsd.${slotIndex}.sequence`}
                                                value={slot.sequence}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Sequence"
                                                type="number"
                                              />
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.sequence && (
                                                  <FormHelperText error>
                                                    {errors.dayTimeTable[dayIndex].tsd[slotIndex].sequence}
                                                  </FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <Autocomplete
                                              disablePortal
                                              id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-teacher`}
                                              options={teachers}
                                              getOptionLabel={(option) => option.firstName + ' ' + option.lastName || ''}
                                              value={teachers.find((teacher) => teacher.id === slot.teacherId) || null}
                                              onChange={(event, newValue) => {
                                                setFieldValue(
                                                  `dayTimeTable.${dayIndex}.tsd.${slotIndex}.teacherId`,
                                                  newValue ? newValue.id : ''
                                                );
                                                setFieldValue(
                                                  `dayTimeTable.${dayIndex}.tsd.${slotIndex}.teacherName`,
                                                  newValue ? newValue.firstName + ' ' + newValue.lastName : ''
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="Teacher"
                                                  error={Boolean(
                                                    touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.teacherId &&
                                                      errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.teacherId
                                                  )}
                                                  helperText={
                                                    touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.teacherId &&
                                                    errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.teacherId
                                                  }
                                                />
                                              )}
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                                            <IconButton color="error" onClick={() => removeTsd(slotIndex)}>
                                              <DeleteIcon />
                                            </IconButton>
                                          </Grid>
                                        </Grid>
                                      </Paper>
                                    ))}
                                    <Button
                                      variant="outlined"
                                      startIcon={<AddIcon />}
                                      onClick={() =>
                                        pushTsd({
                                          id: 0,
                                          type: '',
                                          subjectName: '',
                                          hour: 0,
                                          minute: 0,
                                          subjectId: '',
                                          teacherId: '',
                                          teacherName: loggedInUserData?.userName || 'Unknown User',
                                          sequence: day.tsd.length > 0 ? Math.max(...day.tsd.map((s) => s.sequence)) + 1 : 1,
                                          accountId: loggedInUserData?.accountId || 0
                                        })
                                      }
                                      sx={{ mt: 1 }}
                                    >
                                      Add Time Slot
                                    </Button>
                                  </Box>
                                )}
                              </FieldArray>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          push({
                            id: 0,
                            dayName: '',
                            tsd: [],
                            accountId: loggedInUserData?.accountId || 0
                          })
                        }
                        sx={{ mt: 2 }}
                      >
                        Add Day
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>

              <Grid item xs={12} container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} sm="auto">
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="secondary"
                      startIcon={<SaveIcon />}
                      sx={{ minWidth: 180 }}
                    >
                      {timetableId ? 'Update Timetable' : 'Save Timetable'}
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid item xs={12}>
                  <BackButton />
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditTimetable;
