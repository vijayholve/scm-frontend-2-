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
  Paper
} from '@mui/material';
import { CloudUpload as UploadIcon, FileDownload as DownloadIcon } from '@mui/icons-material';
import api from 'utils/apiService';
import { toast } from 'react-hot-toast';

const BulkUploadModal = ({ open, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setError('');
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
        responseType: 'blob', // Important: Set responseType to 'blob' to handle binary data
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
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/api/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Students uploaded successfully!');
      onUploadSuccess(); // Call success callback to notify parent
      onClose(); // Close modal on success
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
          To add multiple students, download the sample Excel file, fill in the details, and upload it here.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadSample}
            disabled={loading}
          >
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
            '&:hover': { borderColor: 'primary.main' },
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            type="file"
            id="file-input"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUploadModal;