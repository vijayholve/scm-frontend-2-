// views/lms/course/LessonContentRenderer.jsx
import React, { useState } from "react";
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Divider, 
    Alert, 
    CircularProgress 
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import api from 'utils/apiService';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// VideoRenderer: Simple video player for video lessons
import PropTypes from "prop-types";

const VideoRenderer = ({ url }) => {
  if (!url) {
    return <Typography color="text.secondary" sx={{ mt: 2 }}>No video link provided.</Typography>;
  }
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <video width="100%" height="360" controls>
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

VideoRenderer.propTypes = {
  url: PropTypes.string
};

// DocumentRenderer: Handles document viewing/download
const DocumentRenderer = ({ documentId, documentName, content, accountId }) => {
  const [downloadLoading, setDownloadLoading] = useState(false);
  
  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      // Assuming a generic download API that uses documentId
      const response = await api.get(`/api/documents/download/${accountId}/${documentId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documentName || 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Document download started.');
    } catch (err) {
      toast.error('Failed to download document.');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {content || "Click below to download the associated document."}
      </Typography>
      <Button 
        variant="contained" 
        startIcon={downloadLoading ? <CircularProgress size={20} color="inherit" /> : <DocumentScannerIcon />}
        onClick={handleDownload}
        disabled={downloadLoading || !documentId}
      >
        {downloadLoading ? "Preparing..." : `Download ${documentName || "Document"}`}
      </Button>
    </Box>
  );
};

const LessonContentRenderer = ({ selectedLesson, accountId }) => {
    const navigate = useNavigate();

    if (!selectedLesson) {
        return (
            <Paper sx={{ p: 3, minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography color="text.secondary">
                    Select a lesson to view its content.
                </Typography>
            </Paper>
        );
    }

    const baseContent = (
        <Box>
            <Typography variant="h5" gutterBottom>{selectedLesson.title}</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                {selectedLesson.content || selectedLesson.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
        </Box>
    );

    const lessonType = selectedLesson.type?.toLowerCase();

    return (
        <Paper sx={{ p: 3 }}>
            {baseContent}
            {lessonType === 'video' && <VideoRenderer url={selectedLesson.link || selectedLesson.url} />}
            
            {lessonType === 'document' && (
                <DocumentRenderer 
                    documentId={selectedLesson.documentId} 
                    documentName={selectedLesson.documentName} 
                    content={selectedLesson.content}
                    accountId={accountId}
                />
            )}
            
            {lessonType === 'test' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    This lesson is an assessment. 
                    {selectedLesson.testName && <Typography variant="body1" sx={{ mt: 1 }}>Test: <strong>{selectedLesson.testName}</strong></Typography>}
                    <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/masters/quiz/attempt/${selectedLesson.testId}`)}
                        disabled={!selectedLesson.testId}
                        startIcon={<PlayArrowIcon />}
                    >
                        Start Test
                    </Button>
                </Alert>
            )}

            {lessonType === 'text' && (
                 <Typography variant="body1" sx={{ mt: 2 }}>
                    {selectedLesson.content || selectedLesson.description || "No specific content provided for this text lesson."}
                </Typography>
            )}
        </Paper>
    );
};

export default LessonContentRenderer;