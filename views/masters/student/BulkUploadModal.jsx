import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CloudUpload as UploadIcon, FileDownload as DownloadIcon } from '@mui/icons-material';
import api from 'utils/apiService';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const BulkUploadModal = ({ open, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  // SCD selector state
  const scd = useSelector((state) => state.scd || {}); // scdProvider / scdSlice should populate this
  const schools = scd.schools || scd.schoolList || [];
  const classesList = scd.classes || scd.classList || [];
  const divisions = scd.divisions || scd.divisionList || [];

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  const isScdSelected = selectedSchool && selectedClass && selectedDivision;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setError('');
      setUploadResult(null); // Reset result when a new file is selected
    } else {
      setFile(null);
      setError('Please select a valid Excel file (.xlsx).');
    }
  };

  const handleDownloadSample = async () => {
    try {
      setLoading(true);

      // Make a GET request to the backend API to download the file
      const response = await api.get('/api/users/upload/template', {
        responseType: 'blob' // Important: Set responseType to 'blob' to handle binary data
      });

      // Create a URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sample_student_upload.xlsx'); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the URL object

      toast.success('Sample file downloaded successfully!');
    } catch (err) {
      console.error('Failed to download sample file:', err);
      toast.error('Failed to download sample file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!isScdSelected) {
      setError('Please select School, Class and Division before uploading.');
      return;
    }

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    // include SCD selection in form data so backend can associate uploaded users
    formData.append('schoolId', selectedSchool);
    formData.append('classId', selectedClass);
    formData.append('divisionId', selectedDivision);

    try {
      const response = await api.post('/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadResult(response.data);
      toast.success(`${response.data.successCount} students uploaded successfully!`);
      // if (typeof onUploadSuccess === 'function') onUploadSuccess(response.data);
      // Keep the modal open to show the result
    } catch (err) {
      setError('Failed to upload file. Please check the format and try again.');
      toast.error('Bulk upload failed.');
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UploadIcon color="primary" />
          <Typography variant="h5">Bulk Student Upload</Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Select School, Class and Division first. After selection, upload the filled Excel file.
        </Typography>

        {/* SCD selectors */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="school-select-label">School</InputLabel>
            <Select
              labelId="school-select-label"
              label="School"
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                setSelectedClass('');
                setSelectedDivision('');
                setUploadResult(null);
                setError('');
              }}
            >
              <MenuItem value="">Select School</MenuItem>
              {schools.map((s) => (
                <MenuItem key={s.id ?? s.schoolId} value={s.id ?? s.schoolId}>
                  {s.schoolName ?? s.name ?? s.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth disabled={!selectedSchool}>
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              label="Class"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedDivision('');
                setUploadResult(null);
                setError('');
              }}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classesList
                .filter((c) => {
                  if (!selectedSchool) return true;
                  // some scd shapes include schoolId on class entries
                  return c.schoolId ? String(c.schoolId) === String(selectedSchool) : true;
                })
                .map((c) => (
                  <MenuItem key={c.id ?? c.classId} value={c.id ?? c.classId}>
                    {c.className ?? c.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth disabled={!selectedClass}>
            <InputLabel id="division-select-label">Division</InputLabel>
            <Select
              labelId="division-select-label"
              label="Division"
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setUploadResult(null);
                setError('');
              }}
            >
              <MenuItem value="">Select Division</MenuItem>
              {divisions
                .filter((d) => {
                  if (!selectedClass) return true;
                  // some scd shapes include classId on division entries
                  return d.classId ? String(d.classId) === String(selectedClass) : true;
                })
                .map((d) => (
                  <MenuItem key={d.id ?? d.divisionId} value={d.id ?? d.divisionId}>
                    {d.divisionName ?? d.name ?? d.displayName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadSample} disabled={loading}>
            {loading ? 'Downloading...' : 'Download Sample Excel File'}
          </Button>
        </Box>

        <Box
          sx={{
            border: '2px dashed #e0e0e0',
            borderRadius: '8px',
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            borderColor: error ? 'error.main' : 'divider',
            '&:hover': { borderColor: 'primary.main' }
          }}
          onClick={() => {
            if (!isScdSelected) {
              setError('Please select School, Class and Division first.');
              return;
            }
            document.getElementById('file-input').click();
          }}
        >
          <input type="file" id="file-input" accept=".xlsx" style={{ display: 'none' }} onChange={handleFileChange} />
          <UploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {file ? file.name : 'Click to select an .xlsx file'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maximum file size: 5MB
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {uploadResult && (
          <Paper elevation={2} sx={{ p: 2, mt: 2, backgroundColor: 'background.default' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="h6">Upload Summary</Typography>
              {/* optional: download full response as JSON */}
              <IconButton
                size="small"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(uploadResult, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'upload-result.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                title="Download result JSON"
              >
                <DownloadIcon />
              </IconButton>
            </Box>

            <Typography color="success.main" sx={{ fontWeight: 700 }}>
              Created: {uploadResult.successCount ?? 0}
            </Typography>
            <Typography color="error.main" sx={{ fontWeight: 700 }}>
              Failed: {uploadResult.failCount ?? 0}
            </Typography>
            <Typography>
              Total processed: {uploadResult.totalCount ?? (uploadResult.successCount ?? 0) + (uploadResult.failCount ?? 0)}
            </Typography>

            {/* Success details if backend returns items (optional) */}
            {uploadResult.successCount > 0 && uploadResult.successes && Array.isArray(uploadResult.successes) && (
              <Box mt={2}>
                <Typography variant="subtitle1" color="success.main">
                  Created Users
                </Typography>
                <List dense>
                  {uploadResult.successes.map((s, i) => (
                    <ListItem key={`succ-${i}`}>
                      <ListItemText primary={s.userName ?? s.studentName ?? s.email ?? String(s.id ?? i)} secondary={s.message ?? null} />
                      <Chip label="Created" color="success" size="small" />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Failure details: support object map or array of failures */}
            {uploadResult.failCount > 0 && uploadResult.failures && (
              <Box mt={2}>
                <Typography variant="subtitle1" color="error.main">
                  Failure Details
                </Typography>

                {typeof uploadResult.failures === 'object' && !Array.isArray(uploadResult.failures) ? (
                  <List dense>
                    {Object.entries(uploadResult.failures).map(([key, val]) => (
                      <ListItem key={key} alignItems="flex-start" sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {key}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {String(val)}
                            </Typography>
                          }
                        />
                        <Chip label="Failed" color="error" size="small" />
                      </ListItem>
                    ))}
                  </List>
                ) : Array.isArray(uploadResult.failures) ? (
                  <List dense>
                    {uploadResult.failures.map((f, idx) => (
                      <ListItem key={`fail-${idx}`} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={f.record ?? f.name ?? `Record ${idx + 1}`}
                          secondary={f.error ?? f.message ?? JSON.stringify(f)}
                        />
                        <Chip label="Failed" color="error" size="small" />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {String(uploadResult.failures)}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || loading || !isScdSelected}
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUploadModal;
