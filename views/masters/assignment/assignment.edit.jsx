import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, Autocomplete, TextField,
  Card, CardContent, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Divider
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  GetApp as DownloadIcon,
  Send as SubmitIcon,
  AttachFile as FileIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import BackButton from 'layout/MainLayout/Button/BackButton';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import api, { userDetails } from "../../../utils/apiService"
import { gridSpacing } from 'store/constant';
import { useSelector } from 'react-redux';

const EditAssignment = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  console.log("user", user);
  const { id: assignmentId } = useParams();
  const [assignmentData, setAssignmentData] = useState({
    id: undefined,
    name: '',
    schoolId: undefined,
    schoolName: '',
    classId: undefined,
    className: '',
    divisionId: undefined,
    divisionName: '',
    subjectId: undefined,
    subjectName: '',
    createdBy: undefined,
    createdDate: undefined,
    modifiedBy: undefined,
    modifiedDate: undefined,
    deadLine: undefined,
    message: '',
    status: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  // Dropdown data states
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Fetch dropdown data
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(endpoint);
      setter(response.data || []);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
    }
  };

  // Fetch all dropdown data on component mount
  useEffect(() => {
    fetchData(`api/schoolBranches/getAllBy/${userDetails.getAccountId()}`, setSchools);
    fetchData(`api/schoolClasses/getAllBy/${userDetails.getAccountId()}`, setClasses);
    fetchData(`api/divisions/getAllBy/${userDetails.getAccountId()}`, setDivisions);
    fetchData(`api/subjects/getAllBy/${userDetails.getAccountId()}`, setSubjects);
  }, []);

  useEffect(() => {
    // Fetch submissions for the current assignment and user
    if (assignmentId && user?.id) {
      const fetchSubmissions = async () => {
        try {
          let response;
          if (user?.type === "STUDENT") {
            response = await api.get(`/api/assignments/submissions/${assignmentId}/student/${user.id}`);
          } else if (user?.type === "TEACHER") {
            response = await api.get(`/api/assignments/submissions/${assignmentId}`);
          }
          if (Array.isArray(response.data)) {
            setSubmissions(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch submissions:', error);
        }
      };
      fetchSubmissions();
    }
  }, [assignmentId, user?.id]);


  const Title = assignmentId ? 'Edit Assignment' : 'Add Assignment';

  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentData(assignmentId);
    }
  }, [assignmentId]);

  const fetchAssignmentData = async (id) => {
    try {
      const response = await api.get(`api/assignments/getById?id=${id}`);
      setAssignmentData(response.data);
      //setSubmissions(response.data.submissions);
      setAssignmentSubmission(response.data.assignmentSubmission);
    } catch (error) {
      console.error('Failed to fetch Assignment data:', error);
    }
  };


  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      values.accountId = userDetails.getAccountId();
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(values)], {
        type: 'application/json'
      });

      formData.append('assignment', jsonBlob);
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await api.post(`/api/assignments/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Assignment saved successfully", {
        autoClose: 500,
        onClose: () => navigate('/masters/assignments')
      });

      setAssignmentData(response.data);
    } catch (error) {
      console.error('Failed to save assignment:', error);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <MainCard title={Title} >
      <Formik
        enableReinitialize
        initialValues={assignmentData}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          schoolId: Yup.number().required('School is required'),
          classId: Yup.number().required('Class is required'),
          divisionId: Yup.number().required('Division is required'),
          subjectId: Yup.number().required('Subject is required'),
          deadLine: Yup.date().nullable().required('Deadline is required')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {/* Assignment Name */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="assignment-name">Assignment Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    name="name"
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Assignment Name"
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </FormControl>
              </Grid>


              {/* School */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  options={schools}
                  getOptionLabel={(option) => option.name || ''}
                  value={schools.find((school) => school.id === values.schoolId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('schoolId', newValue?.id || null);
                    setFieldValue('schoolName', newValue?.name || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="School *"
                      error={touched.schoolId && !!errors.schoolId}
                      helperText={touched.schoolId && errors.schoolId}
                    />
                  )}
                />
              </Grid>

              {/* Class */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  options={classes}
                  getOptionLabel={(option) => option.name || ''}
                  value={classes.find((cls) => cls.id === values.classId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('classId', newValue?.id || null);
                    setFieldValue('className', newValue?.name || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Class *"
                      error={touched.classId && !!errors.classId}
                      helperText={touched.classId && errors.classId}
                    />
                  )}
                />
              </Grid>

              {/* Division */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  options={divisions}
                  getOptionLabel={(option) => option.name || ''}
                  value={divisions.find((division) => division.id === values.divisionId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('divisionId', newValue?.id || null);
                    setFieldValue('divisionName', newValue?.name || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Division *"
                      error={touched.divisionId && !!errors.divisionId}
                      helperText={touched.divisionId && errors.divisionId}
                    />
                  )}
                />
              </Grid>

              {/* Subject */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  options={subjects}
                  getOptionLabel={(option) => option.name || ''}
                  value={subjects.find((subject) => subject.id === values.subjectId) || null}
                  onChange={(event, newValue) => {
                    setFieldValue('subjectId', newValue?.id || null);
                    setFieldValue('subjectName', newValue?.name || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subject *"
                      error={touched.subjectId && !!errors.subjectId}
                      helperText={touched.subjectId && errors.subjectId}
                    />
                  )}
                />
              </Grid>

              {/* Deadline */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="deadLine">Deadline</InputLabel>
                  <OutlinedInput
                    id="deadLine"
                    name="deadLine"
                    type="date"
                    value={values.deadLine}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Deadline"
                    inputProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>

              {/* Is Active */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="status">Status</InputLabel>
                  <select
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      height: '56px',
                      padding: '16.5px 14px',
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </FormControl>
              </Grid>

              {/* Message */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="message">Message</InputLabel>
                  <OutlinedInput
                    id="message"
                    name="message"
                    value={values.message}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Message"
                  />
                </FormControl>
              </Grid>

              {/* Upload File */}
              {user?.type != "STUDENT" && (
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      border: '2px dashed #2196F3',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#1976D2',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(33, 150, 243, 0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <input
                        type="file"
                        name="file"
                        id="file"
                        onChange={(e) => setUploadedFile(e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file">
                        <Box sx={{ cursor: 'pointer' }}>
                          <UploadIcon sx={{ fontSize: 48, color: '#2196F3', mb: 1 }} />
                          <Typography variant="h6" sx={{ color: '#1976D2', fontWeight: 600 }}>
                            📁 Upload Assignment File
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click to select file or drag & drop
                          </Typography>
                          {uploadedFile && (
                            <Chip
                              label={`📎 ${uploadedFile.name}`}
                              color="primary"
                              variant="outlined"
                              sx={{ mt: 2 }}
                            />
                          )}
                        </Box>
                      </label>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Submit and Cancel Buttons */}
              {user?.type != "STUDENT" && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CancelIcon />}
                      onClick={() => navigate('/masters/assignments')}
                      sx={{
                        minWidth: 120,
                        borderRadius: '8px',
                        textTransform: 'none'
                      }}
                    >
                      Cancel
                    </Button>
                    <AnimateButton>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? null : <SaveIcon />}
                        sx={{
                          minWidth: 120,
                          borderRadius: '8px',
                          textTransform: 'none',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #1BA5F3 90%)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .4)'
                          }
                        }}
                      >
                        {isSubmitting ? 'Saving...' : (assignmentId ? 'Update Assignment' : 'Create Assignment')}
                      </Button>
                    </AnimateButton>
                  </Box>
                </Grid>
              )}
            </Grid>



            {/* Assignment Files Section - Teacher uploaded files for student submission */}
            {Array.isArray(assignmentSubmission) && assignmentSubmission.length > 0 && (
              <Box mt={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    border: '1px solid #2196F3',
                    borderRadius: '12px'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <FileIcon sx={{ mr: 1, color: '#2196F3' }} />
                      <Typography variant="h6" sx={{ color: '#1976D2', fontWeight: 600 }}>
                        📁 {user?.type === "STUDENT" ? "Assignment Files - Submit Your Work" : "Assignment Files"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {user?.type === "STUDENT" ? "Download the assignment and upload your completed work" : "Files uploaded for this assignment"}
                      </Typography>
                    </Box>
                    
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 600 }}>📄 Assignment File</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>📊 Size</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>⬇️ Download Assignment</TableCell>
                            {user?.type === "STUDENT" && (
                              <>
                                <TableCell sx={{ fontWeight: 600 }}>📤 Upload Your Work</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>✅ Submit Work</TableCell>
                              </>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {assignmentSubmission.map((submission, idx) => (
                            <TableRow 
                              key={idx}
                              sx={{ 
                                '&:hover': { backgroundColor: '#f8f9fa' },
                                '&:last-child td, &:last-child th': { border: 0 }
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <FileIcon sx={{ mr: 1, color: '#666' }} />
                                  <Typography variant="body2">{submission.fileName}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={`${(submission.fileSize / 1024).toFixed(2)} KB`}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  sx={{
                                    borderRadius: '6px',
                                    textTransform: 'none',
                                    '&:hover': {
                                      transform: 'translateY(-1px)',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }
                                  }}
                                  onClick={async () => {
                                    try {
                                      const response = await api.get(
                                        `api/assignments/download/file/${submission.id}?assignmentId=${assignmentId}&fileName=${encodeURIComponent(submission.fileName)}`,
                                        { responseType: 'blob' }
                                      );
                                      const url = window.URL.createObjectURL(new Blob([response.data]));
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.setAttribute('download', submission.fileName);
                                      document.body.appendChild(link);
                                      link.click();
                                      link.remove();
                                    } catch (error) {
                                      console.error('Failed to download file:', error);
                                      toast.error("Failed to download file");
                                    }
                                  }}
                                >
                                  Download Assignment
                                </Button>
                              </TableCell>
                              {user?.type === "STUDENT" && (
                                <>
                                  <TableCell>
                                    <Box>
                                      <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        id={`upload-file-${idx}`}
                                        onChange={(e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            const updated = Array.isArray(assignmentSubmission) ? [...assignmentSubmission] : [];
                                            updated[idx] = { ...updated[idx], file };
                                            setAssignmentSubmission(updated);
                                          }
                                        }}
                                      />
                                      <label htmlFor={`upload-file-${idx}`}>
                                        <Button
                                          variant="outlined"
                                          color="secondary"
                                          component="span"
                                          size="small"
                                          startIcon={<UploadIcon />}
                                          sx={{
                                            borderRadius: '6px',
                                            textTransform: 'none',
                                            '&:hover': {
                                              transform: 'translateY(-1px)',
                                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }
                                          }}
                                        >
                                          {submission.file ? "Change File" : "Upload Your Work"}
                                        </Button>
                                      </label>
                                      {submission.file && (
                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#666' }}>
                                          📎 {submission.file.name}
                                        </Typography>
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                      startIcon={<SubmitIcon />}
                                      sx={{
                                        borderRadius: '6px',
                                        textTransform: 'none',
                                        background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
                                        '&:hover': {
                                          background: 'linear-gradient(45deg, #388E3C 30%, #4CAF50 90%)',
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }
                                      }}
                                      onClick={async () => {
                                        if (!submission.file) {
                                          toast.error("Please select a file to submit.");
                                          return;
                                        }
                                        try {
                                          const formData = new FormData();
                                          formData.append('file', submission.file);
                                          formData.append('assignmentId', assignmentId);
                                          formData.append('studentId', user?.id);
                                          await api.post('/api/assignments/submit', formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                          });
                                          toast.success("Assignment submitted successfully");
                                        } catch (error) {
                                          toast.error("Failed to submit assignment");
                                        }
                                      }}
                                    >
                                      Submit Work
                                    </Button>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            )}
          </form>
        )}
      </Formik>
      {/* Student Submissions Section */}
      <Box mt={5}>
        <Card
          sx={{
            background: user?.type === "STUDENT" 
              ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
              : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            border: user?.type === "STUDENT" ? '1px solid #4CAF50' : '1px solid #FF9800',
            borderRadius: '12px'
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EditIcon sx={{ mr: 1, color: user?.type === "STUDENT" ? '#4CAF50' : '#FF9800' }} />
              <Typography variant="h6" sx={{ color: user?.type === "STUDENT" ? '#2E7D32' : '#F57C00', fontWeight: 600 }}>
                📋 {user?.type === "STUDENT" ? "My Submissions & Teacher Feedback" : "All Student Submissions"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {user?.type === "STUDENT" 
                  ? "View your submitted work and teacher's comments"
                  : "Review and grade student submissions"
                }
              </Typography>
            </Box>
            
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    {user?.type !== "STUDENT" && (
                      <TableCell sx={{ fontWeight: 600 }}>👤 Student ID</TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 600 }}>📄 Submitted File</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>📅 Submission Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>👁️ Download</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>⭐ Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>💬 {user?.type === "STUDENT" ? "Teacher's Feedback" : "Comment & Grade"}</TableCell>
                    {user?.type !== "STUDENT" && (
                      <TableCell sx={{ fontWeight: 600 }}>🔧 Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((sub, idx) => (
                    <TableRow 
                      key={idx}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f8f9fa' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      {/* Student ID - Only for Teachers */}
                      {user?.type !== "STUDENT" && (
                        <TableCell>
                          <Chip 
                            label={sub.studentId}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                      )}
                      
                      {/* File Name */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FileIcon sx={{ mr: 1, color: '#666' }} />
                          <Typography variant="body2">{sub.fileName}</Typography>
                        </Box>
                      </TableCell>
                      
                      {/* Submission Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {sub.submissionDate ? new Date(sub.submissionDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      
                      {/* Download Button */}
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<DownloadIcon />}
                          onClick={async () => {
                            try {
                              const response = await api.get(
                                `/api/assignments/download/file/${sub.id}?assignmentId=${sub.assignmentId}&fileName=${encodeURIComponent(sub.fileName)}`,
                                { responseType: 'blob' }
                              );
                              const url = window.URL.createObjectURL(new Blob([response.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', sub.fileName);
                              document.body.appendChild(link);
                              link.click();
                              link.remove();
                            } catch (error) {
                              console.error('Failed to download file:', error);
                              toast.error("Failed to download file");
                            }
                          }}
                          sx={{
                            borderRadius: '6px',
                            textTransform: 'none',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          Download
                        </Button>
                      </TableCell>
                      
                      {/* Status */}
                      <TableCell>
                        <Chip 
                          label={sub.status || 'Pending'}
                          size="small"
                          color={
                            sub.status === 'accepted' ? 'success' : 
                            sub.status === 'rejected' ? 'error' : 
                            'default'
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      
                      {/* Comments/Feedback */}
                      <TableCell>
                        {user?.type === "STUDENT" ? (
                          /* Student view - Read-only teacher feedback */
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {sub.message || 'No feedback yet'}
                            </Typography>
                          </Box>
                        ) : (
                          /* Teacher view - Editable comment field */
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                              size="small"
                              variant="outlined"
                              value={sub.message || ''}
                              placeholder="Enter feedback"
                              onChange={(e) => {
                                const updated = [...submissions];
                                updated[idx].message = e.target.value;
                                setSubmissions(updated);
                              }}
                              sx={{ flex: 1, minWidth: '200px' }}
                            />
                          </Box>
                        )}
                      </TableCell>
                      
                      {/* Actions - Only for Teachers */}
                      {user?.type !== "STUDENT" && (
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                              size="small"
                              variant={sub.status === 'accepted' ? 'contained' : 'outlined'}
                              color="success"
                              startIcon={<AcceptIcon />}
                              onClick={() => {
                                const updated = [...submissions];
                                updated[idx].status = 'accepted';
                                setSubmissions(updated);
                              }}
                              sx={{
                                borderRadius: '6px',
                                textTransform: 'none',
                                minWidth: '70px'
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant={sub.status === 'rejected' ? 'contained' : 'outlined'}
                              color="error"
                              startIcon={<RejectIcon />}
                              onClick={() => {
                                const updated = [...submissions];
                                updated[idx].status = 'rejected';
                                setSubmissions(updated);
                              }}
                              sx={{
                                borderRadius: '6px',
                                textTransform: 'none',
                                minWidth: '70px'
                              }}
                            >
                              Reject
                            </Button>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              startIcon={<SaveIcon />}
                              sx={{
                                borderRadius: '6px',
                                textTransform: 'none',
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }
                              }}
                              onClick={() => {
                                const submission = submissions[idx];
                                const payload = {
                                  id: submission.id,
                                  status: submission.status,
                                  message: submission.message
                                };
                                api.put(`/api/assignments/submissions/update/${submission.id}`, payload)
                                  .then(res => {
                                    toast.success("Submission updated");
                                  })
                                  .catch(err => {
                                    toast.error("Failed to update submission");
                                    console.error(err);
                                  });
                              }}
                            >
                              Save
                            </Button>
                            <IconButton
                              color="error"
                              size="small"
                              sx={{
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)'
                                }
                              }}
                              onClick={async () => {
                                const submission = submissions[idx];
                                if (window.confirm("Are you sure you want to delete this submission?")) {
                                  try {
                                    await api.delete(`/api/assignments/submissions/delete/${submission.id}`);
                                    toast.success("Submission deleted");
                                    const updated = submissions.filter((_, i) => i !== idx);
                                    setSubmissions(updated);
                                  } catch (err) {
                                    toast.error("Failed to delete submission");
                                    console.error(err);
                                  }
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {submissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={user?.type === "STUDENT" ? 5 : 7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {user?.type === "STUDENT" 
                            ? "You haven't submitted any work for this assignment yet."
                            : "No student submissions found for this assignment."
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

    </MainCard>
  );
};

export default EditAssignment;
