import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// material-ui
import { 
    Grid, 
    Tabs, 
    Tab, 
    Box, 
    Button, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    Checkbox,
    FormControlLabel,
    TextField,
    IconButton,
    Chip
} from '@mui/material';
import { styled } from '@mui/system';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Print as PrintIcon,
    Download as DownloadIcon,
    CreditCard as IdCardIcon,
    School as SchoolIcon,
    Person as PersonIcon
} from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid.jsx';
import IdCardGenerationModal from './IdCardGenerationModal';
import api, { userDetails } from '../../../utils/apiService';
import { useSelector } from "react-redux";
import { hasPermission } from "../../../utils/permissionUtils";

// Styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        minHeight: 48,
    }
}));

const ActionContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
});

const SelectionInfo = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1976d2'
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`idcard-tabpanel-${index}`}
            aria-labelledby={`idcard-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `idcard-tab-${index}`,
        'aria-controls': `idcard-tabpanel-${index}`,
    };
}

const IdCardManagement = () => {
    const navigate = useNavigate();
    const permissions = useSelector((state) => state.user.permissions);
    const accountId = userDetails.getAccountId();
    const [tabValue, setTabValue] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [generationModalOpen, setGenerationModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [divisionFilter, setDivisionFilter] = useState('');
    const [classes, setClasses] = useState([]);
    const [divisions, setDivisions] = useState([]);

    // Student columns configuration
    const studentColumns = [
        { 
            field: 'select', 
            headerName: 'Select', 
            width: 80,
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={(e) => handleRowSelection(params.row.id, e.target.checked)}
                    color="primary"
                />
            ),
            disableColumnMenu: true,
            sortable: false
        },
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'rollNo', headerName: 'Roll No', width: 100 },
        {
            field: 'fullName',
            headerName: 'Student Name',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                        {`${params.row.firstName || ''} ${params.row.middleName || ''} ${params.row.lastName || ''}`.trim()}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'className', 
            headerName: 'Class', 
            width: 100,
            renderCell: (params) => (
                <Chip label={params.value} size="small" color="primary" variant="outlined" />
            )
        },
        { 
            field: 'divisionName', 
            headerName: 'Division', 
            width: 100,
            renderCell: (params) => (
                <Chip label={params.value} size="small" color="secondary" variant="outlined" />
            )
        },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'mobile', headerName: 'Mobile', width: 130 },
        { 
            field: 'gender', 
            headerName: 'Gender', 
            width: 100,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    color={params.value === 'Male' ? 'info' : 'success'} 
                    variant="outlined" 
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" title="View Details">
                        <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="info" title="Generate ID Card" 
                        onClick={() => handleSingleIdGeneration(params.row)}>
                        <IdCardIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
            disableColumnMenu: true,
            sortable: false
        }
    ];

    // Teacher columns configuration
    const teacherColumns = [
        { 
            field: 'select', 
            headerName: 'Select', 
            width: 80,
            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={(e) => handleRowSelection(params.row.id, e.target.checked)}
                    color="primary"
                />
            ),
            disableColumnMenu: true,
            sortable: false
        },
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'fullName',
            headerName: 'Teacher Name',
            width: 200,
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                        {`${params.row.firstName || ''} ${params.row.middleName || ''} ${params.row.lastName || ''}`.trim()}
                    </Typography>
                </Box>
            )
        },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'mobile', headerName: 'Mobile', width: 130 },
        { 
            field: 'roleName', 
            headerName: 'Role', 
            width: 120,
            renderCell: (params) => (
                <Chip label={params.value} size="small" color="warning" variant="outlined" />
            )
        },
        { 
            field: 'gender', 
            headerName: 'Gender', 
            width: 100,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    color={params.value === 'Male' ? 'info' : 'success'} 
                    variant="outlined" 
                />
            )
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 100,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    color={params.value === 'Active' ? 'success' : 'error'} 
                    variant="outlined" 
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" title="View Details">
                        <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="info" title="Generate ID Card" 
                        onClick={() => handleSingleIdGeneration(params.row)}>
                        <IdCardIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
            disableColumnMenu: true,
            sortable: false
        }
    ];

    useEffect(() => {
        fetchClassesAndDivisions();
    }, []);
    const fetchClassesAndDivisions = async () => {
        try {
            const [classResponse, divisionResponse] = await Promise.all([
                api.get(`/api/schoolClasses/getAllBy/${accountId}`),
                api.get(`/api/divisions/getAllBy/${accountId}`)
            ]);
            
            setClasses(classResponse.data || []);
            setDivisions(divisionResponse.data || []);
            console.log(classResponse.data);
            console.log(divisionResponse.data);
        } catch (error) {
            console.error('Error fetching classes and divisions:', error);
        }
    };


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSelectedRows([]);
        setAllSelected(false);
        setSearchTerm('');
        setClassFilter('');
        setDivisionFilter('');
    };

    const handleRowSelection = (id, checked) => {
        if (checked) {
            setSelectedRows(prev => [...prev, id]);
        } else {
            setSelectedRows(prev => prev.filter(rowId => rowId !== id));
            setAllSelected(false);
        }
    };

    const handleSelectAll = (checked) => {
        setAllSelected(checked);
        if (checked) {
            // This would need to be implemented based on current data in the grid
            // For now, we'll clear selections when unchecked
            setSelectedRows([]);
        } else {
            setSelectedRows([]);
        }
    };

    const handleSingleIdGeneration = (userData) => {
        setSelectedRows([userData.id]);
        setGenerationModalOpen(true);
    };

    const handleBulkIdGeneration = () => {
        if (selectedRows.length === 0) {
            alert('Please select at least one record to generate ID cards.');
            return;
        }
        setGenerationModalOpen(true);
    };

    const getFilters = () => {
        const filters = {};
        
        if (searchTerm) {
            filters.search = searchTerm;
        }
        
        if (classFilter) {
            filters.classId = classFilter;
        }
        
        if (divisionFilter) {
            filters.divisionId = divisionFilter;
        }
        
        return filters;
    };

    const getCurrentEntity = () => tabValue === 0 ? 'STUDENT' : 'TEACHER';
    const getCurrentFetchUrl = () => tabValue === 0 ? `/api/users/getAllBy/${accountId}?type=STUDENT` : `/api/users/getAllBy/${accountId}?type=TEACHER`;
    const getCurrentColumns = () => tabValue === 0 ? studentColumns : teacherColumns;

    return (
        <MainCard
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IdCardIcon color="primary" />
                    <Typography variant="h3">ID Card Management</Typography>
                </Box>
            }
            secondary={
                <SecondaryAction 
                    title="Manage student and teacher ID cards with professional templates"
                />
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    {/* Tab Navigation */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <StyledTabs 
                            value={tabValue} 
                            onChange={handleTabChange} 
                            aria-label="ID card management tabs"
                        >
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon />
                                        Students
                                    </Box>
                                } 
                                {...a11yProps(0)} 
                            />
                            <Tab 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SchoolIcon />
                                        Teachers
                                    </Box>
                                } 
                                {...a11yProps(1)} 
                            />
                        </StyledTabs>
                    </Box>

                    {/* Filters and Actions */}
                    <ActionContainer>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Search by Name/Roll No/Email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Class</InputLabel>
                                    <Select
                                        value={classFilter}
                                        onChange={(e) => setClassFilter(e.target.value)}
                                        label="Class"
                                    >
                                        <MenuItem value="">All Classes</MenuItem>
                                        {classes.map((cls) => (
                                            <MenuItem key={cls.id} value={cls.id}>
                                                {cls.className}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Division</InputLabel>
                                    <Select
                                        value={divisionFilter}
                                        onChange={(e) => setDivisionFilter(e.target.value)}
                                        label="Division"
                                    >
                                        <MenuItem value="">All Divisions</MenuItem>
                                        {divisions.map((div) => (
                                            <MenuItem key={div.id} value={div.id}>
                                                {div.divisionName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={allSelected}
                                                onChange={(e) => handleSelectAll(e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Select All"
                                    />
                                    
                                    {selectedRows.length > 0 && (
                                        <SelectionInfo>
                                            <Typography variant="body2" fontWeight="600">
                                                {selectedRows.length} selected
                                            </Typography>
                                        </SelectionInfo>
                                    )}
                                    
                                    <Button
                                        variant="contained"
                                        startIcon={<IdCardIcon />}
                                        onClick={handleBulkIdGeneration}
                                        disabled={selectedRows.length === 0}
                                        sx={{ whiteSpace: 'nowrap' }}
                                    >
                                        Generate ID Cards
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </ActionContainer>

                    {/* Data Grid Tabs */}
                    <TabPanel value={tabValue} index={0}>
                        <ReusableDataGrid
                            title="Students"
                            fetchUrl={getCurrentFetchUrl()}
                            columns={getCurrentColumns()}
                            filters={getFilters()}
                            entityName="STUDENT"
                            checkboxSelection={false} // We handle selection manually
                            isPostRequest={false}
                        />
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={1}>
                        <ReusableDataGrid
                            title="Teachers"
                            
                            fetchUrl={getCurrentFetchUrl()}
                            columns={getCurrentColumns()}
                            filters={getFilters()}
                            entityName="teachers"
                            checkboxSelection={false} // We handle selection manually
                            isPostRequest={false}
                        />
                    </TabPanel>
                </Grid>
            </Grid>

            {/* ID Card Generation Modal */}
            <IdCardGenerationModal
                open={generationModalOpen}
                onClose={() => setGenerationModalOpen(false)}
                selectedRows={selectedRows}
                entityType={getCurrentEntity()}
                onComplete={() => {
                    setGenerationModalOpen(false);
                    setSelectedRows([]);
                    setAllSelected(false);
                }}
            />
        </MainCard>
    );
};

export default IdCardManagement;