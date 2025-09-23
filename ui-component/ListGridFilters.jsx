import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography, Chip, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';

const ListGridFilters = ({ filters, onFiltersChange, showSchool = true, showClass = true, showDivision = true, showClearAll = true ,
  ActiveFiltersDisplay = true
}) => {
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const accountId = userDetails.getAccountId();

  // Use state to track selected filters locally
  const [selectedSchool, setSelectedSchool] = useState(filters.schoolId || '');
  const [selectedClass, setSelectedClass] = useState(filters.classId || '');
  const [selectedDivision, setSelectedDivision] = useState(filters.divisionId || '');

  // Effect to sync local state with props on initial load or change
  useEffect(() => {
    setSelectedSchool(filters?.schoolId || '');
    setSelectedClass(filters?.classId || '');
    setSelectedDivision(filters?.divisionId || '');
  }, [filters]);

  // Effect to fetch schools on initial load
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
        const response = await api.post(`/api/schoolBranches/getAll/${accountId}`, payload);
        setSchools(response.data.content || []);
      } catch (error) {
        console.error(`Failed to fetch schools:`, error);
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };
    if (showSchool) {
      fetchSchools();
    }
  }, [accountId, showSchool]);

  // Effect to fetch classes when a school is selected
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      if (selectedSchool) {
        try {
          const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc', schoolId: selectedSchool };
          const response = await api.post(`/api/schoolClasses/getAll/${accountId}`, payload);
          setClasses(response.data.content || []);
        } catch (error) {
          console.error(`Failed to fetch classes for school ${selectedSchool}:`, error);
          setClasses([]);
        }
      } else {
        setClasses([]);
      }
      setLoadingClasses(false);
    };
    if (showClass) {
      fetchClasses();
    }
  }, [accountId, showClass, selectedSchool]);

  // Effect to fetch divisions when a class is selected
  useEffect(() => {
    const fetchDivisions = async () => {
      setLoadingDivisions(true);
      if (selectedClass) {
        try {
          const payload = { 
            page: 0, 
            size: 1000, 
            sortBy: 'id', 
            sortDir: 'asc', 
            schoolId: selectedSchool, // Pass schoolId
            classId: selectedClass    // Pass classId
          };
          const response = await api.post(`/api/divisions/getAll/${accountId}`, payload);
          setDivisions(response.data.content || []);
        } catch (error) {
          console.error(`Failed to fetch divisions for class ${selectedClass}:`, error);
          setDivisions([]);
        }
      } else {
        setDivisions([]);
      }
      setLoadingDivisions(false);
    };
    if (showDivision) {
      fetchDivisions();
    }
  }, [accountId, showDivision, selectedSchool, selectedClass]);

  const handleSchoolChange = (e) => {
    const newSchool = e.target.value;
    setSelectedSchool(newSchool);
    setSelectedClass('');
    setSelectedDivision('');
    onFiltersChange({ schoolId: newSchool, classId: '', divisionId: '' });
  };

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSelectedDivision('');
    onFiltersChange({ schoolId: selectedSchool, classId: newClass, divisionId: '' });
  };

  const handleDivisionChange = (e) => {
    const newDivision = e.target.value;
    setSelectedDivision(newDivision);
    onFiltersChange({ schoolId: selectedSchool, classId: selectedClass, divisionId: newDivision });
  };

  const clearAllFilters = () => {
    setSelectedSchool('');
    setSelectedClass('');
    setSelectedDivision('');
    onFiltersChange({
      schoolId: '',
      classId: '',
      divisionId: ''
    });
  };

  const hasActiveFilters = selectedSchool || selectedClass || selectedDivision;

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {showClearAll && hasActiveFilters && (
          <Tooltip title="Clear all filters">
            <IconButton size="small" onClick={clearAllFilters} color="error">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box> */}

      <Grid container spacing={2}>
        {showSchool && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>School</InputLabel>
              <Select
                value={selectedSchool}
                label="School"
                onChange={handleSchoolChange}
                disabled={loadingSchools}
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

        {showClass && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" disabled={loadingClasses || !selectedSchool}>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClass}
                label="Class"
                onChange={handleClassChange}
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

        {showDivision && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" disabled={loadingDivisions || !selectedClass}>
              <InputLabel>Division</InputLabel>
              <Select
                value={selectedDivision}
                label="Division"
                onChange={handleDivisionChange}
              >
                <MenuItem value="">
                  <em>All Divisions</em>
                </MenuItem>
                {divisions.map((div) => (
                  <MenuItem key={div.id} value={div.id}>
                    {div.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      {hasActiveFilters && ActiveFiltersDisplay && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
            Active filters:
          </Typography>
          {selectedSchool && (
            <Chip
              label={`School: ${schools.find((s) => s.id === selectedSchool)?.name || 'Unknown'}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {selectedClass && (
            <Chip
              label={`Class: ${classes.find((c) => c.id === selectedClass)?.name || 'Unknown'}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
          {selectedDivision && (
            <Chip
              label={`Division: ${divisions.find((d) => d.id === selectedDivision)?.name || 'Unknown'}`}
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