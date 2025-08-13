import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from "../../../utils/apiService"
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

const EditSubjects = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: subjectId } = useParams();
  const [subjectData, setSubjectData] = useState({
    id:undefined,
    name: '',
    subjectCode: ''
  });

  const Title = subjectId ? 'Edit Subject' : 'Add Subject';

  useEffect(() => {
    if (subjectId) {
      fetchSubjectData(subjectId);
    }
  }, [subjectId]);

  const fetchSubjectData = async (id) => {
    try {
      const response = await api.get(`api/subjects/getById?id=${id}`);
      setSubjectData(response.data);
    } catch (error) {
      console.error('Failed to fetch subject data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const subjectData = { ...values, accountId: userDetails.getAccountId(),id: subjectId ? subjectId : undefined};
    try {
      const response = subjectId ? await api.put(`api/subjects/update`, subjectData) : await api.post(`api/subjects/save`, subjectData);
      setSubjectData(response.data);
      setSubmitting(false);
      console.log('subject updated:', response.data);
      toast.success("Subject updated successfully", {autoClose: '500', onClose: () => {
        navigate('/masters/subjects')
      }})
    } catch (error) {
      console.error('Failed to update subject data:', error);
    }
  };

  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={subjectData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* subject Name */}
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
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Password */}
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
                  {touched.subjectCode && errors.subjectCode && (
                    <FormHelperText error>{errors.subjectCode}</FormHelperText>
                  )}
                </FormControl>
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
                <BackButton BackUrl='/masters/subjects'/>

              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditSubjects;
