import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Visibility as PreviewIcon,
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import api, { userDetails } from '../../../utils/apiService';
import { toast } from 'react-hot-toast';
import LeavingCertificateTemplate from './LeavingCertificateTemplate';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    minWidth: '900px',
    maxWidth: '95vw',
    maxHeight: '90vh'
  }
}));

const TemplateCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    border: `2px solid ${theme.palette.primary.light}`
  },
  height: '100%'
}));

const PreviewContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 340,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  border: '2px dashed #ddd',
  margin: '16px 0'
});

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean modern certificate with simple layout' },
  { id: 'classic', name: 'Classic', description: 'Classic bordered design suitable for formal use' }
];

const LeavingCertificateGenerationModal = ({ open, onClose, selectedRows = [], onComplete }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const certRef = useRef();
  const accountId = userDetails.getAccountId();

  useEffect(() => {
    if (open && selectedRows.length > 0) {
      fetchSelectedData();
    }
  }, [open, selectedRows]);

  const fetchSelectedData = async () => {
    setLoading(true);
    try {
      // endpoint expects array of ids; adapt if backend differs
      const endpoint = `/api/users/findAll/${accountId}?type=STUDENT`;
      const response = await api.post(endpoint, [...selectedRows]);
      const data = response.data || [];
      setSelectedData(data);
      if (data.length > 0) setPreviewData(data[0]);
    } catch (error) {
      console.error('Error fetching selected students for leaving cert:', error);
      toast.error('Failed to fetch selected student records');
      setSelectedData([]);
      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId) => setSelectedTemplate(templateId);

  const generateHtmlForPdf = (dataItem) => {
    // Use LeavingCertificateTemplate for preview; for PDF we render HTML via same structure
    // Simpler HTML string to ensure consistent PDF rendering
    const fullName = `${dataItem.firstName || ''} ${dataItem.middleName || ''} ${dataItem.lastName || ''}`.trim();
    return `
      <div style="width:800px; padding:40px; font-family: Arial, sans-serif; background:#fff; color:#111;">
        <div style="text-align:center; margin-bottom:24px;">
          <h2 style="margin:0">SUNSHINE HIGH SCHOOL</h2>
          <div style="font-size:14px; color:#666">Leaving Certificate</div>
        </div>
        <div style="padding:0 20px; font-size:14px; line-height:1.5;">
          <p>This is to certify that <strong>${fullName}</strong> (Roll No: <strong>${dataItem.rollNo || '—'}</strong>), of Class <strong>${dataItem.className || '—'}</strong> - <strong>${dataItem.divisionName || '—'}</strong>, was a bonafide student of Sunshine High School.</p>
          <p>Date of Admission: <strong>${dataItem.admissionDate ? new Date(dataItem.admissionDate).toLocaleDateString() : '—'}</strong></p>
          <p>Date of Leaving: <strong>${dataItem.leavingDate ? new Date(dataItem.leavingDate).toLocaleDateString() : '—'}</strong></p>
          ${dataItem.reason ? `<p><strong>Reason:</strong> ${dataItem.reason}</p>` : ''}
        </div>
        <div style="margin-top:48px; display:flex; justify-content:space-between; padding:0 20px;">
          <div style="text-align:left;"><div style="height:48px"></div><div style="font-size:12px;color:#666">Registrar</div></div>
          <div style="text-align:right;"><div style="height:48px"></div><div style="font-size:12px;color:#666">Principal</div><div style="font-size:12px;color:#666">${new Date().toLocaleDateString()}</div></div>
        </div>
      </div>
    `;
  };

  const handlePrint = async () => {
    if (!previewData) return;
    setIsGenerating(true);
    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Leaving Certificates</title></head><body>');
      for (let i = 0; i < selectedData.length; i++) {
        const html = generateHtmlForPdf(selectedData[i]);
        printWindow.document.write(`<div style="page-break-after: always;">${html}</div>`);
      }
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      toast.success('Sent leaving certificates to printer');
    } catch (err) {
      console.error(err);
      toast.error('Failed to print certificates');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!previewData) return;
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < selectedData.length; i++) {
        if (i > 0) pdf.addPage();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = generateHtmlForPdf(selectedData[i]);
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '800px';
        document.body.appendChild(tempDiv);
        try {
          const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true, allowTaint: true });
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 190; // mm approx for A4 with margin
          const pageWidth = 210;
          const x = (pageWidth - imgWidth) / 2;
          pdf.addImage(imgData, 'PNG', x, 10, imgWidth, (imgWidth * canvas.height) / canvas.width);
        } finally {
          document.body.removeChild(tempDiv);
        }
      }

      const fileName = `leaving_certificates_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast.success('PDF generated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PersonIcon color="primary" />
            <Typography variant="h4">Generate Leaving Certificate</Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={isGenerating}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Select Template</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {templates.map((t) => (
                  <Grid item xs={6} md={4} key={t.id}>
                    <TemplateCard selected={selectedTemplate === t.id} onClick={() => handleTemplateChange(t.id)}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: 1, mb: 1 }}>
                          <PreviewIcon sx={{ fontSize: 40, color: '#999' }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600}>{t.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{t.description}</Typography>
                      </CardContent>
                    </TemplateCard>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Preview ({selectedData.length} selected)</Typography>
              {previewData ? (
                <PreviewContainer>
                  <Paper elevation={3} sx={{ padding: 2, maxWidth: '90%', overflow: 'hidden' }}>
                    <div ref={certRef}>
                      <LeavingCertificateTemplate data={previewData} template={selectedTemplate} />
                    </div>
                  </Paper>
                </PreviewContainer>
              ) : (
                <PreviewContainer>
                  <Typography color="text.secondary">No data available for preview</Typography>
                </PreviewContainer>
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isGenerating} variant="outlined">Cancel</Button>
        <Button onClick={handlePrint} disabled={!previewData || isGenerating} variant="outlined" startIcon={isGenerating ? <CircularProgress size={20} /> : <PrintIcon />}>
          {isGenerating ? 'Processing...' : 'Print'}
        </Button>
        <Button onClick={handleDownload} disabled={!previewData || isGenerating} variant="contained" startIcon={isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />}>
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default LeavingCertificateGenerationModal;