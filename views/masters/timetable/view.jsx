import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip // Using Chip for better visual separation
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api, { userDetails } from '../../../utils/apiService';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { useParams } from 'react-router-dom';

// Helper to format hour and minute into a readable time string
const formatTime = (hour, minute) => {
    if (typeof hour === 'number' && typeof minute === 'number') {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        return `${h}:${m}`;
    }
    return '';
};

const TimetableGrid = () => {
    
    const [allTimetables, setAllTimetables] = useState([]); // State to hold all class timetables
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [timetable, setTimetable] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("No timetable ID provided in URL.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        api
            .get(`api/timetable/getById?id=${id}`)
            .then((response) => {
                setTimetable(response.data);
                setAllTimetables([response.data]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching timetable:", err);
                setError("Failed to load timetable. Please try again later.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading timetables...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                <Typography variant="h6">Error: {error}</Typography>
            </Box>
        );
    }

    if (!allTimetables || allTimetables.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No timetable data available for your account.</Typography>
            </Box>
        );
    }

    return (
        <MainCard title="StudentParents" secondary={<SecondaryAction icon={<AddIcon onClick={(e) => navigate(`/masters/timetable/add`)} />} />}>

            <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 4, p: 2 }}>
                <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                    All Class Timetables
                </Typography>

                {allTimetables.map((classObject) => {
                    if (!classObject.dayTimeTable || classObject.dayTimeTable.length === 0) {
                        return (
                            <Accordion key={classObject.id} elevation={2} sx={{ mb: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h5" component="span">
                                        Timetable for {classObject.className || 'Unknown Class'} (ID: {classObject.id})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                        No timetable entries found for this class.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        );
                    }

                    // Collect all unique time slots for THIS SPECIFIC CLASS
                    const classTimeSlots = Array.from(
                        new Set(
                            classObject.dayTimeTable.flatMap((day) =>
                                (day.tsd || []).map((slot) => formatTime(slot.hour, slot.minute))
                            )
                        )
                    ).sort((a, b) => { // Sort time slots chronologically
                        const [aHour, aMinute] = a.split(':').map(Number);
                        const [bHour, bMinute] = b.split(':').map(Number);
                        if (aHour !== bHour) {
                            return aHour - bHour;
                        }
                        return aMinute - bMinute;
                    });
                   const classDays = classObject.dayTimeTable.map((day) => day.dayName).sort();
                    const daySlotMap = {};
                    classObject.dayTimeTable.forEach((day) => {
                        daySlotMap[day.dayName] = {};
                        (day.tsd || []).forEach((slot) => {
                            const timeKey = formatTime(slot.hour, slot.minute);
                            daySlotMap[day.dayName][timeKey] = slot;
                        });
                    });

                    return (
                        <Accordion key={classObject.id} defaultExpanded elevation={2} sx={{ mb: 3 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h5" component="span">
                                    Timetable for {classObject.className || 'Unknown Class'}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}> {/* Remove default padding to let TableContainer handle it */}
                                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}> {/* Remove shadow to avoid double shadow */}
                                    <Table size="small" aria-label={`Timetable for ${classObject.className}`}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Day / Time</TableCell>
                                                {classTimeSlots.map((time) => (
                                                    <TableCell key={time} align="center" sx={{ fontWeight: 'bold' }}>
                                                        {time}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {classDays.map((dayName) => (
                                                <TableRow key={dayName} hover>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                                                        {dayName}
                                                    </TableCell>
                                                    {classTimeSlots.map((timeKey) => {
                                                        const slot = daySlotMap[dayName] ? daySlotMap[dayName][timeKey] : null;
                                                        return (
                                                            <TableCell key={timeKey} align="center">
                                                                {slot ? (
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                                                                        {slot.subjectName && (
                                                                            <Chip
                                                                                label={slot.subjectName}
                                                                                size="small"
                                                                                color="primary"
                                                                                variant="outlined"
                                                                                sx={{ fontWeight: 'bold' }}
                                                                            />
                                                                        )}
                                                                        {slot.teacherName && (
                                                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                                ({slot.teacherName})
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                ) : (
                                                                    <Typography variant="caption" color="text.disabled">
                                                                        -
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </MainCard>
    );
};

export default TimetableGrid;
