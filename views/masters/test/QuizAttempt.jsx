import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
import {
    Grid,
    Card,
    CardContent,
    Button,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    TextField,
    Box,
    LinearProgress,
    Paper,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { toast } from 'react-hot-toast';
import api, { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const QuizAttempt = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        fetchQuiz();

    }, [quizId]);

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmitQuiz(true); // Auto-submit when time expires
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    const fetchQuiz = async () => {
        try {
            setLoading(true);
            const response = await api.get(`api/quizzes/${user?.user?.accountId}/${quizId}`);
            const quizData = response?.data;
            
            const now = dayjs();
            const startTime = dayjs(quizData.startTime);
            const endTime = dayjs(quizData.endTime);

            // Check if the current time is within the allowed quiz window
            if (now.isBefore(startTime) || now.isAfter(endTime)) {
                toast.error('This quiz is not available at this time.');
                navigate('/masters/student/quizzes');
                return;
            }

            setQuiz(quizData);
            
            // Calculate time remaining
            const secondsRemaining = Math.max(0, endTime.diff(now, 'second'));
            setTimeRemaining(secondsRemaining);
            
            // Initialize answers if continuing a quiz
            if (quizData.existingAnswers) {
                setAnswers(quizData.existingAnswers);
            }
            
        } catch (err) {
            console.error(err);
            toast.error('Failed to load quiz');
            // navigate('/masters/student/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleMultiSelectChange = (questionId, option, checked) => {
        setAnswers(prev => {
            const currentAnswers = prev[questionId] || [];
            let newAnswers;
            
            if (checked) {
                newAnswers = [...currentAnswers, option];
            } else {
                newAnswers = currentAnswers.filter(a => a !== option);
            }
            
            return {
                ...prev,
                [questionId]: newAnswers
            };
        });
    };

    const handleSubmitQuiz = async (isAutoSubmit = false) => {
        try {
            setSubmitting(true);
            
            if (!isAutoSubmit) {
                setShowSubmitDialog(false);
            }
            
            const submissionData = {
                quizId: quizId,
                studentId: user?.user?.id,
                accountId: user?.user?.accountId,
                answers: answers,
                submittedAt: new Date().toISOString(),
                isAutoSubmit
            };
            
            const response = await api.post('api/studentanswer/submit', submissionData);
            
            if (response?.status === 200) {
                toast.success(isAutoSubmit ? 'Quiz auto-submitted due to time expiry' : 'Quiz submitted successfully');
                if(quiz?.showScoreImmediately) {
                    navigate(`/masters/quiz/result/${quizId}`);
                } else {
                    navigate(`/masters/student/quizzes`);
                }
            } else {
                toast.error(response?.message || 'Failed to submit quiz');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const currentQuestion = quiz?.questions?.[currentQuestionIndex];
    const totalQuestions = quiz?.questions?.length || 0;
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

    if (loading) {
        return (
            <MainCard title="Loading Quiz...">
                <LinearProgress />
            </MainCard>
        );
    }

    if (!quiz) {
        return (
            <MainCard title="Quiz Not Found">
                <Alert severity="error">Quiz not found or you don't have permission to access it.</Alert>
            </MainCard>
        );
    }

    return (
        <MainCard title={quiz.title}>
            <Grid container spacing={gridSpacing}>
                {/* Quiz Header */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Typography variant="h6">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <AccessTimeIcon color={timeRemaining < 300 ? 'error' : 'action'} />
                                    <Typography 
                                        variant="h6" 
                                        color={timeRemaining < 300 ? 'error' : 'inherit'}
                                    >
                                        {formatTime(timeRemaining)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ mt: 1 }}
                        />
                    </Paper>
                </Grid>

                {/* Question Content */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            {currentQuestion && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        {currentQuestion.text}
                                    </Typography>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    {/* Single Select Question */}
                                    {currentQuestion.type === 'SINGLE_SELECT' && (
                                        <RadioGroup
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                        >
                                            {currentQuestion.options.map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={option}
                                                    control={<Radio />}
                                                    label={`(${String.fromCharCode(65 + index)}) ${option}`}
                                                    sx={{ mb: 1 }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                    
                                    {/* Multi Select Question */}
                                    {currentQuestion.type === 'MULTI_SELECT' && (
                                        <Box>
                                            {currentQuestion.options.map((option, index) => {
                                                const currentAnswers = answers[currentQuestion.id] || [];
                                                return (
                                                    <FormControlLabel
                                                        key={index}
                                                        control={
                                                            <Checkbox
                                                                checked={currentAnswers.includes(option)}
                                                                onChange={(e) => handleMultiSelectChange(
                                                                    currentQuestion.id, 
                                                                    option, 
                                                                    e.target.checked
                                                                )}
                                                            />
                                                        }
                                                        label={`(${String.fromCharCode(65 + index)}) ${option}`}
                                                        sx={{ mb: 1, display: 'block' }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    
                                    {/* Paragraph Question */}
                                    {currentQuestion.type === 'PARAGRAPH' && (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={6}
                                            placeholder="Type your answer here..."
                                            value={answers[currentQuestion.id] || ''}
                                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                                        />
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Navigation */}
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<NavigateBeforeIcon />}
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        
                        <Box display="flex" gap={1}>
                            {quiz.questions.map((_, index) => (
                                <Button
                                    key={index}
                                    variant={index === currentQuestionIndex ? "contained" : "outlined"}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    sx={{ minWidth: '40px' }}
                                    color={answers[quiz.questions[index].id] ? "success" : "primary"}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </Box>
                        
                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <Button
                                variant="outlined"
                                endIcon={<NavigateNextIcon />}
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="success"
                                endIcon={<SendIcon />}
                                onClick={() => setShowSubmitDialog(true)}
                                disabled={submitting}
                            >
                                Submit Quiz
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>

            {/* Submit Confirmation Dialog */}
            <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
                <DialogTitle>Submit Quiz</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to submit the quiz? You won't be able to change your answers after submission.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Answered: {Object.keys(answers).length} of {totalQuestions} questions
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={() => handleSubmitQuiz(false)}
                        variant="contained"
                        color="success"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default QuizAttempt;