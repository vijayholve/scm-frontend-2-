import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput,
  TextField, Tabs, Tab, Typography, AppBar, Stack, Card, CardContent, IconButton, Modal
} from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { CloudUpload as UploadIcon, Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from 'utils/apiService';
import { gridSpacing } from 'store/constant';
import BackButton from 'layout/MainLayout/Button/BackButton';
import SaveButton from 'layout/MainLayout/Button/SaveButton';
import { useSelector } from 'react-redux';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';


// Helper component for Tab Panel content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Function to generate accessibility props for tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// Dummy Data for demonstration
const dummyDocuments = [
    { id: 1, fileName: 'Class 10 Syllabus.pdf', schoolName: 'Greenwood High', className: 'Class 10', divisionName: 'A', userType: 'TEACHER', uploadedBy: 'Admin', createdDate: '2024-08-20T10:00:00Z', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', teacherId: 1, studentId: null },
    { id: 2, fileName: 'Teacher Handbook.docx', schoolName: 'Greenwood High', className: 'N/A', divisionName: 'N/A', userType: 'TEACHER', uploadedBy: 'Principal', createdDate: '2024-08-21T11:30:00Z', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', teacherId: 1, studentId: null },
    { id: 3, fileName: 'Exam Guidelines.xlsx', schoolName: 'Oakwood Academy', className: 'Class 9', divisionName: 'B', userType: 'TEACHER', uploadedBy: 'Admin', createdDate: '2024-08-19T14:45:00Z', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', teacherId: 2, studentId: null },
    { id: 4, fileName: 'Lesson Plan Template.pdf', schoolName: 'Greenwood High', className: 'N/A', divisionName: 'N/A', userType: 'TEACHER', uploadedBy: 'Admin', createdDate: '2024-08-18T09:15:00Z', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', teacherId: 3, studentId: null },
];

const documentColumns = [
    { field: 'id', headerName: 'Doc ID', width: 90 },
    { field: 'fileName', headerName: 'File Name', flex: 1 },
    { field: 'schoolName', headerName: 'School', width: 150 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'divisionName', headerName: 'Division', width: 120 },
    { field: 'userType', headerName: 'Visible To', width: 120 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 150 },
    { field: 'createdDate', headerName: 'Upload Date', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
];


const EditUsers = ({ ...others }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [teacherData, setTeacherData] = useState({
    userName: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    role: null,
    gender: null,
    schoolId: null,
    type: null,
    educations: []
  });

  const Title = userId ? 'Edit Teacher' : 'Add Teacher';

  const [schools, setSchools] = useState([]);
  const user = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState(0);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetchData(`api/schoolBranches/getAll/${user?.user?.accountId}`, setSchools);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTeacherData(userId);
    }
  }, [userId]);

  const fetchData = async (endpoint, setter) => {
    try {
      const pagination = {
        page: page,
        size: pageSize,
        sortBy: "id",
        sortDir: "asc",
        search: ""
      }
      const response = await api.post(endpoint, pagination);
      setter(response.data.content || []);
    }
    catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchData(`api/roles/getAll/${userDetails.getAccountId()}`, setRoles);
  }, []);

  const fetchTeacherData = async (id) => {
    try {
      const response = await api.get(`api/users/getById?id=${id}`);
      const data = response.data || {};
      const normalizedEducations = Array.isArray(data.educations)
        ? data.educations
        : (data.educations ? [data.educations] : []);
      setTeacherData({ ...data, educations: normalizedEducations });
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = { ...values, id: teacherData.id, accountId: userDetails.getAccountId() };
    try {
      const apiCall = userId ? api.put(`api/users/update`, userData) : api.post(`api/users/save`, userData);
      const response = await apiCall;
      setTeacherData(response.data);
      toast.success(userId ? 'Teacher updated successfully' : 'Teacher created successfully', {
        autoClose: '100', onClose: () => {
          navigate('/masters/teachers');
        }
      });
    } catch (error) {
      console.error('Failed to submit teacher data:', error);
    }
    finally{
      setSubmitting(false);
    }
  };

  const higherQualificationOptions = ['10th','12th', 'Graduation', 'PhD', 'Master'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (1900 + i).toString());

  const DocumentsSection = ({ userId }) => {
    const [documents, setDocuments] = useState([]);
    const [openUploadModal, setOpenUploadModal] = useState(false);

    useEffect(() => {
      const userDocuments = dummyDocuments.filter(doc => doc.teacherId === userId);
      setDocuments(userDocuments);
    }, [userId]);

    const docActions = [
        {
            icon: <DownloadIcon />,
            label: 'Download',
            tooltip: 'Download Document',
            color: 'primary',
            onClick: (row) => {
                window.open(row.fileUrl, '_blank');
            }
        }
    ];

    return (
        <MainCard
            title="Uploaded Documents"
            secondary={
                <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setOpenUploadModal(true)}>
                    Upload Document
                </Button>
            }
        >
            <ReusableDataGrid
                title="Uploaded Documents"
                data={documents}
                fetchUrl={null}
                isPostRequest={false}
                columns={documentColumns}
                entityName="DOCUMENT_HUB"
                customActions={docActions}
                showSearch={false}
                showRefresh={false}
                showFilters={false}
                height={300}
            />
            <Modal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => setOpenUploadModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DocumentUploadForm onClose={() => setOpenUploadModal(false)} onSuccess={() => setOpenUploadModal(false)} userId={userId} />
                </Box>
            </Modal>
        </MainCard>
    );
  };

  const DocumentUploadForm = ({ onClose, onSuccess, userId }) => {
    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!file || !documentName) {
            toast.error('Please select a file and provide a document name.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentName', documentName);

        try {
            // This is a placeholder. You would replace this with your actual API call.
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Document uploaded successfully!');
            onSuccess();
        } catch (error) {
            console.error('Failed to upload document:', error);
            toast.error('Failed to upload document.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Document Name"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: 'none' }}
                            id="file-upload-input"
                        />
                        <label htmlFor="file-upload-input">
                            <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                                {file ? file.name : 'Select File'}
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !file || !documentName}
                        >
                            Upload
                        </Button>
                        <Button onClick={onClose} sx={{ ml: 2 }}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
  };


  return (
    <MainCard title={Title}>
      <Box sx={{ width: '100%', mb: 2 }}>
        <AppBar position="static" color="default" elevation={0}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="teacher form tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Basic Details" {...a11yProps(0)} />
            <Tab label="Education" {...a11yProps(1)} />
            {userId && <Tab label="Documents" {...a11yProps(2)} />}
          </Tabs>
        </AppBar>
      </Box>

      <Formik
        enableReinitialize
        initialValues={teacherData}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          educations: Yup.array().of(
            Yup.object().shape({
              higherQualification: Yup.string().required('Higher Qualification is required'),
              institutionName: Yup.string().required('School/College Name is required'),
              boardOrUniversity: Yup.string().required('Board/University Name is required'),
              passOutYear: Yup.number()
                .typeError('Pass Out Year is required')
                .required('Pass Out Year is required')
                .min(1900)
                .max(currentYear),
              percentage: Yup.number()
                .typeError('Percentage is required')
                .required('Percentage is required')
                .min(0)
                .max(100)
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-user-name">User Name</InputLabel>
                    <OutlinedInput
                      id="teacher-user-name"
                      name="userName"
                      value={values.userName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="User Name"
                    />
                    {touched.userName && errors.userName && <FormHelperText error>{errors.userName}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-password">Password</InputLabel>
                    <OutlinedInput
                      id="teacher-password"
                      name="password"
                      type="text"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Password"
                    />
                    {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-first-name">First Name</InputLabel>
                    <OutlinedInput
                      id="teacher-first-name"
                      name="firstName"
                      value={values.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="First Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-middle-name">Middle Name</InputLabel>
                    <OutlinedInput
                      id="teacher-middle-name"
                      name="middleName"
                      value={values.middleName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Middle Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-last-name">Last Name</InputLabel>
                    <OutlinedInput
                      id="teacher-last-name"
                      name="lastName"
                      value={values.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Last Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-mobile-no">Mobile No</InputLabel>
                    <OutlinedInput
                      id="teacher-mobile-no"
                      name="mobile"
                      value={values.mobile}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Mobile No"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-email">Email</InputLabel>
                    <OutlinedInput
                      id="teacher-email"
                      name="email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Email"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="teacher-address">Address</InputLabel>
                    <OutlinedInput
                      id="teacher-address"
                      name="address"
                      value={values.address}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Address"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    value={roles.find((role) => role.id === values.role?.id) || null}
                    options={roles}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('role', newValue ? newValue : null);
                    }}
                    renderInput={(params) => <TextField {...params} label="Role" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    value={values.gender}
                    options={['MALE', 'FEMALE']}
                    onChange={(event, newValue) => {
                      setFieldValue('gender', newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Gender" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    value={schools.find((school) => school.id === values.schoolId) || null}
                    options={schools}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('schoolId', newValue?.id ? newValue?.id : null);
                    }}
                    renderInput={(params) => <TextField {...params} label="School" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disablePortal
                    value={values.type}
                    options={['TEACHER', 'ADMIN', 'STAFF']}
                    onChange={(event, newValue) => {
                      setFieldValue('type', newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Type" />}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <FieldArray name="educations">
                {({ push, remove }) => (
                  <Box>
                    {values.educations && values.educations.length > 0 ? (
                      values.educations.map((edu, index) => (
                        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">Education {index + 1}</Typography>
                            <Button color="error" size="small" onClick={() => remove(index)} disabled={values.educations.length === 1}>
                              Remove
                            </Button>
                          </Stack>
                          <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                disablePortal
                                options={higherQualificationOptions}
                                value={edu.higherQualification || null}
                                onBlur={handleBlur}
                                onChange={(event, newValue) => {
                                  setFieldValue(`educations[${index}].higherQualification`, newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Higher Qualification" />}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor={`school-college-name-${index}`}>School/College Name</InputLabel>
                                <OutlinedInput
                                  id={`school-college-name-${index}`}
                                  name={`educations[${index}].institutionName`}
                                  value={edu.institutionName || ''}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  label="School/College Name"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor={`university-name-${index}`}>Board/University Name</InputLabel>
                                <OutlinedInput
                                  id={`university-name-${index}`}
                                  name={`educations[${index}].boardOrUniversity`}
                                  value={edu.boardOrUniversity || ''}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  label="Board/University Name"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                disablePortal
                                options={years}
                                value={edu.passOutYear ? edu.passOutYear.toString() : null}
                                onBlur={handleBlur}
                                onChange={(event, newValue) => {
                                  setFieldValue(`educations[${index}].passOutYear`, newValue ? parseInt(newValue, 10) : null);
                                }}
                                renderInput={(params) => <TextField {...params} label="Pass Out Year" />}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth>
                                <InputLabel htmlFor={`education-percentage-${index}`}>Percentage</InputLabel>
                                <OutlinedInput
                                  id={`education-percentage-${index}`}
                                  name={`educations[${index}].percentage`}
                                  type="number"
                                  value={edu.percentage || ''}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  label="Percentage"
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary" sx={{ mb: 2 }}>No education records. Add one below.</Typography>
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        push({
                          higherQualification: null,
                          institutionName: '',
                          boardOrUniversity: '',
                          passOutYear: null,
                          percentage: ''
                        })
                      }
                    >
                      Add Education
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </TabPanel>

            {userId && (
                <TabPanel value={tabValue} index={2}>
                    <DocumentsSection userId={userId} />
                </TabPanel>
            )}

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <BackButton BackUrl="/masters/teachers" />
                <SaveButton
                  onClick={handleSubmit}
                  isSubmitting={isSubmitting}
                  title={userId ? 'Update' : 'Save'}
                  color="secondary"
                />
              </Stack>
            </Grid>
          </form>
        )}
      </Formik>
      <Modal
          open={openUploadModal}
          onClose={() => setOpenUploadModal(false)}
      >
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => setOpenUploadModal(false)}>
                      <CloseIcon />
                  </IconButton>
              </Box>
              <DocumentUploadForm onClose={() => setOpenUploadModal(false)} onSuccess={() => setOpenUploadModal(false)} userId={userId} />
          </Box>
      </Modal>
    </MainCard>
  );
};

export default EditUsers;


// New Document Sections and Upload Form (for both files)

const DocumentsSection = ({ userId }) => {
    const [documents, setDocuments] = useState([]);
    const [openUploadModal, setOpenUploadModal] = useState(false);

    // Filter dummy data by userId
    useEffect(() => {
        const userDocuments = dummyDocuments.filter(doc => doc.teacherId === userId);
        setDocuments(userDocuments);
    }, [userId]);

    const docActions = [
        {
            icon: <DownloadIcon />,
            label: 'Download',
            tooltip: 'Download Document',
            color: 'primary',
            onClick: (row) => {
                window.open(row.fileUrl, '_blank');
            }
        }
    ];

    return (
        <MainCard
            title="Uploaded Documents"
            secondary={
                <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setOpenUploadModal(true)}>
                    Upload Document
                </Button>
            }
        >
            <ReusableDataGrid
                title="Uploaded Documents"
                data={documents}
                fetchUrl={null}
                isPostRequest={false}
                columns={documentColumns}
                entityName="DOCUMENT_HUB"
                customActions={docActions}
                showSearch={false}
                showRefresh={false}
                showFilters={false}
                height={300}
            />
            <Modal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => setOpenUploadModal(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DocumentUploadForm onClose={() => setOpenUploadModal(false)} onSuccess={() => setOpenUploadModal(false)} userId={userId} />
                </Box>
            </Modal>
        </MainCard>
    );
};

const DocumentUploadForm = ({ onClose, onSuccess, userId }) => {
    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!file || !documentName) {
            toast.error('Please select a file and provide a document name.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentName', documentName);

        try {
            // This is a placeholder. You would replace this with your actual API call.
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Document uploaded successfully!');
            onSuccess();
        } catch (error) {
            console.error('Failed to upload document:', error);
            toast.error('Failed to upload document.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Document Name"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ display: 'none' }}
                            id="file-upload-input"
                        />
                        <label htmlFor="file-upload-input">
                            <Button variant="contained" component="span" startIcon={<UploadIcon />}>
                                {file ? file.name : 'Select File'}
                            </Button>
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !file || !documentName}
                        >
                            Upload
                        </Button>
                        <Button onClick={onClose} sx={{ ml: 2 }}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
  };