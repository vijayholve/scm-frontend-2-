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
import { Download as DownloadIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

// Dummy Data (This data is no longer used, as we'll fetch from the API)


const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fileName', headerName: 'File Name', flex: 1 },
    { field: 'schoolName', headerName: 'School', width: 150 },
    { field: 'className', headerName: 'Class', width: 120 },
    { field: 'divisionName', headerName: 'Division', width: 120 },
    { field: 'userType', headerName: 'Visible To', width: 120 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 150 },
    { field: 'createdDate', headerName: 'Upload Date', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
];

const DocumentList = () => {
    const navigate = useNavigate();
    const accountId = userDetails.getAccountId();
    
    // Define all actions directly in the customActions array
    const customActions = [
        {
            icon: <DownloadIcon />,
            label: 'Download',
            tooltip: 'Download Document',
            color: 'info',
            onClick: (row) => {
                const fileId = row.id;
                const fileName = row.fileName || 'document';
                fetch(`/api/documents/download/${accountId}/${fileId}`, {
                    method: 'GET',
                    headers: {}
                })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Failed to download file');
                    }
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    alert('Failed to download file.');
                    console.error(error);
                });
            }
        },
        // Add the Edit action
        {
            icon: <EditIcon />,
            label: 'Edit',
            tooltip: 'Edit Document',
            color: 'primary',
            onClick: (row) => {
                navigate(`/masters/document-hub/edit/${row.id}`);
            },
            permission: 'edit'
        },
        // Add the Delete action
        {
            icon: <DeleteIcon />,
            label: 'Delete',
            tooltip: 'Delete Document',
            color: 'error',
            onClick: (row) => {
                if (window.confirm('Are you sure you want to delete this document?')) {
                    // This logic should be handled by the ReusableDataGrid component's deleteUrl
                    // This is a placeholder for demonstration purposes
                    alert(`Deleting document with ID: ${row.id}`);
                }
            },
            permission: 'delete'
        }
    ];

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <ReusableDataGrid
                    title="Document Hub"
                    // Use a proper API endpoint to fetch data from the server
                    fetchUrl={`/api/documents/getAllBy/${accountId}`}
                    isPostRequest={true}
                    columns={columns}
                    // Remove props that are now handled by customActions
                    // deleteUrl="/api/documents/delete"
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
                />
            </Grid>
        </Grid>
    );
};

export default DocumentList;