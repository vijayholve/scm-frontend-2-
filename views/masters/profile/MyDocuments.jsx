// src/views/masters/profile/MyDocuments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button, IconButton, Chip } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import api, { userDetails } from 'utils/apiService';

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = userDetails.getUser();

    const fetchDocuments = useCallback(async () => {
        if (!user?.accountId || !user?.id) {
            setError('User not authenticated.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/api/documents/getAllBy/${user.accountId}`, {
                page: 0,
                size: 1000,
                sortBy: 'id',
                sortDir: 'asc',
                schoolId: user.schoolId,
                classId: user.classId,
                divisionId: user.divisionId,
                userType: user.type
            });
            setDocuments(response.data.content || []);
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError('Failed to load documents.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDownload = async (doc) => {
        try {
            const response = await api.get(`/api/documents/download/${user.accountId}/${doc.id}`, {
                responseType: 'blob',
                
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Document downloaded successfully!');
        } catch (error) {
            console.error('Failed to download file:', error);
            toast.error('Failed to download file.');
        }
    };

    if (loading) {
        return (
            <MainCard title="My Documents">
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="My Documents">
                <Alert severity="error">{error}</Alert>
            </MainCard>
        );
    }

    return (
        <MainCard title="My Documents">
            {documents.length > 0 ? (
                <List dense>
                    {documents.map((doc) => (
                        <ListItem key={doc.id} secondaryAction={
                            <IconButton edge="end" onClick={() => handleDownload(doc)} title="Download">
                                <DownloadIcon />
                            </IconButton>
                        }>
                            <ListItemText
                                primary={<Typography variant="subtitle1">{doc.fileName}</Typography>}
                                secondary={
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip label={`Visible To: ${doc.userType}`} size="small" />
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" align="center" color="text.secondary">
                    No documents found.
                </Typography>
            )}
        </MainCard>
    );
};

export default MyDocuments;