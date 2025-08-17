import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, Divider, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard'; // Assuming ui-component alias works

// assets
import {
  IconMail,
  IconId,
  IconPhone,
  IconPrinter
} from '@tabler/icons-react';

/**
 * IDCardDisplay Component
 * Displays a user's ID card with print functionality.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user object containing ID card details.
 */
const IDCardDisplay = ({ user }) => {
  const theme = useTheme();
  const idCardRef = useRef(null);

  const handlePrint = () => {
    const printContent = idCardRef.current;
    const originalContents = document.body.innerHTML;
    const printArea = printContent.outerHTML;

    // Temporarily replace body content with the ID card for printing
    document.body.innerHTML = printArea;
    document.body.style.margin = '0'; // Remove body margin for print
    document.body.style.padding = '0'; // Remove body padding for print

    window.print();

    // Restore original content after printing
    document.body.innerHTML = originalContents;
    document.body.style.margin = '';
    document.body.style.padding = '';
    window.location.reload(); // Reload to ensure all scripts and styles are re-applied correctly
  };

  return (
    <MainCard title="User ID Card" sx={{ mb: 4 }}>
      <Box
        ref={idCardRef}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          p: 3,
          maxWidth: 400, // Fixed width for ID card look
          margin: 'auto',
          boxShadow: theme.shadows[3],
          bgcolor: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          '@media print': { // Styles specifically for printing
            border: 'none',
            boxShadow: 'none',
            p: 0,
            width: '100%', // Take full width on print
            maxWidth: 'none',
            margin: 0,
            display: 'block', // Ensure block display for print layout
            pageBreakAfter: 'always', // Ensures each ID card (if multiple) prints on new page
          }
        }}
        className="id-card-to-print" // Add a class for print CSS targeting
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            fontSize: '3rem',
            border: `2px solid ${theme.palette.primary.main}`,
            mb: 1,
            '@media print': {
              border: '1px solid #ccc',
              boxShadow: 'none',
            }
          }}
          alt="User Avatar"
        >
          {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
          {user?.role?.name || 'N/A'}
        </Typography>

        <Divider sx={{ width: '80%', my: 1, '@media print': { my: 0.5 } }} />

        <Stack spacing={0.5} sx={{ width: '100%', px: 2, '@media print': { px: 0 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconId stroke={1.5} size="1rem" color={theme.palette.grey[600]} />
            <Typography variant="body2">ID: {user?.studentId || 'N/A'}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconMail stroke={1.5} size="1rem" color={theme.palette.grey[600]} />
            <Typography variant="body2">Email: {user?.email || 'N/A'}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconPhone stroke={1.5} size="1rem" color={theme.palette.grey[600]} />
            <Typography variant="body2">Mobile: {user?.mobile || 'N/A'}</Typography>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<IconPrinter />}
          onClick={handlePrint}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
        >
          Print ID Card
        </Button>
      </Box>
    </MainCard>
  );
};

IDCardDisplay.propTypes = {
  user: PropTypes.object.isRequired,
};

export default IDCardDisplay;
