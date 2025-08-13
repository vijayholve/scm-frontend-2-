import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';

const ListGridFilters = ({ filters, onFiltersChange, showSchool = true, showClass = true, showDivision = true, showClearAll = true }) => {
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const accountId = userDetails.getAccountId();

  // Initialize filters with current values
  const [localFilters, setLocalFilters] = useState({
    schoolId: filters?.schoolId || '',
    classId: filters?.classId || '',
    divisionId: filters?.divisionId || '',
    ...filters
  });

  // Debug logging for filters
  useEffect(() => {
    console.log('ListGridFilters - Props:', { showSchool, showClass, showDivision, filters });
    console.log('ListGridFilters - Local Filters:', localFilters);
    console.log('ListGridFilters - Initial filters prop:', filters);
  }, [showSchool, showClass, showDivision, filters, localFilters]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch schools
        if (showSchool) {
          const schoolPayload = {
            page: 0,
            size: 1000,
            sortBy: 'id',
            sortDir: 'asc'
          };
          console.log('Fetching schools with payload:', schoolPayload);
          try {
            const schoolResponse = await api.post(`/api/schoolBranches/getAll/${accountId}`, schoolPayload);
            console.log('Schools response:', schoolResponse.data);
            setSchools(schoolResponse.data.content || []);
          } catch (schoolError) {
            console.error('Failed to fetch schools:', schoolError);
            // Try alternative endpoint
            try {
              const altResponse = await api.get(`/api/schoolBranches/${accountId}`);
              console.log('Alternative schools response:', altResponse.data);
              setSchools(altResponse.data || []);
            } catch (altError) {
              console.error('Alternative schools endpoint also failed:', altError);
              setSchools([]);
            }
          }
        }

        // Fetch classes (filtered by school if selected)
        if (showClass) {
          const classPayload = {
            page: 0,
            size: 1000,
            sortBy: 'id',
            sortDir: 'asc'
          };

          // Only add schoolId filter if it's selected
          if (localFilters.schoolId) {
            classPayload.schoolId = localFilters.schoolId;
          }

          console.log('Fetching classes with payload:', classPayload);
          try {
            const classResponse = await api.post(`/api/schoolClasses/getAll/${accountId}`, classPayload);
            console.log('Classes response:', classResponse.data);
            setClasses(classResponse.data.content || []);
          } catch (classError) {
            console.error('Failed to fetch classes:', classError);
            // Try alternative endpoint
            try {
              const altResponse = await api.get(`/api/schoolClasses/${accountId}`);
              console.log('Alternative classes response:', altResponse.data);
              setClasses(altResponse.data || []);
            } catch (altError) {
              console.error('Alternative classes endpoint also failed:', altError);
              setClasses([]);
            }
          }
        }

        // Fetch divisions (filtered by class if selected)
        if (showDivision) {
          const divisionPayload = {
            page: 0,
            size: 1000,
            sortBy: 'id',
            sortDir: 'asc'
          };

          // Only add classId filter if it's selected
          if (localFilters.classId) {
            divisionPayload.classId = localFilters.classId;
          }

          console.log('Fetching divisions with payload:', divisionPayload);
          try {
            const divisionResponse = await api.post(`/api/divisions/getAll/${accountId}`, divisionPayload);
            console.log('Divisions response:', divisionResponse.data);
            setDivisions(divisionResponse.data.content || []);
          } catch (divisionError) {
            console.error('Failed to fetch divisions:', divisionError);
            // Try alternative endpoint
            try {
              const altResponse = await api.get(`/api/divisions/${accountId}`);
              console.log('Alternative divisions response:', altResponse.data);
              setDivisions(altResponse.data || []);
            } catch (altError) {
              console.error('Alternative divisions endpoint also failed:', altError);
              setDivisions([]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, showSchool, showClass, showDivision, localFilters.schoolId, localFilters.classId]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    console.log('Filter change:', field, value);
    const newFilters = { ...localFilters, [field]: value };

    // Reset dependent filters when parent filter changes
    if (field === 'schoolId') {
      newFilters.classId = '';
      newFilters.divisionId = '';
    } else if (field === 'classId') {
      newFilters.divisionId = '';
    }

    console.log('New filters after change:', newFilters);
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      schoolId: '',
      classId: '',
      divisionId: '',
      ...Object.keys(filters || {}).reduce((acc, key) => {
        if (!['schoolId', 'classId', 'divisionId'].includes(key)) {
          acc[key] = filters[key];
        }
        return acc;
      }, {})
    };
    console.log('Clearing all filters:', clearedFilters);
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = localFilters.schoolId || localFilters.classId || localFilters.divisionId;

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Filters
        </Typography>
        {showClearAll && hasActiveFilters && (
          <Tooltip title="Clear all filters">
            <IconButton size="small" onClick={clearAllFilters} color="error">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* School Filter */}
        {showSchool && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>School</InputLabel>
              <Select
                value={localFilters.schoolId || ''}
                onChange={(e) => handleFilterChange('schoolId', e.target.value)}
                label="School"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>All Schools</em>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Class Filter */}
        {showClass && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Class</InputLabel>
              <Select
                value={localFilters.classId || ''}
                onChange={(e) => handleFilterChange('classId', e.target.value)}
                label="Class"
                disabled={loading || !localFilters.schoolId}
              >
                <MenuItem value="">
                  <em>All Classes</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Division Filter */}
        {showDivision && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Division</InputLabel>
              <Select
                value={localFilters.divisionId || ''}
                onChange={(e) => handleFilterChange('divisionId', e.target.value)}
                label="Division"
                disabled={loading || !localFilters.classId}
              >
                <MenuItem value="">
                  <em>All Divisions</em>
                </MenuItem>
                {divisions.map((division) => (
                  <MenuItem key={division.id} value={division.id}>
                    {division.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
            Active filters:
          </Typography>
          {localFilters.schoolId && (
            <Chip
              label={`School: ${schools.find((s) => s.id === localFilters.schoolId)?.name || 'Unknown'}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {localFilters.classId && (
            <Chip
              label={`Class: ${classes.find((c) => c.id === localFilters.classId)?.name || 'Unknown'}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
          {localFilters.divisionId && (
            <Chip
              label={`Division: ${divisions.find((d) => d.id === localFilters.divisionId)?.name || 'Unknown'}`}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

ListGridFilters.propTypes = {
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func.isRequired,
  showSchool: PropTypes.bool,
  showClass: PropTypes.bool,
  showDivision: PropTypes.bool,
  showClearAll: PropTypes.bool
};

ListGridFilters.defaultProps = {
  showSchool: true,
  showClass: true,
  showDivision: true,
  showClearAll: true
};

export default ListGridFilters;
