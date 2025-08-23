// views/masters/documentHub/DocumentList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from 'utils/apiService';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import { Download as DownloadIcon } from '@mui/icons-material';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fileName', headerName: 'File Name', flex: 1 },
    { field: 'schoolName', headerName: 'School', width: 150 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'divisionName', headerName: 'Division', width: 120 },
    { field: 'userType', headerName: 'Visible To', width: 120 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 150 },
    { field: 'uploadDate', headerName: 'Upload Date', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
];

// Dummy Data
const dummyDocuments = [
    {
        id: 1,
        fileName: 'Student Handbook 2024.pdf',
        schoolName: 'Greenwood High',
        className: 'Class 10',
        divisionName: 'A',
        userType: 'STUDENT',
        uploadedBy: 'Admin',
        uploadDate: '2024-08-20T10:00:00Z',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        schoolId: 1,
        classId: 1,
        divisionId: 1
    },
    {
        id: 2,
        fileName: 'Teacher Lesson Plan.docx',
        schoolName: 'Greenwood High',
        className: 'Class 10',
        divisionName: 'A',
        userType: 'TEACHER',
        uploadedBy: 'Principal',
        uploadDate: '2024-08-21T11:30:00Z',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        schoolId: 1,
        classId: 1,
        divisionId: 1
    },
    {
        id: 3,
        fileName: 'Academic Calendar.xlsx',
        schoolName: 'Oakwood Academy',
        className: 'Class 9',
        divisionName: 'B',
        userType: 'ALL',
        uploadedBy: 'Admin',
        uploadDate: '2024-08-19T14:45:00Z',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        schoolId: 2,
        classId: 2,
        divisionId: 2
    },
    {
        id: 4,
        fileName: 'Student Code of Conduct.pdf',
        schoolName: 'Greenwood High',
        className: 'Class 10',
        divisionName: 'B',
        userType: 'STUDENT',
        uploadedBy: 'Admin',
        uploadDate: '2024-08-18T09:15:00Z',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        schoolId: 1,
        classId: 1,
        divisionId: 2
    }
];

const DocumentList = () => {
    const navigate = useNavigate();
    const permissions = useSelector((state) => state.user.permissions);
    
    const [filteredDocuments, setFilteredDocuments] = useState(dummyDocuments);

    const handleFilterChange = useCallback((newFilters) => {
        let tempFiltered = dummyDocuments;
        if (newFilters.schoolId) {
            tempFiltered = tempFiltered.filter(doc => doc.schoolId == newFilters.schoolId);
        }
        if (newFilters.classId) {
            tempFiltered = tempFiltered.filter(doc => doc.classId == newFilters.classId);
        }
        if (newFilters.divisionId) {
            tempFiltered = tempFiltered.filter(doc => doc.divisionId == newFilters.divisionId);
        }
        setFilteredDocuments(tempFiltered);
    }, []);

    const customActions = [
        {
            icon: <DownloadIcon />,
            label: 'Download',
            tooltip: 'Download Document',
            color: 'primary',
            onClick: (row) => {
                window.open(row.fileUrl, '_blank');
            }
        }
    ];

    return (
        <MainCard
            title="Document Hub"
            secondary={
                <SecondaryAction icon={<AddIcon />} link="/masters/document-hub/upload" />
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                        data={filteredDocuments}
                        loading={false}
                        fetchUrl={null}
                        isPostRequest={false}
                        columns={columns}
                        deleteUrl="/api/documents/delete"
                        addActionUrl="/masters/document-hub/upload"
                        entityName="DOCUMENT_HUB"
                        customActions={customActions}
                        searchPlaceholder="Search by file name..."
                        showSearch={true}
                        showRefresh={true}
                        showFilters={true}
                        pageSizeOptions={[10, 25, 50]}
                        defaultPageSize={10}
                        height={600}
                        enableFilters={true}
                        showSchoolFilter={true}
                        showClassFilter={true}
                        showDivisionFilter={true}
                        onFiltersChange={handleFilterChange}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default DocumentList;