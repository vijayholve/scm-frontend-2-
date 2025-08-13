import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Select, MenuItem
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from "../../../utils/apiService";
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';

// ==============================|| SCHOOL EDIT/ADD PAGE ||============================== //

const EditSchool = ({ ...others }) => {
  const navigate = useNavigate();
  const { id: schoolId } = useParams();

  // State for the form data
  const [schoolData, setSchoolData] = useState({
    id: null,
    name: '',
    instituteId: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    mobileNumber: '',
    telephoneNumber: '',
    email: '',
    code: ''
  });

  // State for the list of institutes to populate the dropdown
  const [institutes, setInstitutes] = useState([]);
  // State to track if the school name is unique
  const [isNameUnique, setIsNameUnique] = useState(true);

  const Title = schoolId ? 'Edit School' : 'Add School';

  // Fetch the list of institutes on component mount
  useEffect(() => {
    // This function now uses POST with a body, as implied by the user's feedback.
    // It requests a large number of items to populate the dropdown without actual pagination.
    const fetchInstitutes = () => {
      api.post(`api/institutes/getAll/${userDetails.getAccountId()}`, {
        page: 0,
        size: 1000, // Fetch a large number to simulate getting all records for the dropdown
        sortBy: "id",
        sortDir: "asc",
        search: ""
      }).then(response => {
        // The backend returns a paginated response, so we use `response.data.content`
        setInstitutes(response.data.content || []);
      }).catch(err => {
        toast.error("Failed to fetch institutes.");
        console.error("Failed to fetch institutes:", err);
      });
    };
    fetchInstitutes();
  }, []);

  // Fetch school data if in "edit" mode
  useEffect(() => {
    if (schoolId) {
      const fetchSchoolData = async (id) => {
        try {
          const response = await api.get(`/api/schools/getById?id=${id}`);
          if (response.data) {
            setSchoolData(response.data);
          }
        } catch (error) {
          toast.error('Failed to fetch school data.');
          console.error('Failed to fetch school data:', error);
        }
      };
      fetchSchoolData(schoolId);
    }
  }, [schoolId]);

  /**
   * Checks if the school name is unique for the current account.
   * @param {string} name - The name of the school to check.
   */
  const checkNameUniqueness = async (name) => {
    if (!name) return; // Don't run check if name is empty

    try {
      const response = await api.post(`/api/schools/checkName`, {
        name: name,
        accountId: userDetails.getAccountId(),
        id: schoolId || 0 // Exclude current school from check in edit mode
      });
      setIsNameUnique(response.data.isUnique);
    } catch (error) {
      toast.error('Error checking school name uniqueness.');
      console.error(error);
    }
  };

  /**
   * Handles form submission. It validates, checks for uniqueness, and then
   * calls the appropriate API to create or update a school.
   */
  const handleSubmit = async (values, { setSubmitting }) => {
    // Perform a final uniqueness check on submit
    await checkNameUniqueness(values.name);

    // Use a short timeout to ensure the state update from the async check is processed
    setTimeout(async () => {
      if (!isNameUnique) {
        toast.error("School name already exists. Please use a different name.");
        setSubmitting(false);
        return;
      }

      const schoolPayload = {
        ...values,
        id: schoolData?.id,
        accountId: userDetails.getAccountId()
      };

      try {
        const apiCall = schoolId
          ? api.put(`/api/schools/update`, schoolPayload)
          : api.post(`/api/schools/create`, schoolPayload);

        await apiCall;

        setSubmitting(false);
        toast.success(schoolId ? "School updated successfully!" : "School created successfully!", {
          autoClose: 1000,
          onClose: () => navigate('/masters/schools')
        });
      } catch (error) {
        toast.error("An error occurred while saving the school. Please try again.");
        setSubmitting(false);
        console.error("Failed to save school data:", error);
      }
    }, 100);
  };

  return (
    <MainCard title={Title} secondary={<BackButton BackUrl='/masters/schools'/>}>
      <Formik
        key={schoolData.id || 'new-school'} // Ensures form re-initializes when data loads
        enableReinitialize
        initialValues={schoolData}
        // Yup validation schema for all fields
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('School Name is required'),
          instituteId: Yup.string().required('Institute is required'),
          address: Yup.string().required('Address Line 1 is required'),
          city: Yup.string().required('City is required'),
          state: Yup.string().required('State is required'),
          zipCode: Yup.string()
            .matches(/^[0-9]{5,6}$/, 'Must be a valid zip code')
            .required('Zip Code is required'),
          mobileNumber: Yup.string()
            .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
            .required('Mobile Number is required'),
          telephoneNumber: Yup.string()
            .matches(/^[0-9]\d{2,4}-\d{6,8}$/, 'Enter a valid telephone number (e.g., 020-12345678)')
            .required('Telephone Number is required'),
          email: Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
          code: Yup.string().max(50).required('School Code is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* School Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.name && errors.name) || !isNameUnique}>
                  <InputLabel htmlFor="school-name">School Name</InputLabel>
                  <OutlinedInput
                    id="school-name"
                    name="name"
                    value={values.name}
                    label="School Name"
                    onBlur={(e) => {
                      handleBlur(e);
                      checkNameUniqueness(values.name);
                    }}
                    onChange={handleChange}
                  />
                  {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                  {!isNameUnique && <FormHelperText error>This school name already exists.</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Institute Dropdown */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.instituteId && errors.instituteId)}>
                  <InputLabel htmlFor="institute-select">Institute</InputLabel>
                  <Select
                    id="institute-select"
                    name="instituteId"
                    value={values.instituteId}
                    label="Institute"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="" disabled><em>Select an Institute</em></MenuItem>
                    {institutes.map((institute) => (
                      <MenuItem key={institute.id} value={institute.id}>
                        {institute.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.instituteId && errors.instituteId && <FormHelperText error>{errors.instituteId}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Address Line 1 */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.address && errors.address)}>
                  <InputLabel htmlFor="address-line1">Address Line 1</InputLabel>
                  <OutlinedInput
                    id="address-line1"
                    name="address"
                    value={values.address}
                    label="Address Line 1"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.address && errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Address Line 2 */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="address-line2">Address Line 2</InputLabel>
                  <OutlinedInput
                    id="address-line2"
                    name="addressLine2"
                    value={values.addressLine2}
                    label="Address Line 2"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.city && errors.city)}>
                  <InputLabel htmlFor="city">City</InputLabel>
                  <OutlinedInput
                    id="city"
                    name="city"
                    value={values.city}
                    label="City"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.city && errors.city && <FormHelperText error>{errors.city}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.state && errors.state)}>
                  <InputLabel htmlFor="state">State</InputLabel>
                  <OutlinedInput
                    id="state"
                    name="state"
                    value={values.state}
                    label="State"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.state && errors.state && <FormHelperText error>{errors.state}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Zip Code */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.zipCode && errors.zipCode)}>
                  <InputLabel htmlFor="zipCode">Zip Code</InputLabel>
                  <OutlinedInput
                    id="zipCode"
                    name="zipCode"
                    value={values.zipCode}
                    label="Zip Code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.zipCode && errors.zipCode && <FormHelperText error>{errors.zipCode}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Mobile Number */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.mobileNumber && errors.mobileNumber)}>
                  <InputLabel htmlFor="mobileNumber">Mobile Number</InputLabel>
                  <OutlinedInput
                    id="mobileNumber"
                    name="mobileNumber"
                    value={values.mobileNumber}
                    label="Mobile Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.mobileNumber && errors.mobileNumber && <FormHelperText error>{errors.mobileNumber}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Telephone Number */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.telephoneNumber && errors.telephoneNumber)}>
                  <InputLabel htmlFor="telephoneNumber">Telephone Number</InputLabel>
                  <OutlinedInput
                    id="telephoneNumber"
                    name="telephoneNumber"
                    value={values.telephoneNumber}
                    label="Telephone Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.telephoneNumber && errors.telephoneNumber && <FormHelperText error>{errors.telephoneNumber}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <OutlinedInput
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    label="Email Address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* School Code */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(touched.code && errors.code)}>
                  <InputLabel htmlFor="school-code">School Code</InputLabel>
                  <OutlinedInput
                    id="school-code"
                    name="code"
                    value={values.code}
                    label="School Code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.code && errors.code && <FormHelperText error>{errors.code}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <AnimateButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save School
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

export default EditSchool;
