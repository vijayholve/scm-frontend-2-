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

const EditDivision = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: divisionId } = useParams();
  const [divisionData, setDivisionData] = useState({
    id:undefined,
    name: '',
    subjectCode: ''
  });

  const Title = divisionId ? 'Edit Division' : 'Add Division';

  useEffect(() => {
    if (divisionId) {
      fetchDivisionData(divisionId);
    }
  }, [divisionId]);

  const fetchDivisionData = async (id) => {
    try {
      const response = await api.get(`api/divisions/getById?id=${id}`);
      setDivisionData(response.data);
    } catch (error) {
      console.error('Failed to fetch division data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const divisionData = { ...values,accountId: userDetails.getAccountId() };
    try {
      const response = await api.put(`api/divisions/update`, divisionData);
      setDivisionData(response.data);
      setSubmitting(false);
      console.log('division updated:', response.data);
      toast.success("Division updated successfully", {autoClose: '1000', onClose: () => {
        navigate('/masters/divisions')
      }})
    } catch (error) {
      console.error('Failed to update division data:', error);
    }
  };

  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={divisionData}
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
                  <InputLabel htmlFor="teacher-subject-name">Division Name</InputLabel>
                  <OutlinedInput
                    id="teacher-subject-name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Division Name"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="subject-password">Division Code</InputLabel>
                  <OutlinedInput
                    id="subjectCode"
                    name="subjectCode"
                    type="text"
                    value={values.id}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Division Code"
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
                <BackButton BackUrl='/masters/divisions'/>

              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditDivision;
