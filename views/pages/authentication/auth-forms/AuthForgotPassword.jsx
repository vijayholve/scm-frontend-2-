import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
    Stack,
    Divider
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-hot-toast';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { endpoints } from 'api';
import { strengthIndicator, strengthColor } from 'utils/password-strength';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';
import AuthWrapper1 from 'views/pages/AuthWrapper1';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconLock } from '@tabler/icons-react';
import AuthFooter from 'ui-component/cards/AuthFooter';


// ============================|| FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const customization = useSelector((state) => state.customization);
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
    const [formValues, setFormValues] = useState({});

    // Password strength state
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    
    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmitStep1 = async (values, { setSubmitting }) => {
        setLoading(true);
        setApiError('');
        try {
            // API call to request an OTP
            const response = await api.post(endpoints.auth.forgotPasswordRequest, {
                userName: values.userName,
                email: values.email,
                accountId: values.accountId,
            });

            if (response.data.status === 'SUCCESS') {
                toast.success('OTP sent to your email successfully!');
                setFormValues(values);
                setStep(2);
            } else {
                setApiError(response.data.message || 'Failed to send OTP. Please check your details.');
            }
        } catch (error) {
            console.error('Forgot password request failed:', error);
            setApiError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleSubmitStep2 = async (values, { setSubmitting }) => {
        setLoading(true);
        setApiError('');
        try {
            // API call to reset password with OTP
            const response = await api.post(endpoints.auth.resetPassword, {
                userName: formValues.userName,
                email: formValues.email,
                accountId: formValues.accountId,
                newPassword: values.newPassword,
                otp: values.otp,
            });

            if (response.data.status === 'SUCCESS') {
                toast.success('Password changed successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setApiError(response.data.message || 'OTP is incorrect or expired.');
            }
        } catch (error) {
            console.error('Password reset failed:', error);
            setApiError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={12}>
                                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                                            <Typography color="secondary.main" gutterBottom variant="h2">
                                                Forgot Password
                                            </Typography>
                                            <Typography variant="caption" fontSize="16px" textAlign="center">
                                                {step === 1 ? 'Enter your details to receive an OTP via email' : 'Enter the OTP and your new password'}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {step === 1 && (
                                            <Formik
                                                initialValues={{ userName: '', email: '', newPassword: '', accountId: '', submit: null }}
                                                validationSchema={Yup.object().shape({
                                                    userName: Yup.string().max(255).required('User Name is required'),
                                                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                                                    accountId: Yup.string().max(255).required('Account ID is required'),
                                                    newPassword: Yup.string().min(8, 'Password must be at least 8 characters long').required('New password is required')
                                                })}
                                                onSubmit={handleSubmitStep1}
                                            >
                                                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                                    <form noValidate onSubmit={handleSubmit}>
                                                        <FormControl fullWidth error={Boolean(touched.userName && errors.userName)} sx={{ ...theme.typography.customInput }}>
                                                            <InputLabel htmlFor="forgot-password-username">User Name</InputLabel>
                                                            <OutlinedInput
                                                                id="forgot-password-username"
                                                                type="text"
                                                                value={values.userName}
                                                                name="userName"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                label="User Name"
                                                                inputProps={{}}
                                                            />
                                                            {touched.userName && errors.userName && <FormHelperText error>{errors.userName}</FormHelperText>}
                                                        </FormControl>
                                                        
                                                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                                            <InputLabel htmlFor="forgot-password-email">Email Address</InputLabel>
                                                            <OutlinedInput
                                                                id="forgot-password-email"
                                                                type="email"
                                                                value={values.email}
                                                                name="email"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                label="Email Address"
                                                                inputProps={{}}
                                                            />
                                                            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                                                        </FormControl>

                                                        <FormControl fullWidth error={Boolean(touched.accountId && errors.accountId)} sx={{ ...theme.typography.customInput }}>
                                                            <InputLabel htmlFor="forgot-password-account-id">Account ID</InputLabel>
                                                            <OutlinedInput
                                                                id="forgot-password-account-id"
                                                                type="text"
                                                                value={values.accountId}
                                                                name="accountId"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                label="Account ID"
                                                                inputProps={{}}
                                                            />
                                                            {touched.accountId && errors.accountId && <FormHelperText error>{errors.accountId}</FormHelperText>}
                                                        </FormControl>

                                                        <FormControl fullWidth error={Boolean(touched.newPassword && errors.newPassword)} sx={{ ...theme.typography.customInput }}>
                                                            <InputLabel htmlFor="new-password-input">New Password</InputLabel>
                                                            <OutlinedInput
                                                                id="new-password-input"
                                                                type={showPassword ? 'text' : 'password'}
                                                                value={values.newPassword}
                                                                name="newPassword"
                                                                label="New Password"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    changePassword(e.target.value);
                                                                }}
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="toggle password visibility"
                                                                            onClick={handleClickShowPassword}
                                                                            onMouseDown={handleMouseDownPassword}
                                                                            edge="end"
                                                                            size="large"
                                                                        >
                                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                }
                                                                inputProps={{}}
                                                            />
                                                            {touched.newPassword && errors.newPassword && <FormHelperText error>{errors.newPassword}</FormHelperText>}
                                                        </FormControl>
                                                        {strength !== 0 && (
                                                            <FormControl fullWidth>
                                                                <Box sx={{ mb: 2 }}>
                                                                    <Grid container spacing={2} alignItems="center">
                                                                        <Grid item>
                                                                            <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                                                {level?.label}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Box>
                                                            </FormControl>
                                                        )}

                                                        {apiError && (
                                                            <Box sx={{ mt: 3 }}>
                                                                <FormHelperText error>{apiError}</FormHelperText>
                                                            </Box>
                                                        )}

                                                        <Box sx={{ mt: 2 }}>
                                                            <AnimateButton>
                                                                <Button disableElevation disabled={isSubmitting || loading} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                                                </Button>
                                                            </AnimateButton>
                                                        </Box>
                                                    </form>
                                                )}
                                            </Formik>
                                        )}

                                        {step === 2 && (
                                            <Formik
                                                initialValues={{ otp: '', newPassword: formValues.newPassword, submit: null }}
                                                validationSchema={Yup.object().shape({
                                                    otp: Yup.string().max(6).required('OTP is required'),
                                                    newPassword: Yup.string().min(8, 'Password must be at least 8 characters long').required('New password is required')
                                                })}
                                                onSubmit={handleSubmitStep2}
                                            >
                                                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                                    <form noValidate onSubmit={handleSubmit}>
                                                        <FormControl fullWidth error={Boolean(touched.otp && errors.otp)} sx={{ ...theme.typography.customInput }}>
                                                            <InputLabel htmlFor="reset-password-otp">OTP</InputLabel>
                                                            <OutlinedInput
                                                                id="reset-password-otp"
                                                                type="text"
                                                                value={values.otp}
                                                                name="otp"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                label="OTP"
                                                                inputProps={{}}
                                                            />
                                                            {touched.otp && errors.otp && <FormHelperText error>{errors.otp}</FormHelperText>}
                                                        </FormControl>
                                                        
                                                        <FormControl fullWidth error={Boolean(touched.newPassword && errors.newPassword)} sx={{ ...theme.typography.customInput }}>
                                                            <InputLabel htmlFor="reset-password-new-password">New Password</InputLabel>
                                                            <OutlinedInput
                                                                id="reset-password-new-password"
                                                                type={showPassword ? 'text' : 'password'}
                                                                value={values.newPassword}
                                                                name="newPassword"
                                                                label="New Password"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    handleChange(e);
                                                                    changePassword(e.target.value);
                                                                }}
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="toggle password visibility"
                                                                            onClick={handleClickShowPassword}
                                                                            onMouseDown={handleMouseDownPassword}
                                                                            edge="end"
                                                                            size="large"
                                                                        >
                                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                }
                                                                inputProps={{}}
                                                            />
                                                            {touched.newPassword && errors.newPassword && <FormHelperText error>{errors.newPassword}</FormHelperText>}
                                                        </FormControl>

                                                        {apiError && (
                                                            <Box sx={{ mt: 3 }}>
                                                                <FormHelperText error>{apiError}</FormHelperText>
                                                            </Box>
                                                        )}
                                                        
                                                        <Box sx={{ mt: 2 }}>
                                                            <AnimateButton>
                                                                <Button disableElevation disabled={isSubmitting || loading} fullWidth size="large" type="submit" variant="contained" color="secondary">
                                                                    {loading ? 'Resetting Password...' : 'Reset Password'}
                                                                </Button>
                                                            </AnimateButton>
                                                        </Box>
                                                    </form>
                                                )}
                                            </Formik>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                                                Remember your password?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default AuthForgotPassword;
