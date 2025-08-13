import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// material-ui
import Grid from '@mui/material/Grid';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Chip,
    Box,
    LinearProgress,
    Alert
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { toast } from 'react-hot-toast';
import api, { userDetails } from '../../../utils/apiService';
import { useSelector } from "react-redux";

const StudentQuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    console.log("student quiz list", user?.user);
    useEffect(() => {
        fetchAvailableQuizzes();
    }, []);

    const fetchAvailableQuizzes = async () => {
        try {
            setLoading(true);
            const response = await api.post(`/api/quizzes/getAll/${user?.user?.accountId}/${user?.user?.schoolId}/${user?.user?.classId}`, {
                page: 0,
                size: 10,
                sortBy: "id",
                sortDir: "asc"
            });
            setQuizzes(response?.data?.content || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch available quizzes');
        } finally {
            setLoading(false);
        }
    };

    const getQuizStatus = (quiz) => {
        const now = new Date();
        const startTime = new Date(quiz.startTime);
        const endTime = new Date(quiz.endTime);

        if (quiz.isCompleted) {
            return { status: 'completed', label: 'Completed', color: 'success' };
        }
        
        if (now < startTime) {
            return { status: 'scheduled', label: 'Scheduled', color: 'info' };
        }
        
        if (now > endTime) {
            return { status: 'expired', label: 'Expired', color: 'error' };
        }
        
        if (quiz.isStarted && !quiz.isCompleted) {
            return { status: 'in_progress', label: 'In Progress', color: 'warning' };
        }
        
        return { status: 'available', label: 'Available', color: 'success' };
    };

    const getTimeInfo = (quiz) => {
        const now = new Date();
        const startTime = new Date(quiz.startTime);
        const endTime = new Date(quiz.endTime);
        
        if (now < startTime) {
            return `Starts: ${startTime.toLocaleString()}`;
        }
        
        if (now > endTime) {
            return `Ended: ${endTime.toLocaleString()}`;
        }
        
        return `Ends: ${endTime.toLocaleString()}`;
    };

    const handleStartQuiz = async (quizId) => {
        try {
            // Check if quiz can be startedstart/{accountId}/{quizId}
            const response = await api.post(`api/quizzes/start/${user?.user?.accountId}/${quizId}`, {
                studentId: user?.user?.id
            });
            console.log("response", response);
            if (response?.status === 200) {
                navigate(`/masters/quiz/attempt/${quizId}`);
            } else {
                toast.error(response?.message || 'Cannot start quiz at this time');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to start quiz');
        }
    };

    const handleViewResult = (quizId) => {
        navigate(`/quiz/result/${quizId}`);
    };

    if (loading) {
        return (
            <MainCard title="Available Quizzes">
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                    <Typography sx={{ mt: 2 }} align="center">Loading quizzes...</Typography>
                </Box>
            </MainCard>
        );
    }

    return (
        <MainCard title="Available Quizzes">
            <Grid container spacing={gridSpacing}>
                {quizzes.length === 0 ? (
                    <Grid item xs={12}>
                        <Alert severity="info">
                            No quizzes available at the moment. Please check back later.
                        </Alert>
                    </Grid>
                ) : (
                    quizzes.map((quiz) => {
                        const quizStatus = getQuizStatus(quiz);
                        const timeInfo = getTimeInfo(quiz);
                        
                        return (
                            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        '&:hover': {
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Typography variant="h6" component="h2" gutterBottom>
                                                {quiz.title}
                                            </Typography>
                                            <Chip 
                                                label={quizStatus.label}
                                                color={quizStatus.color}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        {quiz.description && (
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {quiz.description}
                                            </Typography>
                                        )}
                                        
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <AccessTimeIcon fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {timeInfo}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary">
                                                Questions: {quiz.questions?.length || 0}
                                            </Typography>
                                            
                                            {quiz.score !== undefined && (
                                                <Typography variant="body2" color="primary">
                                                    Score: {quiz.score}%
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                    
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        {quizStatus.status === 'completed' && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleViewResult(quiz.id)}
                                            >
                                                View Result
                                            </Button>
                                        )}
                                        
                                        {quizStatus.status === 'available' && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<PlayArrowIcon />}
                                                onClick={() => handleStartQuiz(quiz.id)}
                                            >
                                                Start Quiz
                                            </Button>
                                        )}
                                        
                                        {quizStatus.status === 'in_progress' && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="warning"
                                                startIcon={<PlayArrowIcon />}
                                                onClick={() => navigate(`/quiz/attempt/${quiz.id}`)}
                                            >
                                                Continue Quiz
                                            </Button>
                                        )}
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => navigate(`/masters/quiz/result/${quiz.id}`)}
                                            >
                                                View Result
                                            </Button>
                                        
                                        {(quizStatus.status === 'scheduled' || quizStatus.status === 'expired') && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                disabled
                                                startIcon={<LockIcon />}
                                            >
                                                {quizStatus.status === 'scheduled' ? 'Not Started' : 'Expired'}
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </MainCard>
    );
};

export default StudentQuizList; 