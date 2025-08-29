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
    { field: 'createdDate', headerName: 'Upload Date', width: 150, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
];



const DocumentList = () => {
    const accountId = userDetails.getAccountId();

    const customActions = [
        {
            icon: <DownloadIcon />,
            label: 'Download',
            tooltip: 'Download Document',
            color: 'primary',
            onClick: (row) => {
            // Call backend API to download the file
            const fileId = row.id;
            const fileName = row.fileName || 'document';
            fetch(`/api/documents/download/${accountId}/${fileId}`, {
                method: 'GET',
                headers: {
                    // Add auth headers if needed
                }
            })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to download file');
                }
                const blob = await response.blob();
                // Create a link and trigger download
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
                // Optionally show error to user
                alert('Failed to download file.');
                console.error(error);
            });
            }
        }
    ];

    return (
      
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <ReusableDataGrid
                    title="Document Hub"
                        loading={false}
                        fetchUrl={`/api/documents/getAllBy/${accountId}`}
                        isPostRequest={true}
                        columns={columns}
                        deleteUrl="/api/documents/delete"
                        viewUrl={`/api/documents/download/${accountId}`}
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
                        //onFiltersChange={handleFilterChange}
                    />
                </Grid>
            </Grid>
        // </MainCard>
    );
};

export default DocumentList;