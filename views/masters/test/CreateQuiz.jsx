import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
import Grid from '@mui/material/Grid';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Box,
    Typography,
    Chip,
    Divider,
    RadioGroup,
    Radio,
    FormLabel,
    Autocomplete
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { toast } from 'react-hot-toast';
import api, { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        startTime: dayjs(),
        endTime: dayjs().add(2, 'hour'),
        showScoreAfterSubmission: true,
        questions: [],
        schoolId: null,
        schoolName: '',
        classId: null,
        className: '',
        divisionId: null,
        divisionName: ''
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        type: 'SINGLE_SELECT',
        text: '',
        options: ['', '', '', ''],
        correctAnswers: [],
        isActive: true
    });

    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [editQuestionIndex, setEditQuestionIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const user = useSelector(state => state.user);

    const questionTypes = [
        { value: 'SINGLE_SELECT', label: 'Single Select' },
        { value: 'MULTI_SELECT', label: 'Multi Select' },
        { value: 'PARAGRAPH', label: 'Paragraph' }
    ];

    useEffect(() => {
        // Fetch schools on mount
        api.post(`api/schoolBranches/getAll/${user?.user?.accountId}`, {
            page: 0,
            size: 100,
            sortBy: "id",
            sortDir: "asc"
        }).then(res => setSchools(res?.data?.content || []));

        api.post(`/api/schoolClasses/getAll/${user?.user?.accountId}`, {
            page: 0,
            size: 100,
            sortBy: "id",
            sortDir: "asc"
        }).then(res => setClasses(res?.data?.content || []));

        api.post(`/api/divisions/getAll/${user?.user?.accountId}`, {
            page: 0,
            size: 100,
            sortBy: "id",
            sortDir: "asc"
        }).then(res => setDivisions(res?.data?.content || []));
    }, []);

    useEffect(() => {
        if (isEdit) {
            fetchQuiz();
        }
    }, [id, isEdit]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            const accountId = userDetails.getAccountId();

            const response = await api.get(`api/quizzes/${accountId}/${id}`);
            const quizData = response.data;

            // Convert date strings to dayjs objects
            if (quizData.startTime) {
                quizData.startTime = dayjs(quizData.startTime);
            }
            if (quizData.endTime) {
                quizData.endTime = dayjs(quizData.endTime);
            }

            // Ensure questions array exists
            if (!quizData.questions) {
                quizData.questions = [];
            }

            setQuiz(quizData);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch quiz details');
            navigate('/masters/quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleQuizChange = (field, value) => {
        setQuiz(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleQuestionChange = (field, value) => {
        setCurrentQuestion(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleCorrectAnswerChange = (value) => {
        if (currentQuestion.type === 'SINGLE_SELECT') {
            setCurrentQuestion(prev => ({
                ...prev,
                correctAnswers: [value]
            }));
        } else if (currentQuestion.type === 'MULTI_SELECT') {
            const newCorrectAnswers = currentQuestion.correctAnswers.includes(value)
                ? currentQuestion.correctAnswers.filter(answer => answer !== value)
                : [...currentQuestion.correctAnswers, value];
            setCurrentQuestion(prev => ({
                ...prev,
                correctAnswers: newCorrectAnswers
            }));
        }
    };

    const resetCurrentQuestion = () => {
        setCurrentQuestion({
            type: 'SINGLE_SELECT',
            text: '',
            options: ['', '', '', ''],
            correctAnswers: [],
            isActive: true
        });
        setEditQuestionIndex(null);
    };

    const addOrUpdateQuestion = () => {
        if (!currentQuestion.text.trim()) {
            toast.error('Please enter a question');
            return;
        }

        if (currentQuestion.type !== 'PARAGRAPH') {
            const validOptions = currentQuestion.options.filter(opt => opt.trim());
            if (validOptions.length < 2) {
                toast.error('Please provide at least 2 options');
                return;
            }
            if (currentQuestion.correctAnswers.length === 0) {
                toast.error('Please select at least one correct answer');
                return;
            }
        }

        const newQuestion = {
            ...currentQuestion,
            id: currentQuestion.id || null,
            options: currentQuestion.type === 'PARAGRAPH' ? [] : currentQuestion.options.filter(opt => opt.trim())
        };

        if (editQuestionIndex !== null) {
            // Update existing question
            setQuiz(prev => ({
                ...prev,
                questions: prev.questions.map((q, idx) =>
                    idx === editQuestionIndex ? newQuestion : q
                )
            }));
            toast.success('Question updated successfully');
        } else {
            // Add new question
            setQuiz(prev => ({
                ...prev,
                questions: [...prev.questions, newQuestion]
            }));
            toast.success('Question added successfully');
        }

        resetCurrentQuestion();
        setShowAddQuestion(false);
    };

    const removeQuestion = (index) => {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
        toast.success('Question removed');
    };

    const editQuestion = (index) => {
        const question = quiz.questions[index];
        setCurrentQuestion({
            ...question,
            options:
                question.type === 'PARAGRAPH'
                    ? ['', '', '', '']
                    : [
                        ...question.options,
                        ...Array(4 - question.options.length).fill('')
                    ].slice(0, 4)
        });
        setEditQuestionIndex(index);
        setShowAddQuestion(true);
    };

    const handleSubmit = async () => {
        if (!quiz.title.trim()) {
            toast.error('Please enter quiz title');
            return;
        }

        if (quiz.questions.length === 0) {
            toast.error('Please add at least one question');
            return;
        }

        try {
            setLoading(true);
            const accountId = userDetails.getAccountId();
            const quizData = {
                ...quiz,
                startTime: quiz.startTime.toISOString(),
                endTime: quiz.endTime.toISOString(),
                accountId: accountId,
                questionCount: quiz.questions.length
            };

            if (isEdit) {
                await api.put(`api/quizzes/update`, quizData);
                toast.success('Quiz updated successfully');
                navigate('/masters/quiz');
            } else {
                await api.post(`api/quizzes/save`, quizData);
                toast.success('Quiz created successfully');
                navigate('/masters/quiz');
            }

            navigate('/masters/quiz');
        } catch (err) {
            console.error(err);
            toast.error(isEdit ? 'Failed to update quiz' : 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return <MainCard title="Loading..."><Typography>Loading quiz details...</Typography></MainCard>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MainCard title={isEdit ? 'Edit Quiz' : 'Create New Quiz'}>
                <Box
                    sx={{
                        height: '100vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: '8px',
                        '@media (max-width: 768px)': {
                            height: 'calc(100vh - 120px)',
                            paddingRight: '4px'
                        }
                    }}
                >
                    <Grid container spacing={gridSpacing} sx={{ mt: 2 }}>
                        {/* Quiz Details */}
                        {/* School Selection */}

                        <Grid item xs={4}>
                            <Autocomplete
                                disablePortal
                                options={schools}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => setQuiz({ ...quiz, schoolId: value?.id, schoolName: value?.name })}
                                renderInput={(params) => <TextField {...params} label="School" />}
                                value={schools.find((st) => st.id === quiz.schoolId) || null}
                            />
                        </Grid>
                        {/* Class Selection */}
                        <Grid item xs={4}>
                            <Autocomplete
                                disablePortal
                                options={classes}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => setQuiz({ ...quiz, classId: value?.id, className: value?.name })}
                                renderInput={(params) => <TextField {...params} label="Class" />}
                                value={classes.find((st) => st.id === quiz.classId) || null}
                            />
                        </Grid>
                        {/* Division Selection */}
                        <Grid item xs={4}>
                            <Autocomplete
                                disablePortal
                                options={divisions}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => setQuiz({ ...quiz, divisionId: value?.id, divisionName: value?.name })}
                                renderInput={(params) => <TextField {...params} label="Division" />}
                                value={divisions.find((st) => st.id === quiz.divisionId) || null}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Quiz Details" />
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Quiz Title"
                                                value={quiz.title}
                                                onChange={(e) => handleQuizChange('title', e.target.value)}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Description"
                                                value={quiz.description}
                                                onChange={(e) => handleQuizChange('description', e.target.value)}
                                                multiline
                                                rows={2}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DateTimePicker
                                                label="Start Time"
                                                value={quiz.startTime}
                                                onChange={(value) => handleQuizChange('startTime', value)}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DateTimePicker
                                                label="End Time"
                                                value={quiz.endTime}
                                                onChange={(value) => handleQuizChange('endTime', value)}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={quiz.showScoreAfterSubmission}
                                                        onChange={(e) => handleQuizChange('showScoreAfterSubmission', e.target.checked)}
                                                    />
                                                }
                                                label="Show Score After Submission"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Questions List */}
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader
                                    title={`Questions (${quiz.questions.length})`}
                                    action={
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => {
                                                resetCurrentQuestion();
                                                setShowAddQuestion(true);
                                            }}
                                            sx={{
                                                '@media (max-width: 600px)': {
                                                    fontSize: '0.75rem',
                                                    padding: '6px 12px'
                                                }
                                            }}
                                        >
                                            Add Question
                                        </Button>
                                    }
                                />
                                <CardContent>
                                    <Box
                                        sx={{
                                            maxHeight: '400px',
                                            overflowY: 'auto',
                                            '@media (max-width: 768px)': {
                                                maxHeight: '300px'
                                            }
                                        }}
                                    >
                                        {quiz.questions.length === 0 ? (
                                            <Typography color="textSecondary">No questions added yet</Typography>
                                        ) : (
                                            quiz.questions.map((question, index) => (
                                                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                                    <CardContent>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="start"
                                                            sx={{
                                                                '@media (max-width: 600px)': {
                                                                    flexDirection: 'column',
                                                                    gap: 2
                                                                }
                                                            }}
                                                        >
                                                            <Box flex={1}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Question {index + 1}: {question.text}
                                                                </Typography>
                                                                <Chip
                                                                    label={questionTypes.find(t => t.value === question.type)?.label}
                                                                    size="small"
                                                                    color="primary"
                                                                />
                                                                {question.type !== 'PARAGRAPH' && (
                                                                    <Box mt={1}>
                                                                        <Typography variant="body2" color="textSecondary">
                                                                            Options: {question.options.join(', ')}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="success.main">
                                                                            Correct: {question.correctAnswers.join(', ')}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    '@media (max-width: 600px)': {
                                                                        width: '100%',
                                                                        display: 'flex',
                                                                        justifyContent: 'flex-end'
                                                                    }
                                                                }}
                                                            >
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() => editQuestion(index)}
                                                                    sx={{ mr: 1 }}
                                                                >
                                                                    <SaveIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => removeQuestion(index)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Add/Edit Question Form */}
                        {showAddQuestion && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader title={editQuestionIndex !== null ? "Edit Question" : "Add New Question"} />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Question Type</InputLabel>
                                                    <Select
                                                        value={currentQuestion.type}
                                                        onChange={(e) => handleQuestionChange('type', e.target.value)}
                                                    >
                                                        {questionTypes.map(type => (
                                                            <MenuItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Question"
                                                    value={currentQuestion.text}
                                                    onChange={(e) => handleQuestionChange('text', e.target.value)}
                                                    multiline
                                                    rows={2}
                                                    required
                                                />
                                            </Grid>

                                            {currentQuestion.type !== 'PARAGRAPH' && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6">Options</Typography>
                                                        <Grid container spacing={1} sx={{ mt: 1 }}>
                                                            {currentQuestion.options.map((option, index) => (
                                                                <Grid item xs={12} md={6} key={index}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label={`Option ${String.fromCharCode(65 + index)}`}
                                                                        value={option}
                                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormLabel component="legend">Correct Answer(s)</FormLabel>
                                                        <Box
                                                            sx={{
                                                                maxHeight: '200px',
                                                                overflowY: 'auto',
                                                                mt: 1
                                                            }}
                                                        >
                                                            {currentQuestion.type === 'SINGLE_SELECT' ? (
                                                                <RadioGroup
                                                                    value={currentQuestion.correctAnswers[0] || ''}
                                                                    onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                                                                >
                                                                    {currentQuestion.options.map((option, index) => (
                                                                        option.trim() && (
                                                                            <FormControlLabel
                                                                                key={index}
                                                                                value={option}
                                                                                control={<Radio />}
                                                                                label={`${String.fromCharCode(65 + index)}: ${option}`}
                                                                            />
                                                                        )
                                                                    ))}
                                                                </RadioGroup>
                                                            ) : (
                                                                currentQuestion.options.map((option, index) => (
                                                                    option.trim() && (
                                                                        <FormControlLabel
                                                                            key={index}
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={currentQuestion.correctAnswers.includes(option)}
                                                                                    onChange={() => handleCorrectAnswerChange(option)}
                                                                                />
                                                                            }
                                                                            label={`${String.fromCharCode(65 + index)}: ${option}`}
                                                                        />
                                                                    )
                                                                ))
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                </>
                                            )}

                                            <Grid item xs={12}>
                                                <Box
                                                    display="flex"
                                                    gap={2}
                                                    sx={{
                                                        '@media (max-width: 600px)': {
                                                            flexDirection: 'column'
                                                        }
                                                    }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        onClick={addOrUpdateQuestion}
                                                        startIcon={<SaveIcon />}
                                                        sx={{
                                                            '@media (max-width: 600px)': {
                                                                width: '100%'
                                                            }
                                                        }}
                                                    >
                                                        {editQuestionIndex !== null ? "Update Question" : "Save Question"}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setShowAddQuestion(false);
                                                            resetCurrentQuestion();
                                                        }}
                                                        sx={{
                                                            '@media (max-width: 600px)': {
                                                                width: '100%'
                                                            }
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* Submit Actions */}
                        <Grid item xs={12}>
                            <Box
                                display="flex"
                                gap={2}
                                justifyContent="flex-end"
                                sx={{
                                    '@media (max-width: 600px)': {
                                        flexDirection: 'column-reverse',
                                        '& > *': {
                                            width: '100%'
                                        }
                                    }
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/masters/quiz')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={<SaveIcon />}
                                >
                                    {loading ? 'Saving...' : (isEdit ? 'Update Quiz' : 'Create Quiz')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </MainCard>
        </LocalizationProvider>
    );
};

export default CreateQuiz;
