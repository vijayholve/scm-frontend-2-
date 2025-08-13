import React, { useState, useEffect } from 'react';
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

// Assuming these are correctly imported from your project structure
// Please ensure these paths are correct for your application.
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api from '../../../utils/apiService'; // API service (userDetails import removed as it's now handled locally)
import { gridSpacing } from 'store/constant'; // Grid spacing constant
import BackButton from 'layout/MainLayout/Button/BackButton';

const EditTimetable = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  // Extract timetable ID from URL parameters for editing existing timetables
  const { id: timetableId } = useParams();

  // State to store parsed user data from localStorage
  const [loggedInUserData, setLoggedInUserData] = useState(null);

  // Initial state for the timetable data with safe defaults
  const [timetableData, setTimetableData] = useState({
    id: undefined, // Will be set if editing an existing timetable
    schoolId: '',
    schoolName: '',
    className: '',
    classId: '', // CHANGED: from classId to classId
    divisionId: '', // Stores the ID of the selected division
    divisionName: '',
    dayTimeTable: [], // Array to hold daily schedule objects
    // Initialize with safe fallbacks; these will be updated once localStorage is read
    accountId: 0,
    createdBy: 'Unknown User',
    updatedBy: 'Unknown User',
    createdDate: null, // Added createdDate
    updatedDate: null // Added updatedDate
  });

  // Determine the title of the card based on whether it's an add or edit operation
  const Title = timetableId ? 'Edit Timetable' : 'Add Timetable';

  // State variables for dropdown options
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  // Define the static list of days for the dropdown
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Effect to read user details from localStorage on component mount
  useEffect(() => {
    try {
      const authDataString = localStorage.getItem('SCM-AUTH');
      if (authDataString) {
        const parsedAuthData = JSON.parse(authDataString);
        if (parsedAuthData.status === 'SUCCESS' && parsedAuthData.data) {
          const accountId = parsedAuthData.data.accountId;
          const userName = `${parsedAuthData.data.firstName || ''} ${parsedAuthData.data.lastName || ''}`.trim();
          setLoggedInUserData({ accountId, userName });

          // Update initial timetableData with fetched user details
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
  }, []); // Empty dependency array means this runs once on mount

  // Fetch initial data for all Autocomplete dropdowns on component mount
  useEffect(() => {
    // Ensure loggedInUserData is available before fetching data that depends on accountId
    if (loggedInUserData?.accountId) {
      fetchData('api/schoolClasses/getAllBy', setClasses);
      fetchData('api/divisions/getAllBy', setDivisions);
      fetchData('api/subjects/getAllBy', setSubjects);
      // Fetch teachers with type=TEACHER (assuming api/users/getAll handles this filter)
      fetchData('api/users/getAllBy', setTeachers, 'TEACHER');
      fetchData('api/schoolBranches/getAllBy', setSchools);
    }
  }, [loggedInUserData?.accountId]); // Depend on loggedInUserData.accountId

  /**
   * Generic asynchronous function to fetch data for dropdowns.
   * This function consistently uses api.post for 'getAll' endpoints with a pagination payload.
   * It also supports adding a 'type' query parameter for specific endpoints like teachers.
   * @param {number} page - The page number for pagination.
   * @param {number} pageSize - The number of items per page.
   * @param {string} endpoint - The API endpoint to fetch data from.
   * @param {Function} setter - The state setter function to update the fetched data.
   * @param {string} [typeFilter] - Optional filter for user type (e.g., 'TEACHER').
   */
  const fetchData = async (endpoint, setter, typeFilter = '') => {
    try {
      const accountId = loggedInUserData?.accountId || 0; // Use accountId from loggedInUserData
      let url = `${endpoint}/${accountId}?type=${typeFilter}`; // Base URL
      const response = await api.get(url); // Use api.post with the payload

      setter(response?.data || []); // Update state with fetched data
      // Log subjects data to console for debugging
     
    } catch (err) {
      console.error(`Failed to fetch data from ${endpoint}:`, err);
    }
  };

  // Fetch existing timetable data if timetableId is present (for edit mode)
  useEffect(() => {
    if (timetableId) {
      fetchTimetableData(timetableId);
    }
  }, [timetableId, loggedInUserData]);

  const fetchTimetableData = async (id) => {
    try {
      const response = await api.get(`api/timetable/getById?id=${id}`);
      // Ensure dayTimeTable and tsd are arrays to prevent errors if API returns null/undefined
      const fetchedData = {
        ...response.data,
        dayTimeTable: response.data.dayTimeTable || [],
        classId: response.data.classId || '', // CHANGED: from classId to classId
        divisionId: response.data.divisionId || '', // Ensure divisionId is set for Autocomplete
        // Safely set createdBy and updatedBy from fetched data or loggedInUserData
        createdBy: response.data.createdBy || loggedInUserData?.userName || 'Unknown User',
        updatedBy: loggedInUserData?.userName || 'Unknown User', // Always update updatedBy on fetch for consistency
        createdDate: response.data.createdDate || null, // Preserve fetched createdDate
        updatedDate: response.data.updatedDate || null // Preserve fetched updatedDate
      };
      setTimetableData(fetchedData); // Update the form's initial values
    } catch (error) {
      console.error('Failed to fetch timetable data:', error);
      toast.error('Failed to fetch timetable data.');
    }
  };

  /**
   * Handles the form submission for saving or updating a timetable.
   * @param {object} values - The form values from Formik.
   * @param {object} { setSubmitting } - Formik helper function to manage submission state.
   */
  const handleSubmit = async (values, { setSubmitting }) => {
    // Determine the user name and account ID to be used
    const userName = loggedInUserData?.userName || 'Unknown User';
    const accountId = loggedInUserData?.accountId || 0;
    const now = new Date().toISOString(); // Get current timestamp in ISO format

    // Prepare the payload for the API call
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
          teacherName: slot.teacherName ||  userName,
          teacherId: Number(slot.teacherId) || 0,
          teacherName: slot.teacherName ||  userName,
          sequence: Number(slot.sequence) || 0,
          accountId: accountId
        }))
      }))
    };

    // Log the final payload before sending for debugging
    console.log('Payload sent to API:', finalValues);

    try {
      // Determine the API endpoint and HTTP method based on whether it's an edit or add operation
      const endpoint = timetableId ? `api/timetable/update/${timetableId}` : `api/timetable/create`;
      const method = timetableId ? api.put : api.post;

      const response = await method(endpoint, finalValues); // Make the API call
      setTimetableData(response.data); // Update state with the response data
      setSubmitting(false); // End submission state

      // Show success toast and navigate away after a short delay
      toast.success(`Timetable ${timetableId ? 'updated' : 'saved'} successfully`, {
        autoClose: 500, // Close after 500ms
        onClose: () => {
          navigate('/masters/timetables'); // Redirect to the timetables list page
        }
      });
    } catch (error) {
      console.error(`Failed to ${timetableId ? 'update' : 'save'} timetable data:`, error);
      toast.error(`Failed to ${timetableId ? 'update' : 'save'} timetable.`);
      setSubmitting(false); // Ensure submission state is reset on error
    }
  };

  return (
    <MainCard title={Title}>
      <Formik
        enableReinitialize // Important to re-initialize form when timetableData changes (e.g., after fetching data for edit)
        initialValues={timetableData}
        validationSchema={Yup.object().shape({
          schoolId: Yup.number().required('School is required').typeError('Please select a school'),
          classId: Yup.number().required('Class is required').typeError('Please select a class'), // CHANGED: from classId to classId
          divisionId: Yup.number().required('Division is required').typeError('Please select a division'),
          dayTimeTable: Yup.array().of(
            // Validation for the array of daily schedules
            Yup.object().shape({
              dayName: Yup.string().required('Day Name is required'), // Validation for dayName
              tsd: Yup.array().of(
                // Validation for the array of time slots within each day
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
              {/* School Autocomplete (Selection) */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="timetable-school-autocomplete"
                  options={schools}
                  getOptionLabel={(option) => option.name || ''}
                  // Set the value of the Autocomplete based on the schoolId in formik values
                  value={schools.find((sch) => sch.id === values.schoolId) || null}
                  onChange={(event, newValue) => {
                    // Update schoolId in Formik state when a school is selected
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

              {/* Class Autocomplete (Selection) */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="timetable-class-autocomplete"
                  options={classes}
                  getOptionLabel={(option) => option.name || ''}
                  // Set the value of the Autocomplete based on the classId in formik values
                  value={classes.find((cls) => cls.id === values.classId) || null} // CHANGED: from classId to classId
                  onChange={(event, newValue) => {
                    // Update classId in Formik state when a class is selected
                    setFieldValue('classId', newValue ? newValue.id : ''); // CHANGED: from classId to classId
                    setFieldValue('className', newValue ? newValue.name : ''); // Set className automatically
                    setFieldValue('schoolId', newValue ? newValue.schoolId : ''); // Set schoolId automatically
                    setFieldValue('schoolName', newValue ? newValue.schoolName : ''); // Set schoolName automatically
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Class"
                      error={Boolean(touched.classId && errors.classId)} // CHANGED: from classId to classId
                      helperText={touched.classId && errors.classId} // CHANGED: from classId to classId
                    />
                  )}
                />
              </Grid>

              {/* Division Autocomplete (Selection) */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="timetable-division-autocomplete"
                  options={divisions}
                  getOptionLabel={(option) => option.name || ''}
                  // Set the value of the Autocomplete based on the divisionId in formik values
                  value={divisions.find((div) => div.id === values.divisionId) || null}
                  onChange={(event, newValue) => {
                    // Update divisionId in Formik state when a division is selected
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

              {/* Day Time Table Section - Dynamic Array of Days */}
              <Grid item xs={12}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Daily Schedule
                </Typography>
                <FieldArray name="dayTimeTable">
                  {({ push, remove }) => (
                    <Box>
                      {/* Map through each day in the dayTimeTable array */}
                      {values?.dayTimeTable?.map((day, dayIndex) => (
                        <Paper key={dayIndex} elevation={2} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                          <Grid container spacing={gridSpacing} alignItems="center">
                            {/* Day Name Autocomplete (Selection) */}
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
                            {/* Delete Day Button */}
                            <Grid item xs={2} sx={{ textAlign: 'right' }}>
                              <IconButton color="error" onClick={() => remove(dayIndex)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>

                            {/* Time Slot Details (tsd) - Dynamic Array of Slots within each Day */}
                            <Grid item xs={12}>
                              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                Time Slots
                              </Typography>
                              <FieldArray name={`dayTimeTable.${dayIndex}.tsd`}>
                                {({ push: pushTsd, remove: removeTsd }) => (
                                  <Box>
                                    {/* Map through each time slot (tsd) within the current day */}
                                    {day.tsd.map((slot, slotIndex) => (
                                      <Paper
                                        key={slotIndex}
                                        elevation={1}
                                        sx={{ p: 2, mb: 2, border: '1px dashed #bdbdbd', borderRadius: '6px' }}
                                      >
                                        <Grid container spacing={gridSpacing} alignItems="center">
                                          {/* Type Input */}
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
                                                {/* Add more types as needed */}
                                              </Select>
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.type && (
                                                  <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].type}</FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          {/* Subject Autocomplete (Selection) */}
                                          <Grid item xs={12} sm={4}>
                                            <Autocomplete
                                              disablePortal
                                              id={`dayTimeTable-${dayIndex}-tsd-${slotIndex}-subject`}
                                              options={subjects}
                                              getOptionLabel={(option) => option.name || ''}
                                              // Set the value of the Autocomplete based on the subjectId in formik values
                                              value={subjects.find((sub) => sub.id === slot.subjectId) || null}
                                              onChange={(event, newValue) => {
                                                // Update subjectId and subjectName in Formik state when a subject is selected
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
                                          {/* Hour Input */}
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
                                                type="number" // Ensure number input
                                                inputProps={{ min: 0, max: 23 }} // Add min/max for hours
                                              />
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.hour && (
                                                  <FormHelperText error>{errors.dayTimeTable[dayIndex].tsd[slotIndex].hour}</FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          {/* Minute Input */}
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
                                                type="number" // Ensure number input
                                                inputProps={{ min: 0, max: 59 }} // Add min/max for minutes
                                              />
                                              {touched.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute &&
                                                errors.dayTimeTable?.[dayIndex]?.tsd?.[slotIndex]?.minute && (
                                                  <FormHelperText error>
                                                    {errors.dayTimeTable[dayIndex].tsd[slotIndex].minute}
                                                  </FormHelperText>
                                                )}
                                            </FormControl>
                                          </Grid>
                                          {/* Sequence Input */}
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
                                          {/* Teacher Name (Auto-filled and Disabled) */}
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
                                          {/* Delete Time Slot Button */}
                                          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                                            <IconButton color="error" onClick={() => removeTsd(slotIndex)}>
                                              <DeleteIcon />
                                            </IconButton>
                                          </Grid>
                                        </Grid>
                                      </Paper>
                                    ))}
                                    {/* Button to Add New Time Slot */}
                                    <Button
                                      variant="outlined"
                                      startIcon={<AddIcon />}
                                      onClick={() =>
                                        pushTsd({
                                          id: 0, // Default ID for new slot
                                          type: '',
                                          subjectName: '',
                                          hour: 0,
                                          minute: 0,
                                          subjectId: '', // Default empty string for Autocomplete
                                          teacherName: loggedInUserData?.userName || 'Unknown User', // Auto-fill with loggedInUserData
                                          sequence: day.tsd.length > 0 ? Math.max(...day.tsd.map((s) => s.sequence)) + 1 : 1, // Auto-increment sequence
                                          accountId: loggedInUserData?.accountId || 0 // Auto-fill
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
                      {/* Button to Add New Day */}
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          push({
                            id: 0, // Default ID for new day
                            dayName: '',
                            tsd: [], // Initialize with an empty array of time slots
                            accountId: loggedInUserData?.accountId || 0 // Auto-fill
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

              {/* Submit and Back Buttons */}
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
