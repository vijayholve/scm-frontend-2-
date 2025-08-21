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

  // Use state to track selected filters locally
  const [selectedSchool, setSelectedSchool] = useState(filters.schoolId || '');
  const [selectedClass, setSelectedClass] = useState(filters.classId || '');
  const [selectedDivision, setSelectedDivision] = useState(filters.divisionId || '');

  // Sync internal state with props if they change
  useEffect(() => {
    setSelectedSchool(filters.schoolId || '');
    setSelectedClass(filters.classId || '');
    setSelectedDivision(filters.divisionId || '');
  }, [filters]);

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
          try {
            const schoolResponse = await api.post(`/api/schoolBranches/getAll/${accountId}`, schoolPayload);
            setSchools(schoolResponse.data.content || []);
          } catch (schoolError) {
            try {
              const altResponse = await api.get(`/api/schoolBranches/${accountId}`);
              setSchools(altResponse.data || []);
            } catch (altError) {
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
          if (selectedSchool) {
            classPayload.schoolId = selectedSchool;
          }
          try {
            const classResponse = await api.post(`/api/schoolClasses/getAll/${accountId}`, classPayload);
            setClasses(classResponse.data.content || []);
          } catch (classError) {
            try {
              const altResponse = await api.get(`/api/schoolClasses/${accountId}`);
              setClasses(altResponse.data || []);
            } catch (altError) {
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
          if (selectedClass) {
            divisionPayload.classId = selectedClass;
          }
          try {
            const divisionResponse = await api.post(`/api/divisions/getAll/${accountId}`, divisionPayload);
            setDivisions(divisionResponse.data.content || []);
          } catch (divisionError) {
            try {
              const altResponse = await api.get(`/api/divisions/${accountId}`);
              setDivisions(altResponse.data || []);
            } catch (altError) {
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
  }, [accountId, showSchool, showClass, showDivision, selectedSchool, selectedClass]);

  // Pass filter changes up to the parent component (ReusableDataGrid)
  useEffect(() => {
    onFiltersChange({
      schoolId: selectedSchool,
      classId: selectedClass,
      divisionId: selectedDivision
    });
  }, [selectedSchool, selectedClass, selectedDivision, onFiltersChange]);

  const handleSchoolChange = (e) => {
    const newSchool = e.target.value;
    setSelectedSchool(newSchool);
    setSelectedClass('');
    setSelectedDivision('');
  };

  const handleClassChange = (e) => {
    const newClass = e.target.value;
    setSelectedClass(newClass);
    setSelectedDivision('');
  };

  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
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
        {showSchool && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>School</InputLabel>
              <Select
                value={selectedSchool}
                label="School"
                onChange={handleSchoolChange}
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

        {showClass && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" disabled={loading || !selectedSchool}>
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
            <FormControl fullWidth size="small" disabled={loading || !selectedClass}>
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
      {hasActiveFilters && (
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