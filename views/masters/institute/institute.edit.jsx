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
import api, { userDetails } from "../../../utils/apiService";
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

// ==============================|| EDIT INSTITUTE PAGE ||============================== //

const EditInstitute = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: instituteId } = useParams();

  // State for holding institute data
  const [instituteData, setInstituteData] = useState({
    id: null,
    name: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    mobileNumber: '',
    email: '',
    faxNumber: '',
    code: ''
  });

  // State to track if the institute name is unique
  const [isNameUnique, setIsNameUnique] = useState(true);

  const Title = instituteId ? 'Edit Institute' : 'Add Institute';

  // Fetch institute data if we are in "edit" mode
  useEffect(() => {
    if (instituteId) {
      fetchInstituteData(instituteId);
    }
  }, [instituteId]);

  const fetchInstituteData = async (id) => {
    try {
      const response = await api.get(`api/institutes/getById?id=${id}`);
      if (response.data) {
        setInstituteData(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch institute data.');
      console.error('Failed to fetch institute data:', error);
    }
  };

  /**
   * Checks if the institute name is unique within the account.
   * This is an async function that communicates with the API.
   * @param {string} name - The name of the institute to check.
   */
  const checkNameUniqueness = async (name) => {
    if (!name) return; // Don't check if the name is empty

    try {
      const response = await api.post(`api/institutes/checkName`, {
        name: name,
        accountId: userDetails.getAccountId(),
        id: instituteId || 0 // Pass current institute ID to exclude it from the check
      });
      setIsNameUnique(response.data.isUnique);
    } catch (error) {
      toast.error('Error checking name uniqueness.');
      console.error('Failed to check institute name uniqueness:', error);
    }
  };


  /**
   * Handles the form submission.
   * This function is called by Formik ONLY after the validation schema passes.
   */
  const handleSubmit = async (values, { setSubmitting }) => {
    // Perform a final uniqueness check on submit to be absolutely sure.
    await checkNameUniqueness(values.name);

    // Re-check the state variable after the await.
    // A slight delay to ensure state has time to update from the async check.
    setTimeout(async () => {
        if (!isNameUnique) {
            toast.error("Institute name already exists. Please choose another name.");
            setSubmitting(false);
            return;
        }

        const institutePayload = { ...values, id: instituteData?.id, accountId: userDetails?.getAccountId() };

        try {
            // Use the correct API endpoint for creating or updating
            const apiCall = api.put(`/api/institutes/save`, institutePayload);
            const response = await apiCall;
            
            setSubmitting(false);
            toast.success(instituteId ? "Institute updated successfully!" : "Institute created successfully!", {
                autoClose: 1000,
                onClose: () => navigate('/masters/institutes')
            });
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            setSubmitting(false);
            console.error('Failed to save institute data:', error);
        }
    }, 100); // 100ms delay
  };


  return (
    <MainCard title={Title} secondary={<BackButton BackUrl='/masters/institutes'/>}>
      <Formik
        // This key is important to re-initialize the form when instituteData is loaded
        key={instituteData.id || 'new-institute'}
        enableReinitialize
        initialValues={instituteData}
        // Validation schema using Yup
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          address: Yup.string().required('Address Line 1 is required'),
          city: Yup.string().required('City is required'),
          state: Yup.string().required('State is required'),
          zipCode: Yup.string().matches(/^[0-9]{5,6}$/, 'Must be a valid zip code').required('Zip Code is required'),
          mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile Number is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          faxNumber: Yup.string().required('Fax Number is required'),
          code: Yup.string().max(255).required('Code is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* Name Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.name && errors.name) || !isNameUnique}>
                  <InputLabel htmlFor="institute-name">Name</InputLabel>
                  <OutlinedInput
                    id="institute-name"
                    name="name"
                    value={values.name}
                    onBlur={(e) => {
                      handleBlur(e); // First, let Formik handle its blur event
                      checkNameUniqueness(values.name); // Then, trigger our uniqueness check
                    }}
                    onChange={handleChange}
                    label="Name"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                  {!isNameUnique && (
                    <FormHelperText error>This institute name already exists.</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Address Line 1 Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.address && errors.address)}>
                  <InputLabel htmlFor="institute-address">Address Line 1</InputLabel>
                  <OutlinedInput
                    id="institute-address"
                    name="address"
                    type="text"
                    value={values.address}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Address Line 1"
                  />
                  {touched.address && errors.address && (
                    <FormHelperText error>{errors.address}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Address Line 2 Field (Optional) */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="institute-address-2">Address Line 2</InputLabel>
                  <OutlinedInput
                    id="institute-address-2"
                    name="addressLine2"
                    type="text"
                    value={values.addressLine2}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Address Line 2"
                  />
                </FormControl>
              </Grid>

              {/* City Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.city && errors.city)}>
                  <InputLabel htmlFor="institute-city">City</InputLabel>
                  <OutlinedInput
                    id="institute-city"
                    name="city"
                    type="text"
                    value={values.city}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="City"
                  />
                  {touched.city && errors.city && (
                    <FormHelperText error>{errors.city}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* State Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.state && errors.state)}>
                  <InputLabel htmlFor="institute-state">State</InputLabel>
                  <OutlinedInput
                    id="institute-state"
                    name="state"
                    type="text"
                    value={values.state}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="State"
                  />
                  {touched.state && errors.state && (
                    <FormHelperText error>{errors.state}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Zip Code Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.zipCode && errors.zipCode)}>
                  <InputLabel htmlFor="institute-zip-code">Zip Code</InputLabel>
                  <OutlinedInput
                    id="institute-zip-code"
                    name="zipCode"
                    type="text"
                    value={values.zipCode}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Zip Code"
                  />
                  {touched.zipCode && errors.zipCode && (
                    <FormHelperText error>{errors.zipCode}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Mobile Number Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.mobileNumber && errors.mobileNumber)}>
                  <InputLabel htmlFor="mobileNumber">Mobile Number</InputLabel>
                  <OutlinedInput
                    id="mobileNumber"
                    name="mobileNumber"
                    value={values.mobileNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Mobile Number"
                  />
                  {touched.mobileNumber && errors.mobileNumber && (
                    <FormHelperText error>{errors.mobileNumber}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Email Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                  <InputLabel htmlFor="institute-email">Email</InputLabel>
                  <OutlinedInput
                    id="institute-email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email"
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error>{errors.email}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Fax Number Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.faxNumber && errors.faxNumber)}>
                  <InputLabel htmlFor="institute-faxNumber">Fax Number</InputLabel>
                  <OutlinedInput
                    id="institute-faxNumber"
                    name="faxNumber"
                    value={values.faxNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Fax Number"
                  />
                  {touched.faxNumber && errors.faxNumber && (
                    <FormHelperText error>{errors.faxNumber}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Code Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.code && errors.code)}>
                  <InputLabel htmlFor="institute-code">Code</InputLabel>
                  <OutlinedInput
                    id="institute-code"
                    name="code"
                    value={values.code}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Code"
                  />
                  {touched.code && errors.code && (
                    <FormHelperText error>{errors.code}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <AnimateButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save
                    </Button>
                  </AnimateButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </MainCard>
  );
};

export default EditInstitute;
