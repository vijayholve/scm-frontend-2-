import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// material-ui
import {
    Grid,
    Card,
    CardContent,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
    LinearProgress,
    Paper,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { toast } from 'react-hot-toast';
import api, { userDetails } from '../../../utils/apiService';
import { useSelector } from 'react-redux';

const QuizResult = () => {
    const navigate = useNavigate();
    const { quizId } = useParams();
    const user = useSelector(state => state.user);
    
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizResult();
    }, [quizId]);

    const fetchQuizResult = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/quiz-result/get/${user?.user?.accountId}/${quizId}/${user?.user?.id}`);
            setResult(response?.data);
            console.log("response", response?.data);
            console.log("result", result);
            let questionResults = JSON.parse(response?.data?.questionResultsJson);
            setResult (prev => ({
                ...prev,
                questionResults: questionResults
            }));
            console.log("result", result);

        } catch (err) {
            console.error(err);
            toast.error('Failed to load quiz result');
            //navigate('/masters/student/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'error';
    };

    const getScoreGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    if (loading) {
        return (
            <MainCard title="Loading Result...">
                <LinearProgress />
            </MainCard>
        );
    }

    if (!result) {
        return (
            <MainCard title="Result Not Found">
                <Alert severity="error">Quiz result not found or you don't have permission to access it.</Alert>
            </MainCard>
        );
    }

    const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
    const scoreColor = getScoreColor(scorePercentage);
    const grade = getScoreGrade(scorePercentage);

    return (
        <MainCard title="Quiz Result">
            <Grid container spacing={gridSpacing}>
                {/* Score Summary */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <Typography variant="h4" gutterBottom>
                            {result?.quiz?.title}
                        </Typography>
                        
                        <Box display="flex" justifyContent="center" alignItems="center" gap={4} flexWrap="wrap" sx={{ mt: 2 }}>
                            <Box>
                                <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
                                    {scorePercentage}%
                                </Typography>
                                <Typography variant="h6">Your Score</Typography>
                            </Box>
                            
                            <Box>
                                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                    {grade}
                                </Typography>
                                <Typography variant="h6">Grade</Typography>
                            </Box>
                            
                            <Box>
                                <Typography variant="h4" component="div">
                                    {result.correctAnswers}/{result.totalQuestions}
                                </Typography>
                                <Typography variant="h6">Correct Answers</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Detailed Stats */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h5">{result.correctAnswers}</Typography>
                                    <Typography color="text.secondary">Correct</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h5">{result.totalQuestions - result.correctAnswers}</Typography>
                                    <Typography color="text.secondary">Incorrect</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <QuizIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="h5">{result.totalQuestions}</Typography>
                                    <Typography color="text.secondary">Total Questions</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" color={scoreColor}>{result.timeTaken || 'N/A'}</Typography>
                                    <Typography color="text.secondary">Time Taken</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Performance Indicator */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Performance Analysis</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2">Score Progress</Typography>
                                    <Typography variant="body2">{scorePercentage}%</Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={scorePercentage} 
                                    color={scoreColor}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                            </Box>
                            
                            <Box sx={{ mt: 2 }}>
                                {scorePercentage >= 80 && (
                                    <Alert severity="success">
                                        Excellent work! You have a strong understanding of the material.
                                    </Alert>
                                )}
                                {scorePercentage >= 60 && scorePercentage < 80 && (
                                    <Alert severity="warning">
                                        Good job! Consider reviewing the topics you missed for better understanding.
                                    </Alert>
                                )}
                                {scorePercentage < 60 && (
                                    <Alert severity="error">
                                        You may want to review the material and try again if retakes are allowed.
                                    </Alert>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Question Review */}
                {result?.questionResults && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Question Review</Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Review your answers and see the correct solutions below.
                                </Typography>
                                
                                {result?.questionResults?.map((questionResult, index) => (
                                    <Accordion key={index} sx={{ mt: 1 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box display="flex" alignItems="center" gap={2} width="100%">
                                                <Typography variant="subtitle1">
                                                    Question {index + 1}
                                                </Typography>
                                                <Chip 
                                                    icon={questionResult.correct ? <CheckCircleIcon /> : <CancelIcon />}
                                                    label={questionResult.correct ? 'Correct' : 'Incorrect'}
                                                    color={questionResult.correct ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Q:</strong> {questionResult.question}
                                                </Typography>
                                                
                                                {questionResult.type !== 'PARAGRAPH' && (
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Options:
                                                        </Typography>
                                                        {questionResult.options.map((option, optIndex) => (
                                                            <Box key={optIndex} sx={{ ml: 2, mb: 0.5 }}>
                                                                <Typography 
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: questionResult.correctAnswers.includes(option) ? 'success.main' : 'inherit'
                                                                    }}
                                                                >
                                                                    {String.fromCharCode(65 + optIndex)}. {option}
                                                                    {questionResult.correctAnswers.includes(option) && ' ✓'}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                                
                                                <Divider sx={{ my: 2 }} />
                                                
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    <Typography variant="body2">
                                                        <strong>Your Answer:</strong> {
                                                            Array.isArray(questionResult.studentAnswers) 
                                                                ? questionResult.studentAnswers.join(', ') 
                                                                : questionResult.studentAnswers || 'Not answered'
                                                        }
                                                    </Typography>
                                                    
                                                    <Typography variant="body2" color="success.main">
                                                        <strong>Correct Answer:</strong> {
                                                            Array.isArray(questionResult.correctAnswers)
                                                                ? questionResult.correctAnswers.join(', ')
                                                                : questionResult.correctAnswers
                                                        }
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Action Buttons */}
                <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="center">
                        <Button
                            variant="outlined"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/masters/student/quizzes')}
                        >
                            Back to Quizzes
                        </Button>
                        
                        {result.allowRetake && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/masters/quiz/attempt/${quizId}`)}
                            >
                                Retake Quiz
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default QuizResult; 