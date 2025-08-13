import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Grid, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';

// Define the columns specifically for the Students data grid.
const columnsConfig = [
    { field: 'rollno', headerName: 'Roll No', width: 90 },
    { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
    { field: 'address', headerName: 'Address', width: 110, flex: 1 },
    { field: 'className', headerName: 'Class', width: 110, flex: 1 },
    { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 }
];

const ActionWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 6px'
});

// ==============================|| STUDENTS LIST PAGE ||============================== //

const Students = () => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    
    // State for data, pagination, and loading
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [rowCount, setRowCount] = useState(0);

    // Memoized function to fetch student data
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        const payload = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            sortBy: "id",
            sortDir: "asc",
            search: ""
        };
        try {
            const response = await api.post(`/api/users/getAll/${accountId}?type=STUDENT`, payload);
            
            const transformedData = (response.data.content || []).map(student => ({
                ...student,
                rollno: student.rollNo || student.id,
                name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.userName,
                className: 'N/A', // Placeholder, as we are not fetching class/division names anymore
                divisionName: 'N/A'
            }));
            
            setStudents(transformedData);
            setRowCount(response.data.totalElements || 0);
        } catch (err) {
            console.error("Failed to fetch students:", err);
            toast.error("Could not fetch student data.");
            setStudents([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    }, [accountId, paginationModel]);

    // Trigger fetch when pagination changes
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleOnClickDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`api/users/delete?id=${id}`);
                toast.success('Student deleted successfully!');
                fetchStudents(); // Refetch data after deletion
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete student.');
            }
        }
    };

    const columns = [
        ...columnsConfig,
        {
            field: 'actions',
            headerName: 'Actions',
            width: 190,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionWrapper>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/masters/student/edit/${params.row.id}`)}
                        startIcon={<EditOutlinedIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleOnClickDelete(params.row.id)}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </ActionWrapper>
            )
        }
    ];

    return (
        <MainCard
            title="Manage Students"
            secondary={<SecondaryAction icon={<AddIcon />} link="/masters/student/add" />}
        >
            <Grid container spacing={gridSpacing}>
                {/* Data Grid */}
                <Grid item xs={12}>
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={students}
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

export default Students;
