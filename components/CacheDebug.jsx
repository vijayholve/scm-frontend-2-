import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useSelectorData } from 'contexts/SelectorContext';

const CacheDebug = () => {
  const { getCacheStats, refreshAll } = useSelectorData();
  const stats = getCacheStats();

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cache Debug Info
      </Typography>
      <Typography variant="body2">Schools cached: {stats.schools}</Typography>
      <Typography variant="body2">Classes cached: {stats.classes}</Typography>
      <Typography variant="body2">Divisions cached: {stats.divisions}</Typography>
      <Typography variant="body2">Ongoing fetches: {stats.ongoingFetches}</Typography>
      <Button onClick={refreshAll} size="small" sx={{ mt: 1 }}>
        Clear All Cache
      </Button>
    </Box>
  );
};

export default CacheDebug;
