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

// The columns definition remains the same.
const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 200, editable: false },
    { field: 'description', headerName: 'Description', width: 250, editable: false },
    {
        field: 'questions',
        headerName: 'Questions',
        width: 120,
        editable: false,
        renderCell: (params) => <Chip label={params.value?.length || 0} color="primary" variant="outlined" size="small" />
    },
    {
        field: 'startTime',
        headerName: 'Start Time',
        width: 180,
        editable: false,
        renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '-')
    },
    {
        field: 'endTime',
        headerName: 'End Time',
        width: 180,
        editable: false,
        renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : '-')
    },
    {
        field: 'showScoreAfterSubmission',
        headerName: 'Show Score',
        width: 120,
        editable: false,
        renderCell: (params) => <Chip label={params.value ? 'Yes' : 'No'} color={params.value ? 'success' : 'default'} size="small" />
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
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10
    });
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const response = await api.post(`api/quizzes/getAll/${userDetails.getAccountId()}`, {
                page: paginationModel.page,
                size: paginationModel.pageSize,
                sortBy: "id",
                sortDir: "desc",
                search: ""
            });
            setQuizzes(response.data.content || []);
            setRowCount(response.data.totalElements || 0);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch quizzes');
            setQuizzes([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchQuizzes();
    }, [paginationModel]);

    // ✅ CORRECTED DELETE HANDLER
    // This version re-fetches data from the server to ensure consistency.
    const handleOnClickDelete = async (data) => {
        if (data.id && window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await api.delete(`api/quiz/delete?id=${data.id}`);
                toast.success('Quiz deleted successfully!');
                
                // Edge case: If the deleted item was the last one on the current page,
                // go back to the previous page.
                if (quizzes.length === 1 && paginationModel.page > 0) {
                    setPaginationModel(prev => ({ ...prev, page: prev.page - 1 }));
                } else {
                    // Otherwise, just re-fetch the data for the current page.
                    fetchQuizzes();
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete quiz.');
            }
        }
    };

    const handlePreviewQuiz = (quizId) => {
        navigate(`/masters/quiz/dashboard/${quizId}`);
    };
    
    const actionColumn = { /* ... Unchanged action column definition ... */ };

    return (
        <MainCard
            title="Quiz Management"
            secondary={
                <SecondaryAction
                    icon={<AddIcon onClick={() => navigate(`/masters/quiz/add`)} style={{ cursor: 'pointer' }} />}
                />
            }
        >
            <Box sx={{ height: 'calc(100vh - 200px)', /* other styles */ }}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Box sx={{ height: '70vh', width: '100%', /* other styles */ }}>
                            <DataGrid
                                rows={quizzes}
                                columns={[...columns, actionColumn]}
                                loading={loading}
                                rowCount={rowCount}
                                getRowId={(row) => row.id}
                                
                                // ✅ CORRECTED PAGINATION
                                // Using the modern `paginationModel` and `onPaginationModelChange` API for DataGrid v5+
                                paginationMode="server"
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[5, 10, 25]}
                                
                                checkboxSelection
                                disableRowSelectionOnClick
                                sx={{ minWidth: 1000, /* other styles */ }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default QuizList;