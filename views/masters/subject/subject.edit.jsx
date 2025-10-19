import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, MenuItem, Select } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from '../../../utils/apiService';
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';
import ReusableLoader from 'ui-component/loader/ReusableLoader';
import BackSaveButton from 'layout/MainLayout/Button/BackSaveButton';
import { useSelector } from 'react-redux';

const EditSubjects = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id: subjectId } = useParams();
  const [subjectData, setSubjectData] = useState({
    id: undefined,
    name: '',
    subjectCode: '',
    schoolId: ''
  });

  const Title = subjectId ? 'Edit Subject' : 'Add Subject';

  // Fetch schools from scdSelector
  const schools = useSelector((state) => state.scd.schools);

  useEffect(() => {
    if (subjectId) {
      fetchSubjectData(subjectId);
    }
  }, [subjectId]);

  const fetchSubjectData = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`api/subjects/getById?id=${id}`);
      setSubjectData(response.data);
    } catch (error) {
      console.error('Failed to fetch subject data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const subjectData = { ...values, accountId: userDetails.getAccountId(), id: subjectId ? subjectId : undefined };
    try {
      const response = subjectId ? await api.put(`api/subjects/update`, subjectData) : await api.post(`api/subjects/save`, subjectData);
      setSubjectData(response.data);
      setSubmitting(false);
      console.log('Subject updated:', response.data);
      toast.success('Subject updated successfully', {
        autoClose: '500',
        onClose: () => {
          navigate('/masters/subjects');
        }
      });
    } catch (error) {
      console.error('Failed to update subject data:', error);
    }
  };

  if (loading) {
    return <ReusableLoader />;
  }

  return (
    <MainCard title={Title}>
      <Formik
        enableReinitialize
        initialValues={subjectData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          schoolId: Yup.string().required('School is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* Subject Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="teacher-subject-name">Subject Name</InputLabel>
                  <OutlinedInput
                    id="teacher-subject-name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Subject Name"
                  />
                  {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Subject Code */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="subject-password">Subject Code</InputLabel>
                  <OutlinedInput
                    id="subjectCode"
                    name="subjectCode"
                    type="text"
                    value={values.subjectCode}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Subject Code"
                  />
                  {touched.subjectCode && errors.subjectCode && <FormHelperText error>{errors.subjectCode}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* School Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="school-select">Select School</InputLabel>
                  <Select
                    id="school-select"
                    name="schoolId"
                    value={values.schoolId}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Select School"
                  >
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.schoolId && errors.schoolId && <FormHelperText error>{errors.schoolId}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <BackSaveButton backLink="/masters/subjects" isSubmitting={isSubmitting} />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditSubjects;
