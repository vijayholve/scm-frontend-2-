import React, { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab, Card, CardContent, useTheme } from '@mui/material';
import { MenuBook as BookIcon, Speed as QuickIcon } from '@mui/icons-material';
import MasterFeatures from './MasterFeatures';
import QuickReferenceGuide from './QuickReferenceGuide';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documentation-tabpanel-${index}`}
      aria-labelledby={`documentation-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const MasterDocumentation = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` }}>
        <CardContent sx={{ py: 4, textAlign: 'center', color: 'white' }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Master Data Documentation
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            Complete guide to all master data features in your School Management System. Learn what each feature does, why it's important,
            and how to use it effectively.
          </Typography>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="documentation tabs" variant="fullWidth">
          <Tab icon={<QuickIcon />} label="Quick Reference" id="documentation-tab-0" aria-controls="documentation-tabpanel-0" />
          <Tab icon={<BookIcon />} label="Detailed Features" id="documentation-tab-1" aria-controls="documentation-tabpanel-1" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <QuickReferenceGuide />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MasterFeatures />
      </TabPanel>
    </Container>
  );
};

export default MasterDocumentation;
