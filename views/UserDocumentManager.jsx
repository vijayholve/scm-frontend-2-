import React, { useEffect, useState, useCallback } from 'react';
import SaveIcon from '@mui/icons-material/Save'; // Import a save icon
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import api, { userDetails, getDocumentsByAccountAndUser, downloadUserDocument } from 'api';
import MainCard from 'ui-component/cards/MainCard';
import ReusableLoader from 'ui-component/loader/ReusableLoader';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UserDocumentManager = ({ userId, userType }) => {
  const accountId = userDetails.getAccountId();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: '', file: null });
  const [uploadError, setUploadError] = useState('');
  const [loader, setLoader] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch documents for this accountId/userId using new API: GET /api/documents/{accountId}/{userId}
      const response = await getDocumentsByAccountAndUser(accountId, userId);
      // support both array and paged responses
      setDocuments(Array.isArray(response.data) ? response.data : response.data.content || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load user documents.');
    } finally {
      setLoading(false);
    }
  }, [userId, accountId]);

  useEffect(() => {
    if (userId) {
      fetchDocuments();
    }
  }, [userId, fetchDocuments]);

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewDocument({ name: '', file: null });
    setUploadError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError('File is too large (max 5MB).');
        setNewDocument({ ...newDocument, file: null });
        return;
      }
      setNewDocument({ ...newDocument, file });
      setUploadError('');
    }
  };

  const handleUploadDocument = async () => {
    if (!newDocument.name.trim() || !newDocument.file) {
      setUploadError('Please provide a document name and select a file.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', newDocument.file);

    // Correct payload for POST /api/documents/v1/upload/{accountId}
    const documentRequest = {
      documentName: newDocument.name,
      userId: userId,
      userType: userDetails.getUser().type, // Assuming userType is from logged-in user
      accountId: accountId
      // Other fields like schoolId, classId etc. can be added here if needed
    };
    formData.append('documentRequest', new Blob([JSON.stringify(documentRequest)], { type: 'application/json' }));

    try {
      await api.post(`/api/documents/v1/upload/${accountId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Document uploaded successfully!');
      handleCloseAddModal();
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        // Correct API endpoint for deleting a document
        await api.delete(`/api/documents/delete/${documentId}`);
        toast.success('Document deleted successfully!');
        fetchDocuments();
      } catch (error) {
        console.error('Failed to delete document:', error);
        toast.error('Failed to delete document.');
      }
    }
  };
  const handleDownload = async (doc) => {
    setLoader(true);
    try {
      const fileName = doc.fileName || doc.documentName || 'document';
      // Use helper to download blob
      const response = await downloadUserDocument(accountId, userId, doc.id);
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
      toast.error('Error downloading the file.');
    } finally {
      setLoader(false);
    }
  };

  if (loader) {
    return <ReusableLoader message="Loading For Downloading Document" />;
  }
  return (
    <MainCard title="User Documents">
      {loading ? (
        <LinearProgress />
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal}>
              Add Document
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Uploaded On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.documentName}</TableCell>
                      <TableCell>{new Date(doc.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Tooltip title="Download">
                          <IconButton color="info" onClick={() => handleDownload(doc)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteDocument(doc.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                        No documents found for this user.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Document Name"
                fullWidth
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ border: uploadError ? '2px solid red' : '' }}>
                <CardContent>
                  <input type="file" style={{ display: 'none' }} id="document-upload" onChange={handleFileChange} />
                  <label htmlFor="document-upload">
                    <Button variant="contained" component="span" startIcon={<UploadIcon />} disabled={isUploading}>
                      Select File
                    </Button>
                  </label>
                  {newDocument.file && (
                    <Chip label={newDocument.file.name} onDelete={() => setNewDocument({ ...newDocument, file: null })} sx={{ ml: 2 }} />
                  )}
                  {uploadError && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {uploadError}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUploadDocument}
            variant="contained"
            disabled={!newDocument.name || !newDocument.file || isUploading}
            startIcon={isUploading ? null : <SaveIcon />}
          >
            {isUploading ? 'Uploading...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UserDocumentManager;
