import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  CreditCard as CardIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';
import FeeCard from './components/FeeCard';
import PaymentModal from './components/PaymentModal';
import FeeReceiptModal from './components/FeeReceiptModal';
import { useSelector } from 'react-redux';

const StudentFeeView = () => {
  const [studentInfo, setStudentInfo] = useState({});
  const [fees, setFees] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const user = useSelector((state) => state.user);
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Get student info from current user context
      const [feesRes, historyRes, studentRes] = await Promise.all([
        api.get(`/api/student/fees/${user?.user?.id}`),
        api.get(`/api/student/fees/${user?.user?.id}/history`),
        api.get(`/api/users/getById?id=${user?.user?.id}`)
      ]);
      
      setFees(feesRes?.data?.feeStatus || []);
      setPaymentHistory(historyRes?.data || []);
      console.log(studentRes.data);
      setStudentInfo(studentRes.data || {});
    } catch (error) {
      console.error('Error fetching student data:', error);
      // Mock data for demonstration
      // setStudentInfo({
      //   name: 'Aryan Sharma',
      //   class: '6A',
      //   school: 'Sunrise High School',
      //   rollNumber: '101',
      //   section: 'A'
      // });
      
      setFees([
        {
          id: 1,
          title: 'Term 1 Tuition Fee',
          totalAmount: 12000,
          paidAmount: 9000,
          remaining: 3000,
          dueDate: '2025-08-31',
          status: 'partial',
          installments: [
            { id: 1, amount: 4000, dueDate: '2025-06-30', status: 'paid' },
            { id: 2, amount: 4000, dueDate: '2025-07-31', status: 'paid' },
            { id: 3, amount: 4000, dueDate: '2025-08-31', status: 'pending' }
          ]
        },
        {
          id: 2,
          title: 'Library Fee',
          totalAmount: 1000,
          paidAmount: 1000,
          remaining: 0,
          dueDate: '2025-08-01',
          status: 'paid',
          installments: []
        },
        {
          id: 3,
          title: 'Lab Fee',
          totalAmount: 2500,
          paidAmount: 0,
          remaining: 2500,
          dueDate: '2025-09-15',
          status: 'pending',
          installments: []
        }
      ]);
      
      setPaymentHistory([
        {
          id: 1,
          date: '2025-08-02',
          feeName: 'Term 1 Tuition Fee',
          amount: 9000,
          receiptNumber: 'RCP001',
          paymentMethod: 'UPI'
        },
        {
          id: 2,
          date: '2025-08-01',
          feeName: 'Library Fee',
          amount: 1000,
          receiptNumber: 'RCP002',
          paymentMethod: 'Net Banking'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (fee) => {
    setSelectedFee(fee);
    setOpenPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Update the fee with new payment data
      const updatedFees = fees.map(fee => {
        if (fee.feeId === paymentData.feeId) {
          const newPaidAmount = fee.paidAmount + paymentData.amount;
          const newDueAmount = fee.totalAmount - newPaidAmount;
          return {
            ...fee,
            paidAmount: newPaidAmount,
            remaining: newDueAmount,
            status: newDueAmount === 0 ? 'paid' : 'partial'
          };
        }
        return fee;
      });

      // Create new payment record
      const newPayment = {
        id: Date.now(),
        date: paymentData.timestamp,
        feeTitle: selectedFee.feeTitle,
        amount: paymentData.amount,
        studentFeeId: selectedFee.feeId,
        studentId: selectedFee.studentId,
        receiptNumber: paymentData.receiptNumber,
        paymentMode: paymentData.method,
        transactionId: paymentData.transactionId
      };

      // Update fees via API
      await api.post(`/api/student/fees/pay`,newPayment);

      // Update payment history via API
     // await api.post(`/api/student/fees/${user?.user?.id}/history`, newPayment);
      
      // Update local state only after successful API calls
      setFees(updatedFees);
      setPaymentHistory([newPayment, ...paymentHistory]);

      // Show success message
      setSuccessMessage(`Payment of ₹${paymentData.amount} successful! Receipt: ${paymentData.receiptNumber}`);
      console.log('Payment successful:', paymentData);
    } catch (error) {
      console.error('Error updating payment:', error);
      setErrorMessage('Failed to update payment records. Please contact support.');
      throw new Error('Failed to update payment records. Please contact support.');
    }
  };

  const handleViewReceipt = (payment) => {
    setSelectedReceipt(payment);
    setOpenReceiptModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getTotalDue = () => {
    //if (!Array.isArray(fees)) return 0;
      return fees.reduce((total, fee) => total + (fee?.remaining || 0), 0);
  };

  const getTotalPaid = () => {
    //if (!Array.isArray(fees)) return 0;
    return fees.reduce((total, fee) => total + (fee?.paidAmount || 0), 0);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Student Header */}
      <MainCard sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
            {studentInfo.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              💼 My Fee Details
            </Typography>
            <Typography variant="h6" color="primary">
              Student: {studentInfo.firstName} {studentInfo.lastName}  ({studentInfo.className})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              School: {studentInfo.schoolName} | Roll No: {studentInfo.rollNo}
            </Typography>
          </Box>
        </Box>
      </MainCard>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WalletIcon />
                <Typography variant="h6">Total Due</Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(getTotalDue())}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon />
                <Typography variant="h6">Total Paid</Typography>
              </Box>
              <Typography variant="h4">{formatCurrency(getTotalPaid())}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon />
                <Typography variant="h6">Total Payments</Typography>
              </Box>
              <Typography variant="h4">{paymentHistory.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fee Details Cards */}
      <MainCard title="Fee Details" sx={{ mb: 3 }}>
        <Box>
          {fees.map((fee) => (
            <FeeCard
              key={fee.id}
              fee={fee}
              onPayNow={handlePayNow}
              variant="student"
            />
          ))}
          {fees.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No fees assigned to you at the moment.
              </Typography>
            </Box>
          )}
        </Box>
      </MainCard>

      {/* Payment History */}
      <MainCard title="📜 Payment History">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Fee Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.feeTitle}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.paymentMode || payment.mode} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleViewReceipt(payment)}
                    >
                      View Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paymentHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No payment history found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* Payment Modal */}
      <PaymentModal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        fee={selectedFee}
        onPaymentSuccess={handlePaymentSuccess}
        maxAmount={selectedFee?.remaining || 0}
      />

      {/* Receipt Modal */}
      <FeeReceiptModal
        open={openReceiptModal}
        onClose={() => setOpenReceiptModal(false)}
        receipt={selectedReceipt}
        studentInfo={studentInfo}
      />

      {/* Success Message Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Message Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setErrorMessage('')} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentFeeView; 