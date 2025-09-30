// src/ui-component/ListGridFilters.jsx
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const ListGridFilters = ({
  filters = {},
  onFiltersChange,
  showSchool = true,
  showClass = true,
  showDivision = true,
  showClearAll = true,
  ActiveFiltersDisplay = true,
  // new props to receive SCD lists
  schools = [],
  classes = [],
  divisions = [],
  loading = false,
  disableSCDFilter = false
}) => {
  // Local controlled state synced with incoming filters prop to ensure UI reflects external changes
  const [selectedSchool, setSelectedSchool] = useState(filters.schoolId || '');
  const [selectedClass, setSelectedClass] = useState(filters.classId || '');
  const [selectedDivision, setSelectedDivision] = useState(filters.divisionId || '');

  // keep local state in sync when parent passes new filters (important after container enforcement)
  useEffect(() => {
    setSelectedSchool(filters.schoolId ?? '');
    setSelectedClass(filters.classId ?? '');
    setSelectedDivision(filters.divisionId ?? '');
  }, [filters.schoolId, filters.classId, filters.divisionId]);

  const emitChange = (newValues) => {
    // Merge with incoming filters to preserve other filter keys
    const payload = { ...(filters || {}), ...newValues };
    onFiltersChange(payload);
  };

  const handleSchoolChange = (e) => {
    const { value } = e.target;
    setSelectedSchool(value);
    // clear dependent selects
    setSelectedClass('');
    setSelectedDivision('');
    // emit only changed keys (container will enforce student/teacher rules)
    emitChange({ schoolId: value, classId: '', divisionId: '' });
  };

  const handleClassChange = (e) => {
    const { value } = e.target;
    setSelectedClass(value);
    setSelectedDivision('');
    // emit only changed keys
    emitChange({ classId: value, divisionId: '' });
  };

  const handleDivisionChange = (e) => {
    const { value } = e.target;
    setSelectedDivision(value);
    // emit only changed key
    emitChange({ divisionId: value });
  };

  const clearAll = () => {
    setSelectedSchool('');
    setSelectedClass('');
    setSelectedDivision('');
    onFiltersChange({ schoolId: '', classId: '', divisionId: '' });
  };

  // compute visible classes/divisions from SCD lists

  // Render UI (use existing markup — ensure Select components use local state and handlers)
  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <Grid container spacing={2}>
        {showSchool && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel>School</InputLabel>
              <Select value={selectedSchool} label="School" onChange={handleSchoolChange}>
                <MenuItem value="">
                  <em>All Schools</em>
                </MenuItem>
                {!disableSCDFilter &&
                  Array.isArray(schools) &&
                  schools.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {showClass && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" disabled={loading || !classes.length}>
              <InputLabel>Class</InputLabel>
              <Select value={selectedClass} label="Class" onChange={handleClassChange}>
                <MenuItem value="">
                  <em>All Classes</em>
                </MenuItem>
                {!disableSCDFilter &&
                  classes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {showDivision && (
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small" disabled={loading || !divisions.length}>
              <InputLabel>Division</InputLabel>
              <Select value={selectedDivision} label="Division" onChange={handleDivisionChange}>
                <MenuItem value="">
                  <em>All Divisions</em>
                </MenuItem>
                {!disableSCDFilter &&
                  divisions.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {showClearAll && (
          <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" onClick={clearAll}>
              Clear
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

ListGridFilters.propTypes = {
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func.isRequired,
  showSchool: PropTypes.bool,
  showClass: PropTypes.bool,
  showDivision: PropTypes.bool,
  showClearAll: PropTypes.bool,
  ActiveFiltersDisplay: PropTypes.bool,
  schools: PropTypes.array,
  classes: PropTypes.array,
  divisions: PropTypes.array,
  loading: PropTypes.bool,
  disableSCDFilter: PropTypes.bool
};

ListGridFilters.defaultProps = {
  showSchool: true,
  showClass: true,
  showDivision: true,
  showClearAll: true,
  schools: [],
  classes: [],
  divisions: [],
  loading: false
};

export default ListGridFilters;
