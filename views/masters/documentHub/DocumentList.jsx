import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import ReusableDataGrid from 'ui-component/ReusableDataGrid';
import { userDetails } from 'utils/apiService';
import { hasPermission } from 'utils/permissionUtils';
import { useSelector } from 'react-redux';
import { Download as DownloadIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import api from '../../../utils/apiService';

// Dummy Data (This data is no longer used, as we'll fetch from the API)

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'documentName', headerName: 'File Name', flex: 1 },
  { field: 'schoolName', headerName: 'School', width: 110, flex: 1 },
  { field: 'className', headerName: 'Class', width: 110, flex: 1 },
  { field: 'divisionName', headerName: 'Division', width: 110, flex: 1 },

  { field: 'userType', headerName: 'Visible To', width: 120 },
  { field: 'contentType', headerName: 'Uploaded By', width: 150 },
  { field: 'createdDate', headerName: 'Upload Date', width: 150,  }
];

const DocumentList = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  
  const accountId = userDetails.getAccountId();
  const [schoolNames, setSchoolNames] = useState({});
  const [classNames, setClassNames] = useState({});
  const [divisionNames, setDivisionNames] = useState({});
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

  const transformDocumentData = useCallback(
    (document) => ({
      ...document,
      rollno: document.rollNo || document.id,
      name: `${document.firstName || ''} ${document.lastName || ''}`.trim() || document.userName,
      schoolName: schoolNames[document.schoolId] || 'N/A',
      className: classNames[document.classId] || 'N/A',
      divisionName: divisionNames[document.divisionId] || 'N/A'
    }),
    [schoolNames, classNames, divisionNames]
  );
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
  if (loading) {
    return (
      <MainCard title="Students Management">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }
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
          transformData={transformDocumentData}
          showClassFilter={true}
          showDivisionFilter={true} 
          viewScreenIs={true}
        />
      </Grid>
    </Grid>
  );
};

export default DocumentList;
