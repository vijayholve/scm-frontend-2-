import { useNavigate } from "react-router-dom";
// material-ui
import Grid from '@mui/material/Grid';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';

import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  Edit as EditIcon,
  Delete as DeleteIconNew,
  Visibility as ViewIcon
} from '@mui/icons-material';
import api, { userDetails } from '../../../utils/apiService';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../utils/permissionUtils";

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'schoolName',
        headerName: 'School Name',
        width: 150,
        flex: 0.8
    },
    {
        field: 'className',
        headerName: 'Class Name',
        width: 120,
        flex: 0.6
    },
    {
        field: 'divisionName',
        headerName: 'Division Name',
        width: 120,
        flex: 0.6
    },
    {
        field: 'createdDate',
        headerName: 'Created Date',
        width: 120,
        flex: 0.7,
        renderCell: (params) => {
            return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
        }
    }
];

// ==============================|| TIMETABLES ||============================== //

const Timetables = () => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    const user = useSelector((state) => state.user.user);
    console.log('User:', user);
    const permissions = user?.role?.permissions;
    
    // Filter state management
    const [schools, setSchools] = useState([]);
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDivisionId, setSelectedDivisionId] = useState('');
    const [timetables, setTimetables] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);

    // Fetch all dropdown data for filters
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Fetch schools
                const schoolsResponse = await api.get(`api/schoolBranches/getAllBy/${accountId}`);
                setSchools(schoolsResponse.data || []);

                // Fetch classes
                const classesResponse = await api.get(`api/schoolClasses/getAllBy/${accountId}`);
                setClasses(classesResponse.data || []);

                // Fetch divisions
                const divisionsResponse = await api.get(`api/divisions/getAllBy/${accountId}`);
                setDivisions(divisionsResponse.data || []);
            } catch (err) {
                console.error('Failed to fetch dropdown data:', err);
            }
        };
        fetchDropdownData();
    }, [accountId]);

    // Create the filters object to pass to ReusableDataGrid
    const filters = {
        schoolId: selectedSchoolId || null,
        classId: selectedClassId || null,
        divisionId: selectedDivisionId || null
    };

    const handleOnClickDelete = (data) => {
        if (data.id) {
            api.delete(`api/timetable/delete?id=${data?.id}`).then(response => {
                const filterTimetables = timetables.filter(timetable => timetable.id !== data.id);
                setTimetables([...filterTimetables]);
            }).catch(err => console.error(err));
        }
    }

    // Updated action buttons with Fee component styling
    const actionColumn = {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        minWidth: 180,
        hideable: false,
        renderCell: (params) => {
            return (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {hasPermission(permissions, 'TIMETABLE', 'view') && (
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/masters/timetable/view/${params.row.id}`)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <ViewIcon />
                        </IconButton>
                    )}
                    {hasPermission(permissions, 'TIMETABLE', 'edit') && (
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/masters/timetable/edit/${params.row.id}`)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                    {hasPermission(permissions, 'TIMETABLE', 'delete') && (
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOnClickDelete(params.row)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <DeleteIconNew />
                        </IconButton>
                    )}
                </Box>
            );
        }
    };
    return (
        <MainCard 
            title="📅 Timetables" 
            secondary={hasPermission(permissions, 'TIMETABLE', 'add') ? 
                <SecondaryAction icon={<AddIcon onClick={() => navigate(`/masters/timetable/add`)} />} /> : null
            }
        >
            {/* Filter Section */}
            <Grid container spacing={gridSpacing} sx={{ ml: 2, mb: 3,mr:2 }}>
                {/* School Filter Dropdown */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="school-select-label">School</InputLabel>
                        <Select
                            labelId="school-select-label"
                            id="school-select"
                            value={selectedSchoolId}
                            label="School"
                            onChange={(e) => setSelectedSchoolId(e.target.value)}
                        >
                            <MenuItem value=""><em>All Schools</em></MenuItem>
                            {schools.map((school) => (
                                <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Class Filter Dropdown */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="class-select-label">Class</InputLabel>
                        <Select
                            labelId="class-select-label"
                            id="class-select"
                            value={selectedClassId}
                            label="Class"
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            <MenuItem value=""><em>All Classes</em></MenuItem>
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Division Filter Dropdown */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="division-select-label">Division</InputLabel>
                        <Select
                            labelId="division-select-label"
                            id="division-select"
                            value={selectedDivisionId}
                            label="Division"
                            onChange={(e) => setSelectedDivisionId(e.target.value)}
                        >
                            <MenuItem value=""><em>All Divisions</em></MenuItem>
                            {divisions.map((division) => (
                                <MenuItem key={division.id} value={division.id}>{division.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Timetable Grid */}
            <Grid item xs={12}>
                <ReusableDataGrid
                    fetchUrl={`/api/timetable/getAllBy/${accountId}`}
                    columns={[...columns]}
                    editUrl="/masters/timetable/edit"
                    deleteUrl="/api/timetable/delete"
                    filters={filters}
                    isPostRequest={true}
                    viewUrl="/masters/timetable/view"
                    entityName="TIMETABLE"
                />
            </Grid>
        </MainCard>
    )
};

export default Timetables;

