import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Grid, Button, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import api from 'utils/apiService';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';

const ActionWrapper = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    padding: '4px'
});

const ReusableDataGrid = ({ title, fetchUrl, columns: propColumns, editUrl, deleteUrl, addActionUrl, viewUrl, filters = {}, isPostRequest = true,entityName }) => {
    const navigate = useNavigate();

    const permissions = useSelector((state) => state.user.permissions);
    
    // State for data, pagination, and loading
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [rowCount, setRowCount] = useState(0);

    // Memoized function to fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (isPostRequest) {
                const payload = {
                    page: paginationModel.page,
                    size: paginationModel.pageSize,
                    sortBy: "id",
                    sortDir: "asc",
                    search: "",
                    ...filters
                };
                response = await api.post(fetchUrl, payload);
            } else {
                response = await api.get(fetchUrl);
            }
            
            setData(response.data.content || response.data || []);
            setRowCount(response.data.totalElements || response.data.length || 0);
            
            if (!response) {
                console.error('No response from API');
                console.log("URL: " + fetchUrl);
            }
        } catch (err) {
            console.error(`Failed to fetch data from ${fetchUrl}:`, err);
            toast.error("Could not fetch data.");
            setData([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    }, [fetchUrl, paginationModel, JSON.stringify(filters), isPostRequest]);

    // Trigger fetch when pagination or filters change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOnClickDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`${deleteUrl}?id=${id}`);
                toast.success('Item deleted successfully!');
                fetchData(); // Refetch data after deletion
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete item.');
            }
        }
    };

    const handleOnClickView = async (id) => {
        navigate(`${viewUrl}/${id}`);
    };

    // Create actions column only if there are actions available
    const hasActions = editUrl || deleteUrl || viewUrl;
    const actionsColumn = hasActions ? {
        field: 'actions',
        headerName: 'Actions',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <ActionWrapper>
                {viewUrl && hasPermission(permissions, entityName, 'view') && (
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleOnClickView(params.row.id)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                transform: 'scale(1.1)'
                            }
                        }}
                        title="View Details"
                    >
                        <ViewIcon />
                    </IconButton>
                )}
                {editUrl && hasPermission(permissions, entityName, 'edit') && (
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`${editUrl}/${params.row.id}`)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                transform: 'scale(1.1)'
                            }
                        }}
                        title="Edit"
                    >
                        <EditIcon />
                    </IconButton>
                )}
                {deleteUrl && hasPermission(permissions, entityName, 'delete') && (
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOnClickDelete(params.row.id)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                transform: 'scale(1.1)'
                            }
                        }}
                        title="Delete"
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </ActionWrapper>
        )
    } : null;

    const columns = hasActions ? [...propColumns, actionsColumn] : propColumns;

    return (
        <MainCard
            title={title}
            secondary={<SecondaryAction icon={<AddIcon />} link={addActionUrl} />}
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            loading={loading}
                            rowCount={rowCount}
                            pageSizeOptions={[5, 10, 25]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            paginationMode="server"
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ReusableDataGrid;