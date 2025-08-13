import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import {
    School as SchoolIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    CalendarToday as CalendarIcon,
    Badge as BadgeIcon,
    Person as PersonIcon
} from '@mui/icons-material';

// Styled components for different templates
const IdCardContainer = styled(Box)({
    width: '350px',
    height: '220px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    backgroundColor: '#fff',
    border: '1px solid #ddd'
});

// Modern Design Template
const ModernTemplate = ({ data, entityType }) => {
    const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim();
    const isStudent = entityType === 'students';
    
    return (
        <IdCardContainer
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 1.5,
                    textAlign: 'center',
                    borderBottom: '2px solid rgba(255,255,255,0.3)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <SchoolIcon sx={{ fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>
                        SUNSHINE HIGH SCHOOL
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontSize: '10px', opacity: 0.9 }}>
                    Excellence in Education
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ display: 'flex', p: 1.5, gap: 1.5 }}>
                {/* Photo Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            border: '3px solid white',
                            fontSize: '24px',
                            backgroundColor: 'rgba(255,255,255,0.2)'
                        }}
                    >
                        {isStudent ? <PersonIcon sx={{ fontSize: 40 }} /> : <SchoolIcon sx={{ fontSize: 40 }} />}
                    </Avatar>
                    <Typography variant="caption" sx={{ mt: 0.5, fontSize: '9px', opacity: 0.8 }}>
                        {isStudent ? 'STUDENT' : 'FACULTY'}
                    </Typography>
                </Box>

                {/* Details Section */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}>
                        {fullName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, fontSize: '10px' }}>
                        {isStudent && data.rollNo && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BadgeIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                    Roll No: {data.rollNo}
                                </Typography>
                            </Box>
                        )}
                        
                        {isStudent && (data.className || data.divisionName) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <SchoolIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                    Class: {data.className} - {data.divisionName}
                                </Typography>
                            </Box>
                        )}
                        
                        {!isStudent && data.role?.roleName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BadgeIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                    Role: {data.role.roleName}
                                </Typography>
                            </Box>
                        )}

                        {data.dob && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                    DOB: {new Date(data.dob).toLocaleDateString()}
                                </Typography>
                            </Box>
                        )}

                        {data.mobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                    {data.mobile}
                                </Typography>
                            </Box>
                        )}

                        {data.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 12, opacity: 0.8 }} />
                                <Typography variant="caption" sx={{ fontSize: '9px', wordBreak: 'break-all' }}>
                                    {data.email}
                                </Typography>
                            </Box>
                        )}

                        {data.address && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                                <HomeIcon sx={{ fontSize: 12, opacity: 0.8, mt: 0.1 }} />
                                <Typography variant="caption" sx={{ fontSize: '9px', lineHeight: 1.2 }}>
                                    {data.address}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)'
                }}
            >
                <Typography variant="caption" sx={{ fontSize: '8px', opacity: 0.9 }}>
                    "Empowering Education, Building Future"
                </Typography>
            </Box>
        </IdCardContainer>
    );
};

// Classic Border Template
const ClassicTemplate = ({ data, entityType }) => {
    const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim();
    const isStudent = entityType === 'students';
    
    return (
        <IdCardContainer
            sx={{
                backgroundColor: '#fff',
                border: '4px solid #2c3e50',
                borderRadius: '8px',
                color: '#2c3e50'
            }}
        >
            {/* Decorative border */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    right: 4,
                    bottom: 4,
                    border: '1px solid #34495e',
                    borderRadius: '4px'
                }}
            />

            {/* Header */}
            <Box
                sx={{
                    p: 1.5,
                    textAlign: 'center',
                    borderBottom: '2px solid #34495e',
                    backgroundColor: '#ecf0f1'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                    <SchoolIcon sx={{ fontSize: 20, color: '#e74c3c' }} />
                    <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 700, color: '#2c3e50' }}>
                        SUNSHINE HIGH SCHOOL
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#7f8c8d', fontStyle: 'italic' }}>
                    Est. 1985 • Excellence in Education
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ display: 'flex', p: 1.5, gap: 1.5 }}>
                {/* Photo Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            border: '2px solid #34495e',
                            fontSize: '24px',
                            backgroundColor: '#bdc3c7',
                            color: '#2c3e50'
                        }}
                    >
                        {isStudent ? <PersonIcon sx={{ fontSize: 40 }} /> : <SchoolIcon sx={{ fontSize: 40 }} />}
                    </Avatar>
                    <Box
                        sx={{
                            mt: 0.5,
                            px: 1,
                            py: 0.2,
                            backgroundColor: '#34495e',
                            borderRadius: '10px'
                        }}
                    >
                        <Typography variant="caption" sx={{ fontSize: '8px', color: 'white', fontWeight: 600 }}>
                            {isStudent ? 'STUDENT' : 'FACULTY'}
                        </Typography>
                    </Box>
                </Box>

                {/* Details Section */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5, color: '#2c3e50' }}>
                        {fullName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                        {isStudent && data.rollNo && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: '#e74c3c' }}>
                                    Roll No:
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px', color: '#2c3e50' }}>
                                    {data.rollNo}
                                </Typography>
                            </Box>
                        )}
                        
                        {isStudent && (data.className || data.divisionName) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: '#e74c3c' }}>
                                    Class:
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px', color: '#2c3e50' }}>
                                    {data.className} - {data.divisionName}
                                </Typography>
                            </Box>
                        )}
                        
                        {!isStudent && data.role?.roleName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: '#e74c3c' }}>
                                    Role:
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px', color: '#2c3e50' }}>
                                    {data.role.roleName}
                                </Typography>
                            </Box>
                        )}

                        {data.dob && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: '#e74c3c' }}>
                                    DOB:
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px', color: '#2c3e50' }}>
                                    {new Date(data.dob).toLocaleDateString()}
                                </Typography>
                            </Box>
                        )}

                        {data.mobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600, color: '#e74c3c' }}>
                                    Mobile:
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px', color: '#2c3e50' }}>
                                    {data.mobile}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    right: 8,
                    textAlign: 'center',
                    borderTop: '1px solid #bdc3c7',
                    pt: 0.5
                }}
            >
                <Typography variant="caption" sx={{ fontSize: '8px', color: '#7f8c8d', fontWeight: 500 }}>
                    www.sunshineschool.edu • info@sunshineschool.edu
                </Typography>
            </Box>
        </IdCardContainer>
    );
};

