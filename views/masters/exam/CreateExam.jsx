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
    MenuItem,
    FormHelperText
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MainCard from 'ui-component/cards/MainCard';
import api from 'utils/apiService';
import { userDetails } from 'utils/apiService';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from 'layout/MainLayout/Button/BackButton';
import { Autocomplete } from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const examTypes = ["MIDTERM", "FINAL", "QUIZ", "PRACTICAL", "ORAL", "INTERNAL", "OTHER"];

const CreateExam = () => {
    const navigate = useNavigate();
    const { id: examId } = useParams();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [quizzes, setQuizzes] = useState([]); // New state for quizzes
    // State for dropdown options
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [accounts, setAccounts] = useState([]);

    // Main exam data state, now includes schoolId, classId, divisionId, accountId
    const [examData, setExamData] = useState({
        schoolId: '',
        schoolName: '',
        classId: '',
        className: '',
        divisionId: '',
        divisionName: '',
        accountId: '',
        examName: '',
        academicYear: new Date().getFullYear().toString(),
        examType: '',
        startDate: '',
        endDate: '',
        maxMarksOverall: 0,
        examSubjects: [{
            subjectId: '',
            quizId: '', // Add quizId to the state
            maxMarksSubject: '',
            passingMarksSubject: '',
            durationMinutes: '',
            examDateTime: ''
        }]
    });

    // Destructure for use in dependencies
    const { schoolId, classId, divisionId } = examData;

    // Fetch dropdown data for school, class, division, account
    useEffect(() => {
        const accountId = userDetails.getAccountId();
        const fetchDropdowns = async () => {
            try {
                // Schools
                const schoolRes = await api.get(`/api/schoolBranches/getAllBy/${accountId}`);
                setSchools(schoolRes.data || []);
                // Classes
                const classRes = await api.get(`/api/schoolClasses/getAllBy/${accountId}`);
                setClasses(classRes.data || []);
                // Divisions
                const divisionRes = await api.get(`/api/divisions/getAllBy/${accountId}`);
                setDivisions(divisionRes.data || []);
                // Accounts (users)
                const accountRes = await api.get(`/api/users/getAllBy/${accountId}`);
                setAccounts(accountRes.data || []);
                // Subjects
                const subjectRes = await api.get(`/api/subjects/getAllBy/${accountId}`);
                setSubjects(subjectRes.data || []);
            } catch (err) {
                toast.error("Failed to load dropdown data.");
            }
        };
        fetchDropdowns();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const quizzesRes = await api.post(`/api/quizzes/getAllBy/${userDetails.getAccountId()}`, {
                page: 0,
                size: 1000,
                sortBy: 'id',
                sortDir: 'asc',
                schoolId: schoolId,
                classId: classId,
                divisionId: divisionId
            });
            setQuizzes(quizzesRes.data.content || []);
        } catch (err) {
            toast.error("Failed to load quizzes.");
        }
    };

    // When editing, update state with fetched exam data (including new fields)
    useEffect(() => {
        if (examId) {
            const fetchExam = async () => {
                try {
                    const examRes = await api.get(`/api/exams/${userDetails.getAccountId()}/${examId}`);
                    // Ensure new fields are present in edit mode
                    setExamData(prev => ({
                        ...prev,
                        ...examRes.data,
                        schoolId: examRes.data.schoolId || '',
                        schoolName: examRes.data.schoolName || '',
                        classId: examRes.data.classId || '',
                        className: examRes.data.className || '',
                        divisionId: examRes.data.divisionId || '',
                        divisionName: examRes.data.divisionName || '',
                        accountId: examRes.data.accountId || userDetails.getAccountId() || ''
                    }));
                    fetchQuizzes();
                } catch (error) {
                    toast.error("Failed to load exam data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchExam();
        }
    }, [examId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return <MainCard title="Loading..."><Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box></MainCard>;
    }

    return (
        <MainCard title={examId ? "Edit Exam" : "Create New Exam"}>
            
            <Formik
                enableReinitialize
                initialValues={{
                    schoolId: examData.schoolId || '',
                    schoolName: examData.schoolName || '',
                    classId: examData.classId || '',
                    className: examData.className || '',
                    divisionId: examData.divisionId || '',
                    divisionName: examData.divisionName || '',
                    examName: examData.examName || '',
                    academicYear: examData.academicYear || '',
                    examType: examData.examType || '',
                    startDate: examData.startDate || '',
                    endDate: examData.endDate || '',
                    examSubjects: examData.examSubjects.length
                        ? examData.examSubjects
                        : [{ subjectId: '', quizId: '', maxMarksSubject: '', passingMarksSubject: '', durationMinutes: '', examDateTime: '' }]
                }}
                validationSchema={Yup.object().shape({
                    schoolId: Yup.string().required('School is required'),
                    classId: Yup.string().required('Class is required'),
                    divisionId: Yup.string().required('Division is required'),
                    examName: Yup.string().required('Exam Name is required'),
                    academicYear: Yup.string().required('Academic Year is required'),
                    examType: Yup.string().required('Exam Type is required'),
                    startDate: Yup.string().required('Start Date is required'),
                    endDate: Yup.string().required('End Date is required'),
                    examSubjects: Yup.array().of(
                        Yup.object().shape({
                            subjectId: Yup.string().required('Subject is required'),
                            quizId: Yup.string().required('Quiz is required'),
                            maxMarksSubject: Yup.number().typeError('Max Marks must be a number').required('Max Marks is required').min(1, 'Must be at least 1'),
                            passingMarksSubject: Yup.number().typeError('Passing Marks must be a number').required('Passing Marks is required').min(0, 'Must be at least 0'),
                            durationMinutes: Yup.number().typeError('Duration must be a number').required('Duration is required').min(1, 'Must be at least 1'),
                            examDateTime: Yup.string().required('Exam Date & Time is required')
                        })
                    ).min(1, 'At least one subject is required')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    setIsSubmitting(true);

                    const maxMarksOverall = values.examSubjects.reduce((acc, subject) => acc + Number(subject.maxMarksSubject || 0), 0);

                    const payload = {
                        ...values,
                        maxMarksOverall,
                        accountId: userDetails.getAccountId(),
                    };

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
                        setSubmitting(false);
                    }
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                    <Form>
                        <Grid container spacing={3}>
                            {/* School Autocomplete (Selection) */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="timetable-school-autocomplete"
                                    options={schools}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={schools.find((sch) => sch.id === values.schoolId) || null}
                                    onChange={(event, newValue) => {
                                        setFieldValue('schoolId', newValue ? newValue.id : '');
                                        setFieldValue('schoolName', newValue ? newValue.name : '');
                                        fetchQuizzes();
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="School"
                                            error={Boolean(touched.schoolId && errors.schoolId)}
                                            helperText={touched.schoolId && errors.schoolId}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Class Autocomplete (Selection) */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="timetable-class-autocomplete"
                                    options={classes}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={classes.find((cls) => cls.id === values.classId) || null}
                                    onChange={(event, newValue) => {
                                        setFieldValue('classId', newValue ? newValue.id : '');
                                        setFieldValue('className', newValue ? newValue.name : '');
                                        fetchQuizzes();
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Class"
                                            error={Boolean(touched.classId && errors.classId)}
                                            helperText={touched.classId && errors.classId}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Division Autocomplete (Selection) */}
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="timetable-division-autocomplete"
                                    options={divisions}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={divisions.find((div) => div.id === values.divisionId) || null}
                                    onChange={(event, newValue) => {
                                        setFieldValue('divisionId', newValue ? newValue.id : '');
                                        setFieldValue('divisionName', newValue ? newValue.name : '');
                                        fetchQuizzes();
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Division"
                                            error={Boolean(touched.divisionId && errors.divisionId)}
                                            helperText={touched.divisionId && errors.divisionId}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="examName"
                                    label="Exam Name"
                                    value={values.examName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.examName && errors.examName)}
                                    helperText={touched.examName && errors.examName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="academicYear"
                                    label="Academic Year"
                                    value={values.academicYear}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.academicYear && errors.academicYear)}
                                    helperText={touched.academicYear && errors.academicYear}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    select
                                    name="examType"
                                    label="Exam Type"
                                    value={values.examType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.examType && errors.examType)}
                                    helperText={touched.examType && errors.examType}
                                >
                                    {examTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="startDate"
                                    label="Start Date"
                                    type="datetime-local"
                                    value={values.startDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={Boolean(touched.startDate && errors.startDate)}
                                    helperText={touched.startDate && errors.startDate}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="endDate"
                                    label="End Date"
                                    type="datetime-local"
                                    value={values.endDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={Boolean(touched.endDate && errors.endDate)}
                                    helperText={touched.endDate && errors.endDate}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>Exam Subjects</Typography>
                                <FieldArray name="examSubjects">
                                    {({ push, remove }) => (
                                        <>
                                            {values.examSubjects.map((subject, index) => (
                                                <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                                                    <Grid item xs={12} sm={3}>
                                                        <FormControl fullWidth error={Boolean(
                                                            touched.examSubjects?.[index]?.subjectId && errors.examSubjects?.[index]?.subjectId
                                                        )}>
                                                            <InputLabel>Subject</InputLabel>
                                                            <Select
                                                                name={`examSubjects.${index}.subjectId`}
                                                                value={subject.subjectId}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            >
                                                                {subjects.map((s) => (
                                                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.examSubjects?.[index]?.subjectId && errors.examSubjects?.[index]?.subjectId && (
                                                                <FormHelperText error>
                                                                    {errors.examSubjects[index].subjectId}
                                                                </FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <FormControl fullWidth error={Boolean(
                                                            touched.examSubjects?.[index]?.quizId && errors.examSubjects?.[index]?.quizId
                                                        )}>
                                                            <InputLabel>Quiz</InputLabel>
                                                            <Select
                                                                name={`examSubjects.${index}.quizId`}
                                                                value={subject.quizId}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            >
                                                                {quizzes.map((q) => (
                                                                    <MenuItem key={q.id} value={q.id}>{q.title}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            {touched.examSubjects?.[index]?.quizId && errors.examSubjects?.[index]?.quizId && (
                                                                <FormHelperText error>
                                                                    {errors.examSubjects[index].quizId}
                                                                </FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <TextField
                                                            fullWidth
                                                            name={`examSubjects.${index}.maxMarksSubject`}
                                                            label="Max Marks"
                                                            type="number"
                                                            value={subject.maxMarksSubject}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.examSubjects?.[index]?.maxMarksSubject && errors.examSubjects?.[index]?.maxMarksSubject)}
                                                            helperText={touched.examSubjects?.[index]?.maxMarksSubject && errors.examSubjects?.[index]?.maxMarksSubject}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <TextField
                                                            fullWidth
                                                            name={`examSubjects.${index}.passingMarksSubject`}
                                                            label="Passing Marks"
                                                            type="number"
                                                            value={subject.passingMarksSubject}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.examSubjects?.[index]?.passingMarksSubject && errors.examSubjects?.[index]?.passingMarksSubject)}
                                                            helperText={touched.examSubjects?.[index]?.passingMarksSubject && errors.examSubjects?.[index]?.passingMarksSubject}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <TextField
                                                            fullWidth
                                                            name={`examSubjects.${index}.durationMinutes`}
                                                            label="Duration (Mins)"
                                                            type="number"
                                                            value={subject.durationMinutes}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={Boolean(touched.examSubjects?.[index]?.durationMinutes && errors.examSubjects?.[index]?.durationMinutes)}
                                                            helperText={touched.examSubjects?.[index]?.durationMinutes && errors.examSubjects?.[index]?.durationMinutes}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={3}>
                                                        <TextField
                                                            fullWidth
                                                            name={`examSubjects.${index}.examDateTime`}
                                                            label="Exam Date & Time"
                                                            type="datetime-local"
                                                            value={subject.examDateTime}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            InputLabelProps={{ shrink: true }}
                                                            error={Boolean(touched.examSubjects?.[index]?.examDateTime && errors.examSubjects?.[index]?.examDateTime)}
                                                            helperText={touched.examSubjects?.[index]?.examDateTime && errors.examSubjects?.[index]?.examDateTime}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <IconButton
                                                            onClick={() => remove(index)}
                                                            disabled={values.examSubjects.length <= 1}
                                                        >
                                                            <RemoveCircleOutlineIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => push({ subjectId: '', quizId: '', maxMarksSubject: '', passingMarksSubject: '', durationMinutes: '', examDateTime: '' })}
                                                        >
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                            {typeof errors.examSubjects === 'string' && (
                                                <FormHelperText error>{errors.examSubjects}</FormHelperText>
                                            )}
                                        </>
                                    )}
                                </FieldArray>
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
                    </Form>
                )}
            </Formik>
        </MainCard>
    );
};

export default CreateExam;