import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Autocomplete, Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, TextField, Stack } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import api, { userDetails } from '../../../utils/apiService';
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

const EditClass = ({ ...others }) => {
  const navigate = useNavigate();
  const { id: classId } = useParams();

  const [classData, setClassData] = useState({
    id: undefined,
    name: '',
    schoolbranchId: '',
    instituteId: '',
    divisionId: ''
  });

  const Title = classId ? 'Edit Class' : 'Add Class';
  const isEditMode = !!classId;

  const [institutes, setInstitutes] = useState([]);
  const [schools, setSchools] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [allClasses, setAllClasses] = useState([]); // For uniqueness validation

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await api.post(`${endpoint}/${userDetails.getAccountId()}`, {
          page: 0,
          size: 1000, // Fetch all for dropdowns
          sortBy: 'id',
          sortDir: 'asc',
          search: ''
        });
        setter(response.data.content || []);
      } catch (err) {
        console.error(`Failed to fetch data from ${endpoint}:`, err);
      }
    };

    fetchData('api/schoolBranches/getAll', setSchools);
    fetchData('api/institutes/getAll', setInstitutes);
    fetchData('api/divisions/getAll', setDivisions);
    fetchData('api/schoolClasses/getAll', setAllClasses);
  }, []);

  useEffect(() => {
    if (classId) {
      const fetchClassData = async (id) => {
        try {
          const response = await api.get(`api/schoolClasses/getById?id=${id}`);
          setClassData(response.data);
        } catch (error) {
          console.error('Failed to fetch schoolclass data:', error);
        }
      };
      fetchClassData(classId);
    }
  }, [classId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = { ...values, accountId: userDetails.getAccountId() };

    try {
      let response;
      // This logic correctly handles both creating a new class and updating an existing one.

      // Update existing class
      response = await api.put(`api/schoolClasses/update`, payload);

      setSubmitting(false);

      if (response.data) {
        toast.success(isEditMode ? 'Class updated successfully!' : 'Class added successfully!', {
          autoClose: 1500,
          onClose: () => {
            navigate('/masters/classes');
          }
        });
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save schoolclass data:', error);
      toast.error('Failed to save class. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <MainCard title={Title} secondary={<BackButton BackUrl="/masters/classes" />}>
      <Formik
        enableReinitialize
        initialValues={classData}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .max(255)
            .required('Name is required')
            .test('is-unique', 'This class name already exists for the selected school and division.', function (value) {
              const { schoolbranchId, divisionId } = this.parent;
              if (!value || !schoolbranchId || !divisionId) return true;

              const existingClass = allClasses.find(
                (c) => c.name.toLowerCase() === value.toLowerCase() && c.schoolbranchId === schoolbranchId && c.divisionId === divisionId
              );

              if (isEditMode && existingClass && existingClass.id === parseInt(classId, 10)) {
                return true;
              }

              return !existingClass;
            }),
          instituteId: Yup.string().required('Institute is required'),
          schoolbranchId: Yup.string().required('School is required'),
          divisionId: Yup.string().required('Division is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* Class Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                  <InputLabel htmlFor="class-name-input">Class Name</InputLabel>
                  <OutlinedInput
                    id="class-name-input"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Class Name"
                  />
                  {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Institute Dropdown */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={institutes.find((ins) => ins.id === values.instituteId) || null}
                  options={institutes}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('instituteId', newValue ? newValue.id : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Institute"
                      error={Boolean(touched.instituteId && errors.instituteId)}
                      helperText={touched.instituteId && errors.instituteId}
                    />
                  )}
                />
              </Grid>

              {/* School Dropdown */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={schools.find((sch) => sch.id === values.schoolbranchId) || null}
                  options={schools}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('schoolbranchId', newValue ? newValue.id : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="School"
                      error={Boolean(touched.schoolbranchId && errors.schoolbranchId)}
                      helperText={touched.schoolbranchId && errors.schoolbranchId}
                    />
                  )}
                />
              </Grid>

              {/* Division Dropdown */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  value={divisions.find((div) => div.id === values.divisionId) || null}
                  options={divisions}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setFieldValue('divisionId', newValue ? newValue.id : '');
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

              {/* Submit Button */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <BackButton BackUrl="/masters/classes" />
                  <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isEditMode ? 'Update' : 'Save'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditClass;
