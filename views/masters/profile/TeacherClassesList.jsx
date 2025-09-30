import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Typography,
  CircularProgress,
  Divider
} from '@mui/material';
import api, { userDetails } from 'utils/apiService';

/**
 * TeacherClassesList
 * - Fetches allocated classes for a given teacher (teacherId).
 * - API expected: GET /api/allocates/classes/{accountId}/{teacherId}
 *
 * Usage:
 * <TeacherClassesList teacherId={someUserId} /> or <TeacherClassesList accountId={123} teacherId={...} />
 */
const TeacherClassesList = ({ accountId: accountIdProp, teacherId, teacher }) => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountId = accountIdProp || userDetails.getAccountId();
  const user = userDetails.getUser();

  useEffect(() => {
    // If teacher prop contains allocatedClasses, use it and skip API
    if (teacher && Array.isArray(teacher.allocatedClasses) && teacher.allocatedClasses.length > 0) {
      setAllocations(teacher.allocatedClasses);
      setLoading(false);
      setError(null);
      return;
    }

    // If no allocations on teacher prop, fall back to API (requires teacherId)
    if (!accountId) {
      setError('Missing accountId');
      setLoading(false);
      return;
    }

    if (!teacherId) {
      setError('Missing teacherId and no allocated classes in teacher prop.');
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchAllocations = async () => {
      try {
        setAllocations(user?.allocatedClasses || []);
      } catch (err) {
        console.error('Failed to fetch teacher allocations:', err);
        if (mounted) setError('Failed to load allocated classes.');
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchAllocations();

    return () => {
      mounted = false;
    };
  }, [accountId, teacherId, teacher]);

  // Normalize into map: classId -> { className, divisions: [ { id, name } ] }
  const classesMap = allocations.reduce((acc, item) => {
    // item may already be allocation or just a { classId, className, divisionId, divisionName } shape
    const classId = item.classId ?? item.schoolClassId ?? item?.schoolClass?.id ?? item?.class?.id;
    const className =
      item.className ?? item.schoolClassName ?? item?.schoolClass?.name ?? item?.class?.name ?? item?.name ?? `Class ${classId}`;
    const divisionId = item.divisionId ?? item?.division?.id ?? item?.divisionId;
    const divisionName = item.divisionName ?? item?.division?.name ?? item?.divisionName;

    const key = String(classId ?? 'unknown');
    if (!acc[key]) acc[key] = { id: classId, name: className, divisions: [] };

    if (divisionId) {
      const exists = acc[key].divisions.some((d) => String(d.id) === String(divisionId));
      if (!exists) acc[key].divisions.push({ id: divisionId, name: divisionName || `Div ${divisionId}` });
    }
    return acc;
  }, {});

  const classesList = Object.values(classesMap);

  return (
    <Card>
      <CardHeader title="Allocated Classes" subheader="Classes & divisions assigned to this teacher" />
      <Divider />
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center" py={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : classesList.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No allocated classes found for this teacher.</Typography>
          </Box>
        ) : (
          <List>
            {classesList
              .slice()
              .sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)))
              .map((cls) => (
                <Box key={String(cls.id)} mb={1}>
                  <ListItem disableGutters>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {cls.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {`ID: ${cls.id ?? '-'}`}
                        </Typography>
                      }
                    />
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip label={`${cls.divisions.length} division${cls.divisions.length !== 1 ? 's' : ''}`} size="small" />
                    </Box>
                  </ListItem>

                  {cls.divisions.length > 0 && (
                    <Box pl={3} pr={1} pb={1}>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {cls.divisions
                          .slice()
                          .sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)))
                          .map((div) => (
                            <Chip key={String(div.id)} label={div.name || `Div ${div.id}`} size="small" variant="outlined" />
                          ))}
                      </Box>
                    </Box>
                  )}
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

TeacherClassesList.propTypes = {
  accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  teacher: PropTypes.object
};

export default TeacherClassesList;
