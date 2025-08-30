import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, CircularProgress, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from '../../../ui-component/ReusableDataGrid';
import { userDetails } from '../../../utils/apiService';
import api from '../../../utils/apiService';
import { useDispatch, useSelector } from 'react-redux';
import { setAllStudents, filterStudents } from '../../../store/userSlice';
import ListGridFilters from '../../../ui-component/ListGridFilters';
import BulkUploadModal from './components/BulkUploadModal';

const columnsConfig = [
    { field: 'rollNo', headerName: 'Roll No', width: 90 },
    { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
    { field: 'firstName', headerName: 'First Name', width: 150, flex: 1 },
    { field: 'lastName', headerName: 'Last Name', width: 150, flex: 1 },
    { field: 'email', headerName: 'Email', width: 110, flex: 1 },
    { field: 'mobile', headerName: 'Mobile', width: 110, flex: 1 },
    { field: 'schoolName', headerName: 'School', width: 110, flex: 1 },
    { field: 'className', headerName: 'Class', width: 110, flex: 1 },
    { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 }
];

const Students = () => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    const [schoolNames, setSchoolNames] = useState({});
    const [classNames, setClassNames] = useState({});
    const [divisionNames, setDivisionNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [openBulkUpload, setOpenBulkUpload] = useState(false);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [schoolResponse, classResponse, divisionResponse] = await Promise.all([
                    api.post(`/api/schoolBranches/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' }),
                    api.post(`/api/schoolClasses/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' }),
                    api.post(`/api/divisions/getAll/${accountId}`, { page: 0, size: 1000, sortBy: 'id', sortDir: 'asc' })
                ]);
                
                const schoolMap = {};
                (schoolResponse.data.content || []).forEach((sch) => {
                    schoolMap[sch.id] = sch.name;
                });
                setSchoolNames(schoolMap);

                const classMap = {};
                (classResponse.data.content || []).forEach((cls) => {
                    classMap[cls.id] = cls.name;
                });
                setClassNames(classMap);
                
                const divisionMap = {};
                (divisionResponse.data.content || []).forEach((div) => {
                    divisionMap[div.id] = div.name;
                });
                setDivisionNames(divisionMap);
            } catch (error) {
                console.error('Failed to fetch dropdown data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDropdownData();
    }, [accountId]);

    const transformStudentData = useCallback((student) => ({
        ...student,
        rollno: student.rollNo || student.id,
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.userName,
        schoolName: schoolNames[student.schoolId] || 'N/A',
        className: classNames[student.classId] || 'N/A',
        divisionName: divisionNames[student.divisionId] || 'N/A'
    }), [schoolNames, classNames, divisionNames]);

    const handleUploadSuccess = () => {
        setOpenBulkUpload(false);
        // This is a good place to trigger a refresh of the data grid if needed.
    };

    if (loading) {
        return (
            <MainCard title="Students Management">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    // Create the custom header element here
    const customHeaderActions = (
        <Stack direction="row" spacing={1} alignItems="center">
            <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => setOpenBulkUpload(true)}
            >
                Bulk Upload
            </Button>
            
        </Stack>
    );

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        title="STUDENTS"
                        fetchUrl={`/api/users/getAll/${accountId}?type=STUDENT`}
                        isPostRequest={true}
                        columns={columnsConfig}
                        addActionUrl={"/masters/student/add"}
                        editUrl="/masters/student/edit"
                        deleteUrl="/api/users/delete"
                        viewUrl="/masters/students/view"
                        entityName="STUDENT"
                        searchPlaceholder="Search students by name, email, or roll number..."
                        showSearch={true}
                        showRefresh={true}
                        showFilters={true}
                        pageSizeOptions={[5, 10, 25, 50]}
                        defaultPageSize={10}
                        height={600}
                        transformData={transformStudentData}
                        enableFilters={true}
                        showSchoolFilter={true}
                        showClassFilter={true}
                        showDivisionFilter={true}
                        customActionsHeader={customHeaderActions}
                    />
                </Grid>
            </Grid>
            <BulkUploadModal
                open={openBulkUpload}
                handleClose={() => setOpenBulkUpload(false)}
                handleSuccess={handleUploadSuccess}
            />
        </>
    );
};

export default Students;