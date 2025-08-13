import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// material-ui
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
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

// project imports
import IdCardTemplate from './IdCardTemplate';
import api from '../../../utils/apiService';
import { toast } from 'react-hot-toast';

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
    minHeight: '300px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '2px dashed #ddd',
    margin: '16px 0'
});

const templates = [
    {
        id: 'modern',
        name: 'Modern Design',
        description: 'Clean and contemporary design with vibrant colors',
        preview: '/preview-modern.png' // You can add actual preview images
    },
    {
        id: 'classic',
        name: 'Classic Border',
        description: 'Traditional design with elegant borders',
        preview: '/preview-classic.png'
    },
    {
        id: 'minimal',
        name: 'Minimal Flat',
        description: 'Simple and minimalist flat design',
        preview: '/preview-minimal.png'
    }
];

const IdCardGenerationModal = ({ open, onClose, selectedRows, entityType, onComplete }) => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [loading, setLoading] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [previewData, setPreviewData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const idCardRef = useRef();

    useEffect(() => {
        if (open && selectedRows.length > 0) {
            fetchSelectedData();
        }
    }, [open, selectedRows, entityType]);

    const fetchSelectedData = async () => {
        setLoading(true);
        try {
            const endpoint = entityType === 'students' ? '/api/students/findall' : '/api/users/findall';
            const response = await api.post(endpoint, {
                page: 0,
                pageSize: selectedRows.length,
                ids: selectedRows
            });
            
            const data = response.data.content || [];
            setSelectedData(data);
            
            // Set first record as preview data
            if (data.length > 0) {
                setPreviewData(data[0]);
            }
        } catch (error) {
            console.error('Error fetching selected data:', error);
            toast.error('Failed to fetch selected records');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateChange = (templateId) => {
        setSelectedTemplate(templateId);
    };

    const handlePrint = async () => {
        if (!previewData) return;
        
        setIsGenerating(true);
        try {
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>ID Cards</title>
                        <style>
                            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                            .page-break { page-break-after: always; }
                            .id-card-container { margin-bottom: 20px; }
                            @media print {
                                body { margin: 0; }
                                .page-break:last-child { page-break-after: avoid; }
                            }
                        </style>
                    </head>
                    <body>
            `);

            // Generate HTML for all selected records
            for (let i = 0; i < selectedData.length; i++) {
                const cardHtml = generateIdCardHtml(selectedData[i], selectedTemplate);
                printWindow.document.write(`
                    <div class="id-card-container ${i < selectedData.length - 1 ? 'page-break' : ''}">
                        ${cardHtml}
                    </div>
                `);
            }

            printWindow.document.write('</body></html>');
            printWindow.document.close();
            
            // Wait for content to load then print
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);

            toast.success('ID cards sent to printer successfully!');
        } catch (error) {
            console.error('Error printing ID cards:', error);
            toast.error('Failed to print ID cards');
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
                if (i > 0) {
                    pdf.addPage();
                }

                // Create a temporary div to render the ID card
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = generateIdCardHtml(selectedData[i], selectedTemplate);
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.top = '-9999px';
                tempDiv.style.width = '350px';
                tempDiv.style.height = '220px';
                document.body.appendChild(tempDiv);

                try {
                    const canvas = await html2canvas(tempDiv, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = 85; // mm
                    const imgHeight = 54; // mm (standard ID card ratio)
                    
                    // Center the ID card on the page
                    const x = (210 - imgWidth) / 2; // A4 width is 210mm
                    const y = (297 - imgHeight) / 2; // A4 height is 297mm
                    
                    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                } finally {
                    document.body.removeChild(tempDiv);
                }
            }

            const fileName = `${entityType}_id_cards_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            toast.success('ID cards downloaded successfully!');
        } catch (error) {
            console.error('Error downloading ID cards:', error);
            toast.error('Failed to download ID cards');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateIdCardHtml = (data, template) => {
        // For HTML generation, we need to create a simple HTML structure
        // This is a simplified version for print/PDF generation
        const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim();
        const isStudent = entityType === 'students';
        
        return `
            <div style="width: 350px; height: 220px; border: 1px solid #ddd; padding: 16px; font-family: Arial, sans-serif; background: white;">
                <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 12px;">
                    <h3 style="margin: 0; font-size: 14px;">SUNSHINE HIGH SCHOOL</h3>
                    <p style="margin: 4px 0; font-size: 10px;">Excellence in Education</p>
                </div>
                <div style="display: flex; gap: 16px;">
                    <div style="width: 80px; height: 80px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                        <span style="font-size: 10px;">${isStudent ? 'STUDENT' : 'FACULTY'}</span>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 8px 0; font-size: 12px;">${fullName}</h4>
                        ${isStudent && data.rollNo ? `<p style="margin: 2px 0; font-size: 10px;">Roll No: ${data.rollNo}</p>` : ''}
                        ${isStudent && (data.className || data.divisionName) ? `<p style="margin: 2px 0; font-size: 10px;">Class: ${data.className} - ${data.divisionName}</p>` : ''}
                        ${!isStudent && data.role?.roleName ? `<p style="margin: 2px 0; font-size: 10px;">Role: ${data.role.roleName}</p>` : ''}
                        ${data.mobile ? `<p style="margin: 2px 0; font-size: 10px;">Mobile: ${data.mobile}</p>` : ''}
                        ${data.email ? `<p style="margin: 2px 0; font-size: 9px;">Email: ${data.email}</p>` : ''}
                    </div>
                </div>
                <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; text-align: center; border-top: 1px solid #ccc; padding-top: 4px;">
                    <span style="font-size: 8px;">"Empowering Education, Building Future"</span>
                </div>
            </div>
        `;
    };

    const handleClose = () => {
        if (!isGenerating) {
            onClose();
        }
    };

    return (
        <StyledDialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {entityType === 'students' ? <PersonIcon color="primary" /> : <SchoolIcon color="primary" />}
                        <Typography variant="h4">
                            Generate ID Cards - {entityType === 'students' ? 'Students' : 'Teachers'}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} disabled={isGenerating}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Template Selection */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Select ID Card Template
                            </Typography>
                            <Grid container spacing={2}>
                                {templates.map((template) => (
                                    <Grid item xs={12} md={4} key={template.id}>
                                        <TemplateCard 
                                            selected={selectedTemplate === template.id}
                                            onClick={() => handleTemplateChange(template.id)}
                                        >
                                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: '120px',
                                                        backgroundColor: '#f0f0f0',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mb: 2,
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {/* Template preview placeholder */}
                                                    <PreviewIcon sx={{ fontSize: 40, color: '#999' }} />
                                                    {selectedTemplate === template.id && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                backgroundColor: 'primary.main',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Typography variant="caption" color="white">
                                                                ✓
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Typography variant="subtitle1" fontWeight="600">
                                                    {template.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {template.description}
                                                </Typography>
                                            </CardContent>
                                        </TemplateCard>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Preview Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Preview ({selectedData.length} record{selectedData.length !== 1 ? 's' : ''} selected)
                            </Typography>
                            
                            {previewData ? (
                                <PreviewContainer>
                                    <Paper 
                                        elevation={3} 
                                        sx={{ 
                                            transform: 'scale(0.8)', 
                                            transformOrigin: 'center',
                                            maxWidth: '400px',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div ref={idCardRef}>
                                            <IdCardTemplate 
                                                data={previewData} 
                                                template={selectedTemplate}
                                                entityType={entityType}
                                            />
                                        </div>
                                    </Paper>
                                </PreviewContainer>
                            ) : (
                                <PreviewContainer>
                                    <Typography color="text.secondary">
                                        No data available for preview
                                    </Typography>
                                </PreviewContainer>
                            )}

                            {selectedData.length > 1 && (
                                <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                                    <Typography variant="body2" color="primary">
                                        <strong>Note:</strong> {selectedData.length} ID cards will be generated. 
                                        The preview shows the first selected record.
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={handleClose} 
                    disabled={isGenerating}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handlePrint}
                    disabled={!previewData || isGenerating}
                    variant="outlined"
                    startIcon={isGenerating ? <CircularProgress size={20} /> : <PrintIcon />}
                    sx={{ ml: 1 }}
                >
                    {isGenerating ? 'Processing...' : 'Print ID Cards'}
                </Button>
                <Button
                    onClick={handleDownload}
                    disabled={!previewData || isGenerating}
                    variant="contained"
                    startIcon={isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />}
                    sx={{ ml: 1 }}
                >
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default IdCardGenerationModal;