import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const FeeReceiptModal = ({ 
  open, 
  onClose, 
  receipt,
  studentInfo 
}) => {

  console.log(receipt);
  console.log(studentInfo);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock PDF download
    alert('Receipt download will be implemented with PDF generation library');
  };

  if (!receipt) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6">Payment Receipt</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Paper sx={{ p: 3, mt: 2 }} id="receipt-content">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {studentInfo?.schoolInfo?.schoolName || 'School Management System'}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Fee Payment Receipt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Receipt No: {receipt.receiptNumber}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Student & Payment Info */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Student Information
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Student Name:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{studentInfo?.firstName} {studentInfo?.lastName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Class:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{studentInfo?.classInfo?.className}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Roll Number:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{studentInfo?.rollNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>School:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{studentInfo?.schoolInfo?.schoolName}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Payment Information
              </Typography>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Receipt Number:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{receipt.receiptNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Date:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{formatDate(receipt.date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Time:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{formatTime(receipt.date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Payment Method:</TableCell>
                    <TableCell sx={{ border: 'none' }}>{receipt.paymentMode || receipt.mode}</TableCell>
                  </TableRow>
                  {receipt.transactionId && (
                    <TableRow>
                      <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Transaction ID:</TableCell>
                      <TableCell sx={{ border: 'none' }}>{receipt.transactionId}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Fee Details */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Fee Details
          </Typography>
          <Table sx={{ border: '1px solid #e0e0e0' }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Fee Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Amount</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{receipt.feeTitle}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {formatCurrency(receipt.amount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Payment Summary */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                  Total Amount Paid:
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                  {formatCurrency(receipt.amount)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              This is a computer-generated receipt and does not require a signature.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For any queries, please contact the accounts office.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Generated on: {formatDate(new Date())} at {formatTime(new Date())}
            </Typography>
          </Box>

          {/* Watermark */}
          <Box sx={{ 
            position: 'relative',
            '&::after': {
              content: '"PAID"',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: '4rem',
              fontWeight: 'bold',
              color: 'success.main',
              opacity: 0.1,
              zIndex: 0,
              pointerEvents: 'none'
            }
          }} />
        </Paper>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
        <Button 
          onClick={handlePrint} 
          startIcon={<PrintIcon />}
          variant="outlined"
        >
          Print
        </Button>
        <Button 
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          variant="contained"
          sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeeReceiptModal; 