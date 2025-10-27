import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import BackSaveButton from 'layout/MainLayout/Button/BackSaveButton';
import ReusableLoader from 'ui-component/loader/ReusableLoader';
import { useSCDData } from 'contexts/SCDProvider';

const EditClass = ({ ...others }) => {
  const navigate = useNavigate();
  const { id: classId } = useParams();
  const [loading, setloading] = useState(false);

  const [classData, setClassData] = useState({
    id: undefined,
    name: '',
    schoolbranchId: '',
    instituteId: ''
  });

  const { t } = useTranslation('edit');
  const Title = classId ? t('class.title.edit') : t('class.title.add');
  const isEditMode = !!classId;

  // Get SCD data from context (schools only)
  const { schools = [] } = useSCDData();

  const [institutes, setInstitutes] = useState([]);
  const [allClasses, setAllClasses] = useState([]); // For uniqueness validation

  // Fetch remaining dropdown data (institutes and all classes for validation)
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

    fetchData('api/institutes/getAll', setInstitutes);
    fetchData('api/schoolClasses/getAll', setAllClasses);
  }, []);

  useEffect(() => {
    if (classId) {
      setloading(true);
      const fetchClassData = async (id) => {
        try {
          const response = await api.get(`api/schoolClasses/getById?id=${id}`);
          setClassData(response.data);
        } catch (error) {
          console.error('Failed to fetch schoolclass data:', error);
        }
        setloading(false);
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

  if (loading) {
    return <ReusableLoader message={t('class.messages.loading') || 'Loading...'}></ReusableLoader>;
  }

  return (
    <MainCard title={Title}>
      <Formik
        enableReinitialize
        initialValues={classData}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .max(255)
            .required(t('common.required') || 'This field is required')
            .test(
              'is-unique',
              t('class.messages.duplicate') || 'This class name already exists for the selected school.',
              function (value) {
                const { schoolbranchId } = this.parent;
                if (!value || !schoolbranchId) return true;

                const existingClass = allClasses.find(
                  (c) => c.name.toLowerCase() === value.toLowerCase() && c.schoolbranchId === schoolbranchId
                );

                if (isEditMode && existingClass && existingClass.id === parseInt(classId, 10)) {
                  return true;
                }

                return !existingClass;
              }
            ),
          instituteId: Yup.string().required(t('class.messages.instituteRequired') || 'Institute is required'),
          schoolbranchId: Yup.string().required(t('class.messages.schoolRequired') || 'School is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* Class Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                  <InputLabel htmlFor="class-name-input">{t('class.fields.name') || 'Class Name'}</InputLabel>
                  <OutlinedInput
                    id="class-name-input"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label={t('class.fields.name') || 'Class Name'}
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
                      label={t('class.fields.institute') || 'Institute'}
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
                      label={t('class.fields.school') || 'School'}
                      error={Boolean(touched.schoolbranchId && errors.schoolbranchId)}
                      helperText={touched.schoolbranchId && errors.schoolbranchId}
                    />
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                {/* <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <BackButton BackUrl="/masters/classes" />
                  <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    {isEditMode ? 'Update' : 'Save'}
                  </Button>
                </Stack> */}
                <BackSaveButton
                  title={classId ? t('class.messages.updateLabel') || 'Update' : t('class.messages.saveLabel') || 'Save'}
                  backUrl="/masters/classes"
                  isSubmitting={isSubmitting}
                  // onSaveClick={handleSubmit}
                ></BackSaveButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditClass;
