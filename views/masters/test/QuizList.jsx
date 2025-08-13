import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// material-ui
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Chip from '@mui/material/Chip';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { toast } from 'react-hot-toast';
import api, { userDetails } from '../../../utils/apiService';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'title',
        headerName: 'Title',
        width: 200,
        editable: false
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 250,
        editable: false
    },
    {
        field: 'questions',
        headerName: 'Questions',
        width: 120,
        editable: false,
        renderCell: (params) => (
            <Chip 
                label={params.value?.length || 0} 
                color="primary" 
                variant="outlined" 
                size="small"
            />
        )
    },
    {
        field: 'startTime',
        headerName: 'Start Time',
        width: 180,
        editable: false,
        renderCell: (params) => {
            if (!params.value) return '-';
            const date = new Date(params.value);
            return date.toLocaleString();
        }
    },
    {
        field: 'endTime',
        headerName: 'End Time',
        width: 180,
        editable: false,
        renderCell: (params) => {
            if (!params.value) return '-';
            const date = new Date(params.value);
            return date.toLocaleString();
        }
    },
    {
        field: 'showScoreAfterSubmission',
        headerName: 'Show Score',
        width: 120,
        editable: false,
        renderCell: (params) => (
            <Chip 
                label={params.value ? 'Yes' : 'No'} 
                color={params.value ? 'success' : 'default'} 
                size="small"
            />
        )
    }
];

const ActionWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 2px',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
        gap: '2px',
        padding: '2px 1px'
    }
});

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleOnClickDelete = async (data) => {
        if (data.id && window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await api.delete(`api/quiz/delete?id=${data.id}`);
                const filteredQuizzes = quizzes.filter(quiz => quiz.id !== data.id);
                setQuizzes(filteredQuizzes);
                setRowCount(prev => prev - 1);
                toast.success('Quiz deleted successfully!');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete quiz.');
            }
        }
    };

    const handlePreviewQuiz = (quizId) => {
        navigate(`/masters/quiz/dashboard/${quizId}`);
    };

    const actionColumn = {
        field: 'actions',
        headerName: 'Actions',
        width: 280,
        minWidth: 280,
        hideable: false,
        renderCell: (params) => {
            return (
                <ActionWrapper>
                    <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handlePreviewQuiz(params.row.id)}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            '@media (max-width: 768px)': {
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                minWidth: 'auto'
                            }
                        }}
                    >
                        Preview
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/masters/quiz/edit/${params.row.id}`)}
                        startIcon={<EditOutlinedIcon />}
                        sx={{
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            '@media (max-width: 768px)': {
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                minWidth: 'auto'
                            }
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleOnClickDelete(params.row)}
                        startIcon={<DeleteIcon />}
                        sx={{
                            fontSize: '0.7rem',
                            padding: '4px 8px',
                            '@media (max-width: 768px)': {
                                fontSize: '0.65rem',
                                padding: '2px 6px',
                                minWidth: 'auto'
                            }
                        }}
                    >
                        Delete
                    </Button>
                </ActionWrapper>
            );
        }
    };

    const fetchQuizzes = async (page, pageSize) => {
        try {
            setLoading(true);
            const response = await api.post(`api/quizzes/getAll/${userDetails.getAccountId()}`, {
                page: page,
                size: pageSize,
                sortBy: "id",
                sortDir: "desc",
                search: ""
            });
            setQuizzes(response.data.content || []);
            setRowCount(response.data.totalElements || 0);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch quizzes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes(page, pageSize);
    }, [page, pageSize]);

    return (
        <MainCard 
            title="Quiz Management" 
            secondary={
                <SecondaryAction 
                    icon={
                        <AddIcon 
                            onClick={() => navigate(`/masters/quiz/add`)} 
                            style={{ cursor: 'pointer' }}
                        />
                    } 
                />
            }
        >
            <Box 
                sx={{ 
                    height: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    '@media (max-width: 768px)': {
                        height: 'calc(100vh - 150px)'
                    }
                }}
            >
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={12}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <Box 
                                    sx={{ 
                                        height: '70vh', 
                                        width: '100%',
                                        '@media (max-width: 768px)': {
                                            height: '60vh'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            overflowX: 'auto',
                                            overflowY: 'hidden',
                                            // For mobile, make sure minWidth is enough for all columns
                                            minWidth: '100%',
                                            '@media (max-width: 1200px)': {
                                                minWidth: 1000
                                            },
                                            '@media (max-width: 900px)': {
                                                minWidth: 800
                                            },
                                            '@media (max-width: 600px)': {
                                                minWidth: 600
                                            }
                                        }}
                                    >
                                        <DataGrid
                                            rows={quizzes}
                                            columns={[...columns, actionColumn]}
                                            loading={loading}
                                            paginationMode="server"
                                            page={page}
                                            pageSize={pageSize}
                                            rowCount={rowCount}
                                            onPageChange={(newPage) => setPage(newPage)}
                                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                            pageSizeOptions={[5, 10, 25]}
                                            checkboxSelection
                                            disableRowSelectionOnClick
                                            getRowId={(row) => row.id}
                                            sx={{
                                                minWidth: 1000,
                                                height: '100%',
                                                '& .MuiDataGrid-main': {
                                                    overflow: 'visible'
                                                },
                                                '& .MuiDataGrid-virtualScroller': {
                                                    overflow: 'visible'
                                                },
                                                '& .MuiDataGrid-columnHeaders': {
                                                    backgroundColor: '#f5f5f5',
                                                    borderBottom: '2px solid #e0e0e0'
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    borderRight: '1px solid #e0e0e0'
                                                },
                                                '@media (max-width: 1200px)': {
                                                    minWidth: 1000
                                                },
                                                '@media (max-width: 900px)': {
                                                    minWidth: 800,
                                                    '& .MuiDataGrid-columnHeader': {
                                                        fontSize: '0.875rem'
                                                    },
                                                    '& .MuiDataGrid-cell': {
                                                        fontSize: '0.8rem'
                                                    }
                                                },
                                                '@media (max-width: 600px)': {
                                                    minWidth: 600,
                                                    '& .MuiDataGrid-columnHeader': {
                                                        fontSize: '0.75rem',
                                                        padding: '8px 4px'
                                                    },
                                                    '& .MuiDataGrid-cell': {
                                                        fontSize: '0.7rem',
                                                        padding: '8px 4px'
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default QuizList; 