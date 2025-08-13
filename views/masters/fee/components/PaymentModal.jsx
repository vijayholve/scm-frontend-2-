import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Phone as UpiIcon
} from '@mui/icons-material';

const PaymentModal = ({ 
  open, 
  onClose, 
  fee, 
  onPaymentSuccess,
  maxAmount 
}) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(fee);
  console.log(paymentAmount);
  console.log(paymentMethod);
  console.log(maxAmount);
  const handlePayment = async () => {
    setLoading(true);
    setError('');
   
    try {
      // Validate payment amount
      const amount = parseFloat(paymentAmount);
      // if (amount < 100) {
      //   throw new Error('Minimum payment amount is ₹100');
      // }
      if (amount > maxAmount) {
        throw new Error(`Payment amount cannot exceed ₹${maxAmount}`);
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment gateway integration
      const paymentData = {
        amount,
        method: paymentMethod,
        feeId: fee.feeId,

        receiptNumber: `RCP${Date.now()}`,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      console.log(paymentData);
      
      // Call success callback and handle potential errors
      await onPaymentSuccess(paymentData);
      
      // Reset form only if payment was successful
      setPaymentAmount('');
      setPaymentMethod('upi');
      onClose();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card': return <CardIcon />;
      case 'netbanking': return <BankIcon />;
      case 'upi': return <UpiIcon />;
      default: return <PaymentIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon color="primary" />
          <Typography variant="h6">Payment Gateway</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {fee && (
          <Box sx={{ pt: 2 }}>
            {/* Fee Summary */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {fee.title}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Total Fee Amount:</Typography>
                <Typography>{formatCurrency(fee.totalAmount)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Already Paid:</Typography>
                <Typography color="success.main">{formatCurrency(fee.paidAmount)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontWeight="bold">Outstanding Amount:</Typography>
                <Typography fontWeight="bold" color="error.main">
                  {formatCurrency(maxAmount)}
                </Typography>
              </Box>
            </Box>

            {/* Payment Amount */}
            <TextField
              fullWidth
              label="Payment Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => {
                setPaymentAmount(e.target.value);
                setError('');
              }}
              InputProps={{
                startAdornment: '₹'
              }}
              sx={{ mb: 2 }}
              helperText={`Minimum: ₹100, Maximum: ₹${maxAmount}`}
            />
            
            {/* Quick Amount Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPaymentAmount('1000')}
              >
                ₹1,000
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPaymentAmount((maxAmount / 2).toString())}
              >
                50%
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPaymentAmount(maxAmount.toString())}
              >
                Full Amount
              </Button>
            </Box>

            {/* Payment Method */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UpiIcon color="primary" />
                      <Typography>UPI (PhonePe, GPay, Paytm)</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="netbanking"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BankIcon color="primary" />
                      <Typography>Net Banking</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CardIcon color="primary" />
                      <Typography>Credit/Debit Card</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Security Notice */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                🔒 Your payment is secured with 256-bit SSL encryption. 
                You will be redirected to your selected payment gateway.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePayment}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : getPaymentMethodIcon(paymentMethod)}
          disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || loading}
          sx={{ 
            minWidth: 120,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}
        >
          {loading ? 'Processing...' : `Pay ${paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal; 