// Minimal Flat Template
const MinimalTemplate = ({ data, entityType }) => {
    const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim();
    const isStudent = entityType === 'students';
    
    return (
        <IdCardContainer
            sx={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                color: '#333'
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 1.5,
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px 12px 0 0'
                }}
            >
                <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, color: '#495057', mb: 0.3 }}>
                    SUNSHINE HIGH SCHOOL
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#6c757d' }}>
                    Modern Education Hub
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                    {/* Photo Section */}
                    <Avatar
                        sx={{
                            width: 70,
                            height: 70,
                            backgroundColor: isStudent ? '#e3f2fd' : '#f3e5f5',
                            color: isStudent ? '#1976d2' : '#7b1fa2',
                            fontSize: '20px'
                        }}
                    >
                        {isStudent ? <PersonIcon sx={{ fontSize: 35 }} /> : <SchoolIcon sx={{ fontSize: 35 }} />}
                    </Avatar>

                    {/* Details Section */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontSize: '12px', fontWeight: 700, color: '#212529', mb: 0.5 }}>
                            {fullName}
                        </Typography>
                        
                        <Box 
                            sx={{ 
                                display: 'inline-block',
                                px: 1, 
                                py: 0.3, 
                                backgroundColor: isStudent ? '#e3f2fd' : '#f3e5f5',
                                color: isStudent ? '#1976d2' : '#7b1fa2',
                                borderRadius: '12px',
                                mb: 0.5
                            }}
                        >
                            <Typography variant="caption" sx={{ fontSize: '8px', fontWeight: 600 }}>
                                {isStudent ? 'STUDENT' : 'FACULTY'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                            {isStudent && data.rollNo && (
                                <Typography variant="caption" sx={{ fontSize: '9px', color: '#6c757d' }}>
                                    ID: {data.rollNo}
                                </Typography>
                            )}
                            
                            {isStudent && (data.className || data.divisionName) && (
                                <Typography variant="caption" sx={{ fontSize: '9px', color: '#6c757d' }}>
                                    {data.className} - {data.divisionName}
                                </Typography>
                            )}
                            
                            {!isStudent && data.role?.roleName && (
                                <Typography variant="caption" sx={{ fontSize: '9px', color: '#6c757d' }}>
                                    {data.role.roleName}
                                </Typography>
                            )}

                            {data.mobile && (
                                <Typography variant="caption" sx={{ fontSize: '9px', color: '#6c757d' }}>
                                    📞 {data.mobile}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Additional Info */}
                <Box sx={{ borderTop: '1px solid #e9ecef', pt: 0.5, mt: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontSize: '8px', color: '#6c757d' }}>
                            Valid: 2024-25
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '8px', color: '#6c757d' }}>
                            ID#{data.id}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </IdCardContainer>
    );
};

// Main component that renders the appropriate template
const IdCardTemplate = ({ data, template, entityType }) => {
    if (!data) {
        return (
            <IdCardContainer sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">No data available</Typography>
            </IdCardContainer>
        );
    }

    switch (template) {
        case 'classic':
            return <ClassicTemplate data={data} entityType={entityType} />;
        case 'minimal':
            return <MinimalTemplate data={data} entityType={entityType} />;
        case 'modern':
        default:
            return <ModernTemplate data={data} entityType={entityType} />;
    }
};

export default IdCardTemplate;