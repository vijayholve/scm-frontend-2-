import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const VideoRenderer = ({ url }) => {
  if (!url) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No video URL provided.
      </Alert>
    );
  }

  // YouTube video handling
  const getYouTubeEmbedUrl = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Vimeo video handling
  const getVimeoEmbedUrl = (url) => {
    const regex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regex);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  };

  const youtubeUrl = getYouTubeEmbedUrl(url);
  const vimeoUrl = getVimeoEmbedUrl(url);

  if (youtubeUrl || vimeoUrl) {
    return (
      <Box
        sx={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          borderRadius: 2,
          mb: 2
        }}
      >
        <iframe
          src={youtubeUrl || vimeoUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          allowFullScreen
          title="Video Player"
        />
      </Box>
    );
  }

  // Direct video file
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return (
      <Box sx={{ mb: 2 }}>
        <video
          controls
          style={{
            width: '100%',
            maxHeight: '400px',
            borderRadius: '8px'
          }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  }

  // Fallback for other URLs
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="warning">
        Unsupported video format.
        <Typography component="span" sx={{ ml: 1 }}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open video in new tab
          </a>
        </Typography>
      </Alert>
    </Box>
  );
};

export default VideoRenderer;
