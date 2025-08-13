import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Grid,
    IconButton,
    Box,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'layout/MainLayout/Button/BackButton';

// --- THIS IS THE CRITICAL PART ---
// The values MUST be uppercase to match the backend Java Enum.
const examTypes = ["MIDTERM", "FINAL", "QUIZ", "PRACTICAL", "ORAL", "INTERNAL", "OTHER"];

const CreateExam = () => {
    const navigate = useNavigate();
    const { id: examId } = useParams();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [examData, setExamData] = useState({
        examName: '',
        academicYear: new Date().getFullYear().toString(),
        examType: '',
        startDate: '',
        endDate: '',
        maxMarksOverall: 0,
        examSubjects: [{
            subjectId: '',
            maxMarksSubject: '',
            passingMarksSubject: '',
            durationMinutes: '',
            examDateTime: ''
        }]
    });

    useEffect(() => {
        const accountId = userDetails.getAccountId();
        const fetchData = async () => {
            try {
                const payload = { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' };
                const subjectsRes = await api.post(`/api/subjects/getAll/${accountId}`, payload);
                setSubjects(subjectsRes.data.content || []);

                if (examId) {
                    const examRes = await api.get(`/api/exams/getById?id=${examId}`);
                    setExamData(examRes.data);
                }
            } catch (error) {
                toast.error("Failed to load necessary data.");
                console.error("Data loading error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [examId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSubjects = [...examData.examSubjects];
        updatedSubjects[index][name] = value;
        setExamData(prev => ({ ...prev, examSubjects: updatedSubjects }));
    };

    const addSubject = () => {
        setExamData(prev => ({
            ...prev,
            examSubjects: [...prev.examSubjects, { subjectId: '', maxMarksSubject: '', passingMarksSubject: '', durationMinutes: '', examDateTime: '' }]
        }));
    };

    const removeSubject = (index) => {
        if (examData.examSubjects.length > 1) {
            const updatedSubjects = [...examData.examSubjects];
            updatedSubjects.splice(index, 1);
            setExamData(prev => ({ ...prev, examSubjects: updatedSubjects }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const maxMarksOverall = examData.examSubjects.reduce((acc, subject) => acc + Number(subject.maxMarksSubject || 0), 0);
        
        const payload = {
            ...examData,
            maxMarksOverall,
            accountId: userDetails.getAccountId(),
        };
        
        // --- ADDED FOR DEBUGGING ---
        console.log("Submitting this payload to the backend:", payload);
        
        try {
            const apiCall = examId 
                ? api.put(`/api/exams/update/${examId}`, payload) 
                : api.post('/api/exams/create', payload);
                
            await apiCall;
            toast.success(`Exam ${examId ? 'updated' : 'created'} successfully!`);
            navigate('/masters/exams');
        } catch (error) {
            toast.error(`Failed to ${examId ? 'update' : 'create'} exam.`);
            console.error("Exam submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return <MainCard title="Loading..."><Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box></MainCard>;
    }

    return (
        <MainCard title={examId ? "Edit Exam" : "Create New Exam"}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="examName" label="Exam Name" value={examData.examName} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="academicYear" label="Academic Year" value={examData.academicYear} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required select name="examType" label="Exam Type" value={examData.examType} onChange={handleChange}>
                            {examTypes.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="startDate" label="Start Date" type="datetime-local" value={examData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="endDate" label="End Date" type="datetime-local" value={examData.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Exam Subjects</Typography>
                        {examData.examSubjects.map((subject, index) => (
                            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Subject</InputLabel>
                                        <Select name="subjectId" value={subject.subjectId} onChange={(e) => handleSubjectChange(index, e)}>
                                            {subjects.map((s) => (<MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={2}><TextField fullWidth name="maxMarksSubject" label="Max Marks" type="number" value={subject.maxMarksSubject} onChange={(e) => handleSubjectChange(index, e)} /></Grid>
                                <Grid item xs={12} sm={2}><TextField fullWidth name="passingMarksSubject" label="Passing Marks" type="number" value={subject.passingMarksSubject} onChange={(e) => handleSubjectChange(index, e)} /></Grid>
                                <Grid item xs={12} sm={2}><TextField fullWidth name="durationMinutes" label="Duration (Mins)" type="number" value={subject.durationMinutes} onChange={(e) => handleSubjectChange(index, e)} /></Grid>
                                <Grid item xs={12} sm={3}><TextField fullWidth name="examDateTime" label="Exam Date & Time" type="datetime-local" value={subject.examDateTime} onChange={(e) => handleSubjectChange(index, e)} InputLabelProps={{ shrink: true }} /></Grid>
                                <Grid item xs={12} sm={2}>
                                    <IconButton onClick={() => removeSubject(index)} disabled={examData.examSubjects.length <= 1}><RemoveCircleOutlineIcon /></IconButton>
                                    <IconButton onClick={addSubject}><AddCircleOutlineIcon /></IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <BackButton BackUrl="/masters/exams" />
                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (examId ? 'Update Exam' : 'Create Exam')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
};

export default CreateExam;