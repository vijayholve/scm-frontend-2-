import React from 'react';
import useChatbot from './hooks/useChatbot';
import { Box, Typography, IconButton, CircularProgress, TextField, Button, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ChatbotUI = () => {
  const { messages, input, isLoading, setInput, handleSendMessage, setIsChatOpen, messagesEndRef } = useChatbot();

  // Helper to render results as a table if possible
  const renderResults = (results) => {
    if (!Array.isArray(results) || results.length === 0) return null;
    // If results are array of arrays, render as table
    if (Array.isArray(results[0])) {
      return (
        <Box sx={{ mt: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafafa' }}>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ border: '1px solid #eee', padding: 4 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      );
    }
    // Otherwise, just join as string
    return <Typography variant="body2">{results.join(', ')}</Typography>;
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: '#f9f9f9'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#673ab7', color: '#fff', p: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SCM Assistant
        </Typography>
        {/* <IconButton onClick={() => setIsChatOpen(false)} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton> */}
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {messages.length === 0 && (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            Ask me anything about your SCM!
          </Typography>
        )}
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: msg.sender === 'user' ? '#e1bee7' : '#fff',
              color: '#333',
              px: 2,
              py: 1,
              borderRadius: 2,
              maxWidth: '80%',
              boxShadow: 1,
              mb: 0.5
            }}
          >
            {msg.text && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: msg.sender === 'user' ? 500 : 400,
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.text}
              </Typography>
            )}
            {/* Render results as table if present */}
            {msg.results && renderResults(msg.results)}
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="textSecondary">
              Thinking...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderTop: '1px solid #eee',
          bgcolor: '#fafafa'
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          sx={{ mr: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatbotUI;
