import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const FeeCard = ({ 
  fee, 
  onPayNow, 
  showPayButton = true, 
  variant = 'default' 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckIcon color="success" />;
      case 'partial': return <PaymentIcon color="warning" />;
      case 'pending': return <ScheduleIcon color="info" />;
      case 'overdue': return <WarningIcon color="error" />;
      default: return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'pending': return 'info';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'overdue': return 'error';
      default: return 'primary';
    }
  };

  const getCardBackground = (status) => {
    if (variant === 'student') {
      switch (status) {
        case 'paid': return 'linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)';
        case 'partial': return 'linear-gradient(135deg, #ffd3a5 0%, #fd9853 100%)';
        case 'overdue': return 'linear-gradient(135deg, #ff8a80 0%, #ff5252 100%)';
        default: return 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
      }
    }
    return undefined;
  };

  const calculateProgress = () => {
    if (fee.totalAmount === 0) return 0;
    return (fee.paidAmount / fee.totalAmount) * 100;
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(fee.dueDate);
    return today > dueDate && fee.remaining > 0;
  };

  const daysDifference = () => {
    const today = new Date();
    const dueDate = new Date(fee.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff;
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: isOverdue() ? '2px solid #f44336' : '1px solid #e0e0e0',
        background: getCardBackground(fee.status),
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              {fee.feeTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Due: {new Date(fee.dueDate).toLocaleDateString()}
              {daysDifference() >= 0 && daysDifference() <= 7 && (
                <Chip 
                  label={`${daysDifference()} days left`} 
                  size="small" 
                  color="warning" 
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon(fee.status)}
            <Chip 
              label={fee.status?.toUpperCase()} 
              color={getStatusColor(fee.status)} 
              size="small"
            />
          </Box>
        </Box>

        {/* Amount Details */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Total Amount:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatCurrency(fee.totalAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Paid:</Typography>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              {formatCurrency(fee.paidAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">Due:</Typography>
            <Typography 
              variant="body2" 
              color={fee.remaining > 0 ? 'error.main' : 'success.main'} 
              fontWeight="bold"
            >
              {formatCurrency(fee.remaining)}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Payment Progress</Typography>
              <Typography variant="caption">{Math.round(calculateProgress())}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={calculateProgress()} 
              color={getProgressColor(fee.status)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {/* Additional Info */}
        {fee.installments && fee.installments.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Installments ({fee.installments.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {fee.installments.map((installment, index) => (
                <Chip
                  key={installment.id || index}
                  label={`${index + 1}: ${formatCurrency(installment.amount)}`}
                  size="small"
                  color={installment.status === 'paid' ? 'success' : 'default'}
                  variant={installment.status === 'paid' ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </>
        )}

        {/* Action Buttons */}
        {showPayButton && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {fee.remaining > 0 ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<PaymentIcon />}
                onClick={() => onPayNow(fee)}
                sx={{ 
                  background: isOverdue() 
                    ? 'linear-gradient(45deg, #f44336 30%, #ff5722 90%)'
                    : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    background: isOverdue() 
                      ? 'linear-gradient(45deg, #d32f2f 30%, #f57c00 90%)'
                      : 'linear-gradient(45deg, #e91e63 30%, #ff7043 90%)'
                  }
                }}
              >
                {isOverdue() ? 'Pay Now (Overdue)' : 'Pay Now'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckIcon />}
                disabled
                color="success"
              >
                Fully Paid
              </Button>
            )}
          </Box>
        )}

        {/* Overdue Warning */}
        {isOverdue() && (
          <Box sx={{ 
            mt: 2, 
            p: 1, 
            bgcolor: 'error.light', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <WarningIcon color="error" fontSize="small" />
            <Typography variant="caption" color="error.main">
              This fee is overdue by {Math.abs(daysDifference())} days. 
              {fee.lateFee && ` Late fee: ${formatCurrency(fee.lateFee)}`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FeeCard; 