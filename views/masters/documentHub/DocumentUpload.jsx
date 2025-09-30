import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import api, { userDetails } from 'utils/apiService';
import { toast } from 'react-toastify';
import SCDSelector from 'ui-component/SCDSelector';
import { useSCDData } from 'contexts/SCDProvider';

const MAX_FILE_MB = 5;

const DocumentUpload = () => {
  const navigate = useNavigate();
  const accountId = userDetails.getAccountId();

  const { schools, classes, divisions, loading: scdLoading } = useSCDData();

  const [loading, setLoading] = useState(false);
  const [filteredClasses, setFilteredClasses] = useState(classes);
  const [schoolId, setSchoolId] = useState('');
  const [classId, setClassId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [className, setClassName] = useState('');
  const [divisionName, setDivisionName] = useState('');
  const [userType, setUserType] = useState('ALL');
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState(null);
  const [fileNameText, setFileNameText] = useState('');

  useEffect(() => {
    setFilteredClasses(!schoolId ? classes : classes.filter((c) => String(c.schoolbranchId) === String(schoolId)));
  }, [classes, schoolId]);

  useEffect(() => {
    // Clear dependent fields when parent changes
    setClassId('');
    setClassName('');
    setDivisionId('');
    setDivisionName('');
  }, [schoolId]);

  const handleFileChange = (event) => {
    const selected = event.target.files && event.target.files[0];
    if (!selected) return;
    const sizeMb = selected.size / (1024 * 1024);
    if (sizeMb > MAX_FILE_MB) {
      toast.error(`File too large. Max ${MAX_FILE_MB}MB allowed.`);
      return;
    }
    setFile(selected);
    setFileNameText(selected.name);
  };

  const validate = () => {
    if (!schoolId) {
      toast.error('Please select a school');
      return false;
    }
    if (!file) {
      toast.error('Please select a file');
      return false;
    }
    return true;
  };

  const buildDocumentPayload = () => {
    return {
      accountId: Number(accountId),
      schoolId: schoolId ? Number(schoolId) : null,
      schoolName: schoolName || null,
      classId: classId ? Number(classId) : null,
      className: className || null,
      divisionId: divisionId ? Number(divisionId) : null,
      divisionName: divisionName || null,
      userType: userType || 'ALL',
      documentName: documentName || (file ? file.name : undefined)
    };
  };

  const resetForm = () => {
    setSchoolId('');
    setClassId('');
    setDivisionId('');
    setUserType('ALL');
    setDocumentName('');
    setFile(null);
    setFileNameText('');
    setSchoolName('');
    setClassName('');
    setDivisionName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const payload = buildDocumentPayload();
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      formData.append('documentRequest', blob);

      await api.post(`/api/documents/v1/upload/${accountId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Document uploaded successfully');
      resetForm();
      navigate('/masters/document-hub');
    } catch (error) {
      // Fallback to non-v1 if backend expects requestPart name "document" not "documentRequest"
      try {
        const formData = new FormData();
        formData.append('file', file);
        const payload = buildDocumentPayload();
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        formData.append('document', blob);
        await api.post(`/api/documents/v1/upload/${accountId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Document uploaded successfully');
        resetForm();
        navigate('/masters/document-hub');
      } catch (err2) {
        toast.error('Failed to upload document');
      }
    } finally {
      setLoading(false);
    }
  };

  // scdAdapter example (place near component state)
  const scdAdapter = {
    values: { schoolId: accountId, classId: classId || '', divisionId: divisionId },
    setFieldValue: (field, value) => {
      if (field === 'classId') setClassId(value);
      else if (field === 'schoolId') setSchoolId(value);
      else if (field === 'divisionId') setDivisionId(value);
    },
    touched: {},
    errors: {}
  };

  // after user selects ids, set display names from SCD lists:
  // e.g. when mapping class id -> className
  const selectedClass = classes.find((c) => String(c.id) === String(classId));
  useEffect(() => {
    setClassName(selectedClass?.name || '');
  }, [selectedClass]);

  return (
    <MainCard title="Upload Document">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: { xs: 1, sm: 2 } }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={schools}
              getOptionLabel={(option) => option?.name || ''}
              value={schools.find((s) => String(s.id) === String(schoolId)) || null}
              onChange={(event, newValue) => {
                setSchoolId(newValue?.id || '');
                setSchoolName(newValue?.name || '');
              }}
              renderInput={(params) => <TextField {...params} label="School *" />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={filteredClasses}
              getOptionLabel={(option) => option?.name || ''}
              value={filteredClasses.find((c) => String(c.id) === String(classId)) || null}
              onChange={(event, newValue) => {
                setClassId(newValue?.id || '');
                setClassName(newValue?.name || '');
              }}
              renderInput={(params) => <TextField {...params} label="Class" />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={divisions}
              getOptionLabel={(option) => option?.name || ''}
              value={divisions.find((d) => String(d.id) === String(divisionId)) || null}
              onChange={(event, newValue) => {
                setDivisionId(newValue?.id || '');
                setDivisionName(newValue?.name || '');
              }}
              renderInput={(params) => <TextField {...params} label="Division" />}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="usertype-select-label">Visible To</InputLabel>
              <Select labelId="usertype-select-label" label="Visible To" value={userType} onChange={(e) => setUserType(e.target.value)}>
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="TEACHER">TEACHER</MenuItem>
                <MenuItem value="STUDENT">STUDENT</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Document Name (optional)" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
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
                <input type="file" name="file" id="doc-upload-file" onChange={handleFileChange} style={{ display: 'none' }} />
                <label htmlFor="doc-upload-file">
                  <Box sx={{ cursor: 'pointer' }}>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#2196F3', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: '#1976D2', fontWeight: 600 }}>
                      📁 Upload Document File
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click to select file or drag & drop (Max {MAX_FILE_MB}MB)
                    </Typography>
                    {fileNameText && <Chip label={`📎 ${fileNameText}`} color="primary" variant="outlined" sx={{ mt: 2 }} />}
                  </Box>
                </label>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth startIcon={<CloudUploadIcon />} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default DocumentUpload;
