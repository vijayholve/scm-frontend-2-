import React from 'react';
import { Box, Typography, Avatar, Grid, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { School as SchoolIcon } from '@mui/icons-material';

const Outer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 920,
  minHeight: 600,
  padding: 28,
  boxSizing: 'border-box',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  display: 'flex',
  justifyContent: 'center'
}));

const Paper = styled(Box)(({ theme }) => ({
  width: '100%',
  background: '#fff',
  padding: 36,
  borderRadius: 8,
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  border: `4px solid ${theme.palette.primary.main}`
}));

const ClassicPaper = styled(Box)(({ theme }) => ({
  width: '100%',
  background: '#fffef8',
  padding: 44,
  borderRadius: 6,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  borderImageSlice: 1,
  border: `10px solid ${theme.palette.primary.dark}`,
  backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.01), rgba(0,0,0,0.02))'
}));

const Watermark = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: -40,
  top: -40,
  fontSize: 220,
  color: theme.palette.primary.main,
  opacity: 0.06,
  transform: 'rotate(-20deg)',
  pointerEvents: 'none',
  userSelect: 'none',
  lineHeight: 1
}));

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 18
});

const LogoCircle = styled(Box)(({ theme }) => ({
  width: 92,
  height: 92,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
}));

const ClassicHeaderLeft = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: 6,
  border: `4px double ${theme.palette.primary.dark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(180deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  color: '#fff'
}));

const Title = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  letterSpacing: 2,
  color: theme.palette.primary.dark
}));

const Recipient = styled(Typography)(({ theme }) => ({
  fontSize: 34,
  fontWeight: 800,
  color: theme.palette.text.primary,
  marginTop: 12
}));

const InfoRow = styled(Grid)({
  marginTop: 10,
  marginBottom: 6
});

const SignatureBox = styled(Box)(({ theme }) => ({
  width: 200,
  textAlign: 'center',
  paddingTop: 18
}));

function ModernCertificate({ data }) {
  const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.replace(/\s+/g, ' ').trim() || '—';
  return (
    <Outer>
      <Paper>
        <Watermark>
          <SchoolIcon fontSize="inherit" />
        </Watermark>

        <Header>
          <LogoCircle>
            <SchoolIcon sx={{ fontSize: 44 }} />
          </LogoCircle>

          <Box>
            <Title variant="subtitle2">Sunshine International Academy</Title>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Leaving Certificate
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (This certificate confirms the student's leaving status from the school)
            </Typography>
          </Box>
        </Header>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This is to certify that the person named below was a bonafide student of Sunshine International Academy and has been relieved
            from the duties and obligations of the school.
          </Typography>

          <Recipient variant="h3">{fullName}</Recipient>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            Roll No: <strong>{data.rollNo || '—'}</strong> &nbsp;|&nbsp; Admission No: <strong>{data.admissionNo || '—'}</strong>
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <InfoRow item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Class
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.className || '—'}
              </Typography>
            </InfoRow>

            <InfoRow item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Division
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.divisionName || '—'}
              </Typography>
            </InfoRow>

            <InfoRow item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.dob ? new Date(data.dob).toLocaleDateString() : '—'}
              </Typography>
            </InfoRow>

            <InfoRow item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Date of Admission
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.admissionDate ? new Date(data.admissionDate).toLocaleDateString() : '—'}
              </Typography>
            </InfoRow>

            <InfoRow item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Date of Leaving
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.leavingDate ? new Date(data.leavingDate).toLocaleDateString() : '—'}
              </Typography>
            </InfoRow>

            <InfoRow item xs={12} sm={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Reason for Leaving
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.reason || '—'}
              </Typography>
            </InfoRow>
          </Grid>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" color="text.secondary">
            Remarks:
          </Typography>
          <Box sx={{ border: '1px dashed rgba(0,0,0,0.08)', borderRadius: 1, p: 2, minHeight: 60, mt: 1 }}>
            <Typography variant="body2">{data.remarks || '—'}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
          <SignatureBox>
            <Box sx={{ height: 56, borderBottom: '1px solid rgba(0,0,0,0.12)' }} />
            <Typography variant="caption" color="text.secondary">
              Registrar
            </Typography>
          </SignatureBox>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Principal
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sunshine International Academy
            </Typography>
            <Box sx={{ mt: 1 }} />
            <Typography variant="caption">{new Date().toLocaleDateString()}</Typography>
          </Box>

          <SignatureBox>
            <Box sx={{ height: 56, borderBottom: '1px solid rgba(0,0,0,0.12)' }} />
            <Typography variant="caption" color="text.secondary">
              Class Teacher
            </Typography>
          </SignatureBox>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Document ID: {data.documentId || 'LC-' + (data.id || '0000')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 1,
                background: 'linear-gradient(180deg,#f5f5f5,#fff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                QR
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              www.sunshineacademy.edu • info@sunshineacademy.edu
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Outer>
  );
}

function ClassicCertificate({ data }) {
  const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.replace(/\s+/g, ' ').trim() || '—';
  return (
    <Outer>
      <ClassicPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <ClassicHeaderLeft>
            <SchoolIcon sx={{ fontSize: 48, opacity: 0.95 }} />
          </ClassicHeaderLeft>

          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#2c3e50', letterSpacing: 2 }}>
              Sunshine International Academy
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, marginTop: 1 }}>
              Leaving Certificate
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.6)' }}>
              (Official Document)
            </Typography>
          </Box>

          <Box sx={{ width: 120, textAlign: 'right' }}>
            <Avatar sx={{ bgcolor: 'transparent', border: '4px double rgba(0,0,0,0.06)', width: 96, height: 96 }}>
              <SchoolIcon sx={{ fontSize: 44, color: '#2c3e50' }} />
            </Avatar>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)' }}>
            This certifies that the person named below was enrolled at Sunshine International Academy and has been duly relieved.
          </Typography>

          <Recipient variant="h3" sx={{ color: '#2c3e50', marginTop: 2 }}>
            {fullName}
          </Recipient>

          <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mt: 1 }}>
            Roll No: <strong>{data.rollNo || '—'}</strong> &nbsp;|&nbsp; Admission No: <strong>{data.admissionNo || '—'}</strong>
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Class & Division
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {(data.className || '—') + ' — ' + (data.divisionName || '—')}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Date of Birth
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.dob ? new Date(data.dob).toLocaleDateString() : '—'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Remarks
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.remarks || '—'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Date of Admission
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.admissionDate ? new Date(data.admissionDate).toLocaleDateString() : '—'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Date of Leaving
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.leavingDate ? new Date(data.leavingDate).toLocaleDateString() : '—'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Reason for Leaving
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.reason || '—'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Box sx={{ height: 56, borderBottom: '1px solid rgba(0,0,0,0.12)', width: 220 }} />
            <Typography variant="caption" color="text.secondary">
              Registrar
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 900 }}>
              Principal
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sunshine International Academy
            </Typography>
            <Box sx={{ mt: 1 }} />
            <Typography variant="caption">{new Date().toLocaleDateString()}</Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ height: 56, borderBottom: '1px solid rgba(0,0,0,0.12)', width: 220, marginLeft: 'auto' }} />
            <Typography variant="caption" color="text.secondary">
              Class Teacher
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Document ID: {data.documentId || 'LC-' + (data.id || '0000')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 1,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Seal
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              www.sunshineacademy.edu • info@sunshineacademy.edu
            </Typography>
          </Box>
        </Box>
      </ClassicPaper>
    </Outer>
  );
}

export default function LeavingCertificateTemplate({ data = {}, template = 'modern' }) {
  if (template === 'classic') {
    return <ClassicCertificate data={data} />;
  }
  return <ModernCertificate data={data} />;
}
